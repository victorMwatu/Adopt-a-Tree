"use client";
import Navbar from "@/components/layout/Navbar";
import React, { useState } from "react";

// Fetch tree suggestions by region or name
async function getTreeSuggestions(query) {
  const res = await fetch("http://localhost:5000/api/tree-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  if (!res.ok) throw new Error("Failed to fetch tree suggestions");

  const data = await res.json();
  return data;
}

// Random tree icons for variety
const treeIcons = ["🌳", "🌲", "🌴", "🌵", "🎋", "🌿", "🍃"];
const getRandomIcon = () => treeIcons[Math.floor(Math.random() * treeIcons.length)];

const Adopt = () => {
  const [mode, setMode] = useState("region"); // "region" or "name"
  const [input, setInput] = useState("");
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleMode = () => {
    setMode((prev) => (prev === "region" ? "name" : "region"));
    setTrees([]);
    setInput("");
    setError(null);
  };

  // Fetch tree data
  const handleFetchTrees = async () => {
    if (!input.trim()) {
      alert(`Please enter a ${mode === "region" ? "region" : "tree name"} first`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const query = mode === "region" ? { region: input } : { tree_name: input };
      const data = await getTreeSuggestions(query);
      const dataWithIcons = data.map((tree) => ({
        ...tree,
        icon: getRandomIcon(),
      }));

      setTrees(dataWithIcons);
    } catch (err) {
      console.error("Error fetching trees:", err);
      setError("Failed to fetch recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Tree Recommendations
            </h1>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get personalized tree suggestions for your region by default, or switch below if you already have a tree — enter its name to fetch details and start tracking it using this platform.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span
                className={`text-sm font-medium ${
                  mode === "region" ? "text-green-700" : "text-gray-400"
                }`}
              >
                By Region
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                  mode === "region" ? "bg-green-300" : "bg-green-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    mode === "region" ? "translate-x-1" : "translate-x-6"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium ${
                  mode === "name" ? "text-green-700" : "text-gray-400"
                }`}
              >
                By Tree Name
              </span>
            </div>

            {/* Input */}
            <div className="max-w-md mx-auto flex gap-3 mb-6">
              <input
                type="text"
                placeholder={
                  mode === "region"
                    ? "Enter your region (e.g. Nairobi)"
                    : "Enter your tree name (e.g. Acacia)"
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 font-medium"
              />
              <button
                onClick={handleFetchTrees}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-center text-red-600 font-medium mb-6">
              {error}
            </div>
          )}

          {/* Recommendations Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {mode === "region"
                ? "Recommended Trees for Your Region"
                : "Tree Information"}
            </h2>

            {trees.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  {input
                    ? "No results found for your search."
                    : `Enter a ${mode === "region" ? "region" : "tree name"} above to get started.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trees.map((tree) => (
                  <div
                    key={tree.id || tree.species_name}
                    className="bg-[#D0E9D4] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="text-5xl text-center mb-3">{tree.icon}</div>

                    <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                      {tree.species_name}
                    </h3>

                    <div className="space-y-2 mb-6 text-center text-gray-600 text-sm">
                      <p><strong>Scientific:</strong> {tree.scientific_name}</p>
                      <p><strong>CO₂ Absorption:</strong> {tree.avg_co2_absorption} kg/year</p>
                      <p><strong>Water:</strong> {tree.water_needs}</p>
                      <p><strong>Growth Rate:</strong> {tree.growth_rate}</p>
                      <p><strong>Height:</strong> {tree.mature_height_meters} m</p>
                      <p><strong>Sunlight:</strong> {tree.sunlight_requirement}</p>
                      <p><strong>Drought Resistant:</strong> {tree.drought_resistant ? "Yes" : "No"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Adopt;
