"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [trees, setTrees] = useState([]);
  const [aiTips, setAiTips] = useState([]);

  //Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  //Fetch Dashboard data when user is ready
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        //Fetch all trees
        const res = await fetch(`http://localhost:5000/api/trees/${user.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch trees");
        const data = await res.json();
        setTrees(data);

        //Check if AI tips need refresh (every 24h)
        const lastFetch = localStorage.getItem("lastAITipsFetch");
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastFetch || now - parseInt(lastFetch) > oneDay) {
          // Generate new insights
          if (data.length > 0) {
            const randomTrees = data.sort(() => 0.5 - Math.random()).slice(0, 2);
            const insightTypes = ["care reminder", "recommendation"];
            const fetchedInsights = [];

            for (let i = 0; i < randomTrees.length; i++) {
              const tree = randomTrees[i];
              const type = insightTypes[i % insightTypes.length];

              try {
                const insightRes = await fetch("http://localhost:5000/api/ai-insight", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user_tree_id: tree.id,
                    insight_type: type,
                  }),
                });

                if (insightRes.ok) {
                  const insight = await insightRes.json();
                  if (insight.message && insight.message.trim() !== "") {
                    fetchedInsights.push(insight);
                  }
                }

              } catch (err) {
                console.error("Error fetching AI insight:", err);
              }
            }

            // Save new tips
            if (fetchedInsights.length > 0) {
              setAiTips(fetchedInsights);
              localStorage.setItem("aiTips", JSON.stringify(fetchedInsights));
              localStorage.setItem("lastAITipsFetch", now.toString());
            }

          }
        } else {
          //Load cached tips if still valid
          const cached = localStorage.getItem("aiTips");
          if (cached) setAiTips(JSON.parse(cached));
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handlePlanting = async (treeId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/trees/${treeId}/confirm`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to confirm planting");

    const updated = await res.json();

    
    setTrees((prev) =>
      prev.map((t) =>
        t.id === treeId
          ? {
              ...t,
              status: "confirmed",
              growth_stage: "Seedling",
              progress: 0, 
            }
          : t
      )
    );

    alert("🌱 Tree planting confirmed successfully!");
  } catch (err) {
    console.error("Error confirming planting:", err);
    alert("Failed to confirm planting. Please try again.");
  }
};

const handleDelete = async (treeId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this tree? This action cannot be undone.");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/trees/${treeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete tree");

    setTrees((prev) => prev.filter((t) => t.id !== treeId));
    alert("🗑️ Tree deleted successfully.");
  } catch (err) {
    console.error("Error deleting tree:", err);
    alert("Failed to delete tree. Please try again.");
  }
};



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
                          <button onClick={() => handlePlanting(tree.id)} className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                            Confirm Planting
                          </button>
                        </div>
                      )}

                      {tree.status === "confirmed" && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleDelete(tree.id)} className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
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
                  {aiTips.length === 0 ? (
                    <p className="text-sm text-gray-500">Loading AI insights...</p>
                  ) : (
                    aiTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4"
                      >
                        <span className="font-semibold text-blue-900 text-sm block mb-1 capitalize">
                          {tip.insight_type}
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">{tip.message}</p>
                      </div>
                    ))
                  )}
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
              <button 
              onClick={() => router.push('/adopt')}
              className="flex-1 min-w-fit px-6 py-4 bg-gradient-to-br from-green-500 to-green-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <span>Adopt New Tree</span>
              </button>

              <button 
               onClick={() => router.push('/leaderboard')}
              className="flex-1 min-w-fit px-6 py-4 bg-white text-green-600 border-2 border-green-500 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <span>View Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}