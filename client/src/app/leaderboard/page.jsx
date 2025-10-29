"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://adopt-a-tree.onrender.com/api/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const data = await response.json();
        setLeaders(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navbar />
       <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 "> 
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Leaderboard</h1>

        {loading && <p className="text-center mt-20 text-xl text-gray-900">Loading leaderboard...</p>}
        {error && <p className="text-center mt-20 text-xl text-red-600">{error}</p>}
        {!loading && !error && !leaders.length && (
          <p className="text-center mt-20 text-xl text-gray-900">No leaderboard data available.</p>
        )}

        {!loading && !error && leaders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Rank</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Trees</th>
                  <th className="py-3 px-6 text-left">CO₂ Offset</th>
                  <th className="py-3 px-6 text-left">Badge</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((user, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 text-gray-900`}
                  >
                    <td className="py-4 px-6">{index + 1}</td>
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.total_trees}</td>
                    <td className="py-4 px-6">{user.total_co2_offset} kg</td>
                    <td className="py-4 px-6">
                      {user.badge === "Gold" && <span className="text-yellow-400 font-bold">🏆 Gold</span>}
                      {user.badge === "Silver" && <span className="text-gray-400 font-bold">🥈 Silver</span>}
                      {user.badge === "Bronze" && <span className="text-orange-400 font-bold">🥉 Bronze</span>}
                      {!user.badge && <span className="text-gray-500">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
       </div>
      
    </>
  );
};

export default Leaderboard;
