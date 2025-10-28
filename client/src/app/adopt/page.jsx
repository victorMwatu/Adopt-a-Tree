"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

const Adopt = () => {
  const [trees, setTrees] = useState([]);
  const [aiTrees, setAiTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("Nairobi");
  const [customTree, setCustomTree] = useState("");

  const kenyanCounties = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu",
    "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
    "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
    "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
    "Meru", "Migori", "Mombasa", "Muranga", "Nairobi", "Nakuru", "Nandi",
    "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya",
    "Taita-Taveta", "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana",
    "Uasin Gishu", "Vihiga", "Wajir", "West Pokot",
  ];

  useEffect(() => {
    fetchAiRecommendations();
  }, [selectedRegion]);

  const fetchAiRecommendations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const query = customTree
        ? `?custom_tree=${customTree}`
        : `?region=${selectedRegion}`;
      const response = await fetch(
        `http://localhost:5000/api/trees/ai-recommend${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch AI recommendations");

      const data = await response.json();
      setAiTrees(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load AI recommendations.");
      setAiTrees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTree = async (tree) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to adopt a tree");
        return;
      }

      const response = await fetch("http://localhost:5000/api/trees/adopt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tree_id: tree.id,
          location: `${selectedRegion}, Kenya`,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedTree(tree.id);
        alert(
          `🌳 ${tree.species_name} selected! Head to your Dashboard to confirm planting and track progress.`
        );
      } else {
        alert(data.message || "Failed to adopt tree");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to adopt tree. Please try again.");
    }
  };

  const handleSuggestTree = async () => {
    if (!customTree) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to suggest a tree");
        return;
      }

      const response = await fetch("http://localhost:5000/api/trees/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tree_name: customTree }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Tree suggestion submitted successfully!");
        setCustomTree("");
      } else {
        alert(data.message || "Failed to submit suggestion");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit suggestion. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-white">
        <div className="text-center">
          <div className="text-5xl mb-4">🌳</div>
          <p className="text-gray-600">Loading AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Select Your Tree</h1>
            <p className="text-gray-600 mb-6">
              Recommendations for {selectedRegion}, Kenya.
            </p>

            <div className="max-w-md mx-auto mb-4">
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Region
              </label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 font-medium"
              >
                {kenyanCounties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="text"
                placeholder="Or Enter Custom Tree"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                value={customTree}
                onChange={(e) => setCustomTree(e.target.value)}
              />
              <button
                onClick={fetchAiRecommendations}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Suggest
              </button>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiTrees.length === 0 ? (
              <p className="text-center col-span-3 text-gray-600">
                No AI recommendations available for this region/tree.
              </p>
            ) : (
              aiTrees.map((tree, idx) => (
                <div
                  key={idx}
                  className="bg-[#D0E9D4] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <div className="text-5xl">{tree.icon || "🌳"}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                    {tree.species_name}
                  </h3>
                  <div className="space-y-2 mb-6 text-center">
                    <p>{tree.growth_rate}</p>
                    <p>{tree.water_needs}</p>
                    <p>CO₂ offset: {tree.avg_co2_absorption}/year</p>
                  </div>
                  <button
                    onClick={() => handleSelectTree(tree)}
                    disabled={selectedTree === tree.id}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedTree === tree.id
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {selectedTree === tree.id ? "✓ Selected" : "Select this tree"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Adopt;
