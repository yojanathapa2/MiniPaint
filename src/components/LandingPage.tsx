import React from 'react';
import { 
  Sparkles, 
  Brush, 
  Palette, 
  Star, 
  Heart, 
  Circle,
  Square,
  Triangle,
  Play,
  Zap,
  Download,
  Undo2
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Simple Title and Button */}
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
            Mini Paint
          </h1>
          
          {/* Start Button */}
          <button
            onClick={onStart}
            className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3">
              <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              <span>Start Creating</span>
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
          </button>
        </div>
      </div>
    </div>
  );
}