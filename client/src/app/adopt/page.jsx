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


    </div>
     </main>
  );
};

export default Adopt;