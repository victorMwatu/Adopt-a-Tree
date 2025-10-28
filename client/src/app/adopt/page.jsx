"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

// Fetch tree suggestions by region or name
async function getTreeSuggestions(query) {
  const token = localStorage.getItem("token"); 
  const res = await fetch("http://localhost:5000/api/tree-suggestions", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(query),
  });

  if (!res.ok) throw new Error("Failed to fetch tree suggestions");
  const data = await res.json();
  return data;
}

// Adopt tree endpoint
async function adoptTree(tree) {
  const token = localStorage.getItem("token"); 
  try {
    const res = await fetch("http://localhost:5000/api/adopt-tree", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ tree }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data.error || data.message || `Server error: ${res.status}`;
      console.error("Backend error response:", data);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to server. Is it running?");
    }
    throw error;
  }
}

const treeIcons = ["🌳", "🌲", "🌴", "🌵", "🎋", "🌿", "🍃"];
const getRandomIcon = () => treeIcons[Math.floor(Math.random() * treeIcons.length)];

const Adopt = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("region");
  const [input, setInput] = useState("");
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [adoptedCards, setAdoptedCards] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const toggleMode = () => {
    setMode(prev => (prev === "region" ? "name" : "region"));
    setTrees([]);
    setInput("");
    setError(null);
  };

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
     // Case 1: API returned an array
      if (Array.isArray(data)) {
        setTrees(data.map(tree => ({ ...tree, icon: getRandomIcon() })));
      }
      // Case 2: API returned a single tree object
      else if (data && typeof data === "object" && data.species_name) {
        setTrees([{ ...data, icon: getRandomIcon() }]);
      }
      // Case 3: API returned an error or message
      else {
        console.error("Unexpected data format:", data);
        setTrees([]);
        setError("No matching trees found or unexpected response format.");
      }
      
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (tree) => {
    try {
      setActiveCard(tree.species_name);

      const parseNumber = (value) => {
        if (value === null || value === undefined || value === "") return null;
        let str = String(value)
          .replace(/kg\/year/gi, "")
          .replace(/kg/gi, "")
          .replace(/meters?/gi, "")
          .replace(/\s*m\s*/gi, "")
          .trim();
        const match = str.match(/-?\d+\.?\d*/);
        if (!match) return null;
        const num = parseFloat(match[0]);
        return isNaN(num) ? null : num;
      };

      const treePayload = {
        species_name: String(tree.species_name || tree.name || "").trim(),
        scientific_name: String(tree.scientific_name || "").trim(),
        avg_co2_absorption: parseNumber(tree.avg_co2_absorption || tree.co2_absorption) || 0,
        water_needs: String(tree.water_needs || tree.waterNeeds || "Unknown").trim(),
        growth_rate: String(tree.growth_rate || tree.growthRate || "Unknown").trim(),
        mature_height_meters: parseNumber(tree.mature_height_meters || tree.height || tree.mature_height),
        sunlight_requirement: String(tree.sunlight_requirement || tree.sunlight || "Unknown").trim(),
        drought_resistant: !!tree.drought_resistant,
      };

      if (!treePayload.species_name) {
        alert("Error: Tree species name is missing");
        setActiveCard(null);
        return;
      }

      const result = await adoptTree(treePayload);
      console.log("Adoption successful:", result);

      setAdoptedCards(prev => [...prev, tree.species_name]);
      setTimeout(() => setActiveCard(null), 1000);
    } catch (err) {
      console.error("Adoption error:", err);
      alert(`Failed to adopt tree:\n${err.message}`);
      setActiveCard(null);
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
              Get personalized tree suggestions for your region or search by tree name to track them.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className={`text-sm font-medium ${mode === "region" ? "text-green-700" : "text-gray-400"}`}>
                By Region
              </span>
              <button
                type="button"
                onClick={toggleMode}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${mode === "region" ? "bg-green-300" : "bg-green-600"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${mode === "region" ? "translate-x-1" : "translate-x-6"}`} />
              </button>
              <span className={`text-sm font-medium ${mode === "name" ? "text-green-700" : "text-gray-400"}`}>
                By Tree Name
              </span>
            </div>

            {/* Input */}
            <div className="max-w-md mx-auto flex gap-3 mb-6">
              <input
                type="text"
                placeholder={mode === "region" ? "Enter your region (e.g. Nairobi)" : "Enter your tree name (e.g. Acacia)"}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") handleFetchTrees();  
                }}
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
          {error && <div className="text-center text-red-600 font-medium mb-6">{error}</div>}

          {/* Recommendations Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {mode === "region" ? "Recommended Trees for Your Region" : "Tree Information"}
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
              <div  className={`relative grid gap-6 ${
                              trees.length === 1
                                ? "grid-cols-1 place-items-center" 
                                : "grid-cols-1 md:grid-cols-3"
                            }`}>
                {trees.map(tree => (
                  <div
                    key={tree.id || tree.species_name}
                    className={`relative bg-[#D0E9D4] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow transform ${
                      activeCard === tree.species_name ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 z-50" : ""
                    }`}
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

                    {!adoptedCards.includes(tree.species_name) ? (
                      <button
                        onClick={() => handleAdopt(tree)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Adopt 🌱
                      </button>
                    ) : (
                      <div className="flex items-center justify-center w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
                        🌱 Adopted
                      </div>
                    )}
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
