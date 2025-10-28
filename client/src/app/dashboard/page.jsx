"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [trees, setTrees] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Fetch trees when user is ready
  useEffect(() => {
    if (!user) return;

    const fetchTrees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/trees/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch trees");
        }

        const data = await res.json();
        // Limit to 3 trees
        setTrees(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching trees:", err);
      }
    };

    fetchTrees();
  }, [user]);

  const handleConfirm = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/trees/${id}/confirm`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to confirm tree");
      setTrees((prev) =>
        prev.map((tree) =>
          tree.id === id ? { ...tree, status: "active", age: 0, progress: 0 } : tree
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/trees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete tree");
      setTrees((prev) => prev.filter((tree) => tree.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 ml-64">
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-6">
            {/* My Trees Section */}
            <div id="my-trees" className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Trees</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {trees.length === 0 ? (
                  <p className="text-gray-500 text-sm">No trees yet...</p>
                ) : (
                  trees.map((tree) => (
                    <div
                      key={tree.id}
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:border-2 hover:border-green-500 border-2 border-transparent"
                    >
                      <div className="text-5xl mb-2">{tree.icon}</div>
                      <div className="font-semibold text-green-900 mb-1">
                        {tree.nickname || tree.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {tree.growth_stage}
                      </div>
                      <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-300 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (tree.age / 1092) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <small className="text-xs text-gray-600 mb-2">
                        {tree.age} days old
                      </small>

                      {tree.status === "pending_confirmation" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleConfirm(tree.id)}
                            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            Confirm Planting
                          </button>
                        </div>
                      )}

                      {tree.status === "active" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleDelete(tree.id)}
                            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
