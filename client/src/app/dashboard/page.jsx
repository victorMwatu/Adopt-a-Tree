"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [trees, setTrees] = useState([]);

  //Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      router.push("/login");
    }
  }, [user, router]);

  //Fetch trees when user is ready
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
        setTrees(data);
      } catch (err) {
        console.error("Error fetching trees:", err);
      }
    };

    fetchTrees();
  }, [user]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 ml-64">
        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-6">
            {/* ===================== My Trees Section ===================== */}
            <div id="my-trees" className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Trees
                </h2>
                <a
                  href="#"
                  className="text-green-600 text-sm font-medium hover:text-green-700"
                >
                  View All →
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {trees.length === 0 ? (
                  <p className="text-gray-500 text-sm">Loading trees...</p>
                ) : (
                  trees.map((tree) => (
                    <div
                      key={tree.id}
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:border-2 hover:border-green-500 border-2 border-transparent"
                    >
                      <div className="text-5xl mb-2">{tree.icon}</div>
                      <div className="font-semibold text-green-900 mb-1">
                        {tree.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {tree.growth_stage}
                      </div>
                      <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-300 h-full rounded-full transition-all"
                          style={{ width: `${tree.progress}%` }}
                        />
                      </div>
                      <small className="text-xs text-gray-600">
                        {tree.age} days old
                      </small>

                      {tree.status === "pending_confirmation" && (
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                            Confirm Planting
                          </button>
                        </div>
                      )}

                      {tree.status === "active" && (
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ===================== AI Tips Section ===================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  AI Tips for You
                </h2>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <span className="font-semibold text-blue-900 text-sm block mb-1">
                      Care Reminder
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Your Acacia seedling needs watering! Young acacias thrive
                      with consistent moisture in their first 3 months.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <span className="font-semibold text-blue-900 text-sm block mb-1">
                      Recommendation
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Based on Nairobi's climate, consider adding a
                      drought-resistant Baobab next. It absorbs 3,000 kg CO₂ per
                      year!
                    </p>
                  </div>
                </div>
              </div>

              {/* ===================== Achievements Section ===================== */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Achievements
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex-1">
                      <div className="font-semibold text-yellow-900 mb-1">
                        First Tree
                      </div>
                      <div className="text-sm text-gray-600">
                        Plant your first tree
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex-1">
                      <div className="font-semibold text-yellow-900 mb-1">
                        7-Day Streak
                      </div>
                      <div className="text-sm text-gray-600">
                        Check in 7 days in a row
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================== Quick Actions Section ===================== */}
            <div className="flex gap-4 flex-wrap">
              <button className="flex-1 min-w-fit px-6 py-4 bg-gradient-to-br from-green-500 to-green-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <span>Adopt New Tree</span>
              </button>

              <button className="flex-1 min-w-fit px-6 py-4 bg-white text-green-600 border-2 border-green-500 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <span>View Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}