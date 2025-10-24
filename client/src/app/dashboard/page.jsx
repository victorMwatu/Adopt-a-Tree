import React from 'react';
import Navbar from "../../components/layout/Navbar";
import heroImage from '../../../public/assets/Dashboard_hero_image.png';


export default function Dashboard() {
  const trees = [
    {
      id: 1,
      name: 'Acacia',
      stage: 'Seedling',
      icon: '🌱',
      progress: 35,
      age: 15,
      status: 'pending'
    },
    {
      id: 2,
      name: 'Acacia',
      stage: 'Young Tree',
      icon: '🌿',
      progress: 65,
      age: 89,
      status: 'active'
    },
    {
      id: 3,
      name: 'Acacia',
      stage: 'Mature',
      icon: '🌳',
      progress: 100,
      age: 412,
      status: 'mature'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
    <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        {/* Main Content */}
        <div>
            {/* Welcome Section */}
            <div className="p-10 text-white mb-8 relative overflow-hidden bg-cover bg-center" style={{backgroundImage: `url(${heroImage})`}}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 to-green-600/70"></div>
            <h1 className="text-3xl font-bold mb-2 relative z-10">Welcome back, Jane! 🌱</h1>
            <p className="opacity-95 relative z-10">You're making a real difference. Keep growing!</p>
            <div className="flex gap-8 mt-6 relative z-10 flex-wrap">
                <div className="flex items-center gap-2">
                <span className="text-2xl">🌳</span>
                <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-sm opacity-90">Trees Planted</div>
                </div>
                </div>
                <div className="flex items-center gap-2">
                <span className="text-2xl">💨</span>
                <div>
                    <div className="text-2xl font-bold">12,000 kg</div>
                    <div className="text-sm opacity-90">CO₂ Offset</div>
                </div>
                </div>
                <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                    <div className="text-2xl font-bold">#7</div>
                    <div className="text-sm opacity-90">in Nairobi</div>
                </div>
                </div>
                <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm opacity-90">Days Active</div>
                </div>
                </div>
            </div>
            </div>
        </div>

            <div className="max-w-7xl mx-auto p-8">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
                {/* My Trees */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">My Trees</h2>
                    <a href="#" className="text-green-600 text-sm font-medium hover:text-green-700">View All →</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {trees.map(tree => (
                    <div key={tree.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:border-2 hover:border-green-500 border-2 border-transparent">
                        <div className="text-5xl mb-2">{tree.icon}</div>
                        <div className="font-semibold text-green-900 mb-1">{tree.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{tree.stage}</div>
                        <div className="bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-green-300 h-full rounded-full transition-all"
                            style={{ width: `${tree.progress}%` }}
                        />
                        </div>
                        <small className="text-xs text-gray-600">{tree.age} days old</small>
                        {tree.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                            Confirm Planting
                            </button>
                        </div>
                        )}
                        {tree.status === 'active' && (
                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                            Delete
                            </button>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                {/* AI Insights */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">AI Tips for You</h2>
                </div>
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                        <span>🤖</span>
                        <span className="font-semibold text-blue-900 text-sm">Care Reminder</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Your Acacia seedling needs watering! Young acacias thrive with consistent moisture in their first 3 months.
                    </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                        <span>💡</span>
                        <span className="font-semibold text-blue-900 text-sm">Recommendation</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Based on Nairobi's climate, consider adding a drought-resistant Baobab next. It absorbs 3,000kg CO₂/year!
                    </p>
                    </div>
                </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
                    <div className="text-3xl">🌟</div>
                    <div className="flex-1">
                        <div className="font-semibold text-yellow-900 mb-1">First Tree</div>
                        <div className="text-sm text-gray-600">Plant your first tree</div>
                    </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
                    <div className="text-3xl">🔥</div>
                    <div className="flex-1">
                        <div className="font-semibold text-yellow-900 mb-1">7-Day Streak</div>
                        <div className="text-sm text-gray-600">Check in 7 days in a row</div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 flex-wrap">
            <button className="flex-1 min-w-fit px-6 py-4 bg-gradient-to-br from-green-500 to-green-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <span>🌳</span>
                <span>Adopt New Tree</span>
            </button>
            <button className="flex-1 min-w-fit px-6 py-4 bg-white text-green-600 border-2 border-green-500 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <span>🏅</span>
                <span>View Leaderboard</span>
            </button>
            </div>
        </div>
        </div>
    </main>
  );
}