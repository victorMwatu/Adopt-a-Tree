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

    </div>
     </main>
  );
};

export default Adopt;