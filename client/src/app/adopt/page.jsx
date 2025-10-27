"use client";
import Navbar from "@/components/layout/Navbar";

import React, { useState, useEffect } from 'react';
import { TreeDeciduous } from 'lucide-react';

const Adopt = () => {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Nairobi');

  const kenyanCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Muranga', 
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  useEffect(() => {
    fetchTrees();
  }, [selectedRegion]); 

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/trees/available?region=${selectedRegion}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trees');
      }
      
      const data = await response.json();
      setTrees(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trees:', err);
      setError('Failed to load trees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTree = async (treeId, treeName) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to adopt a tree');
        return;
      }

      const response = await fetch('http://localhost:5000/api/trees/adopt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tree_id: treeId,
          location: `${selectedRegion}, Kenya`
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`🌳 ${treeName} adopted successfully!`);
        setSelectedTree(treeId);
        
      } else {
        alert(data.message || 'Failed to adopt tree');
      }
    } catch (err) {
      console.error('Error adopting tree:', err);
      alert('Failed to adopt tree. Please try again.');
    }
  };

  const handleSuggestTree = async () => {
    const treeName = prompt('What tree would you like to suggest?');
    
    if (!treeName) return;
    
    const description = prompt('Tell us more about this tree (optional):');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to suggest a tree');
        return;
      }

      const response = await fetch('http://localhost:5000/api/trees/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tree_name: treeName,
          description: description || ''
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Tree suggestion submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit suggestion');
      }
    } catch (err) {
      console.error('Error suggesting tree:', err);
      alert('Failed to submit suggestion. Please try again.');
    }
  };

  const getTreeIcon = (name) => {
    const iconMap = {
      'Cedar': '🌲',
      'Acacia': '🌳',
      'Olive': '🫒'
    };
    return iconMap[name] || '🌳';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🌳</div>
          <p className="text-gray-600">Loading trees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchTrees}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col ">
      <Navbar />
    <div className="min-h-screen bg-white">
      

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Select Your Tree</h1>
          <p className="text-gray-600 mb-6">Recommendations for {selectedRegion}, Kenya.</p>
          
          
          <div className="max-w-md mx-auto">
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
        </div>

        {/* Recommendations Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommendations</h2>
          
          {trees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No trees available for your region.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trees.map((tree) => (
                <div 
                  key={tree.id}
                className="bg-[#D0E9D4] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* Tree Icon */}
                  <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <div className="text-5xl">{getTreeIcon(tree.name)}</div>
                  </div>

                  {/* Tree Name */}
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                    {tree.name}
                  </h3>

                  {/* Tree Details */}
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600 text-center">{tree.habitat} habitat</p>
                    <p className="text-sm text-gray-600 text-center">{tree.growth_rate}</p>
                    <p className="text-sm text-gray-600 text-center">{tree.water_needs}</p>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectTree(tree.id, tree.name)}
                    disabled={selectedTree === tree.id}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedTree === tree.id
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                    }`}
                  >
                   {selectedTree === tree.id ? '✓ Adopted' : 'Adopt this tree'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

            {/* Can't Find Tree Section */}
            <div className="bg-white p-8">
              <div className="flex justify-between items-center gap-4 px-8">
                <div className="flex-1  max-w-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Can't find your tree locally?
                  </h3>
                  <input
                    type="text"
                    placeholder="Tree name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  />
                </div>
                <button 
                  onClick={handleSuggestTree}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors whitespace-nowrap"
                >
                  Add my tree
                </button>
              </div>
            </div>  
                          
      </div>
    </div>
     </main>
  );
};

export default Adopt;