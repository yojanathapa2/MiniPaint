import React from 'react';
import { 
  Brush, 
  Palette, 
  Star, 
  Heart, 
  Circle,
  Play,
  Zap,
  Activity,
  Grid3x3,
  Calculator,
  Binary,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onStartPaint: () => void;
  onStartAlgorithms: () => void;
}

export default function LandingPage({ onStartPaint, onStartAlgorithms }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-bounce"></div>
        
        {/* Additional algorithm-themed background elements */}
        <div className="absolute top-60 left-60 w-16 h-16 border-2 border-cyan-400 opacity-30 animate-spin rounded-lg"></div>
        <div className="absolute bottom-60 right-60 w-20 h-20 border-2 border-pink-400 opacity-30 animate-pulse rotate-45"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Main Title */}
        <div className="text-center mb-14">
          <h1 className="text-6xl font-bold mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
            Mini Paint
          </h1>
          <p className="text-lg text-indigo-200 mb-6 max-w-2xl mx-auto">
            Choose your creative journey - Express your artistic side or explore the mathematical beauty behind computer graphics
          </p>
        </div>
        
        {/* Two Main Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl w-full">
          
          {/* Creative Paint Option */}
          <div className="group relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <Brush className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Creative Studio</h2>
                <p className="text-indigo-200 mb-5 text-base">
                  Unleash your creativity with professional drawing tools, brushes, and artistic features
                </p>
                
                {/* Feature icons */}
                <div className="flex justify-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Circle className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                
                <button
                  onClick={onStartPaint}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg text-white font-bold text-base shadow-xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Creating</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Algorithm Visualizer Option */}
          <div className="group relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Algorithm Visualizer</h2>
                <p className="text-indigo-200 mb-5 text-base">
                  Explore computer graphics algorithms with pixel-level visualization and step-by-step animation
                </p>
                
                {/* Algorithm feature icons */}
                <div className="flex justify-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Grid3x3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Binary className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                
                <button
                  onClick={onStartAlgorithms}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-lg text-white font-bold text-base shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Explore Algorithms</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm List Showcase */}
        <div className="mt-12 text-center max-w-4xl">
          <h3 className="text-xl font-bold text-white mb-5">Available Algorithms</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'DDA Line', icon: '📏', color: 'from-red-400 to-pink-500' },
              { name: 'Bresenham', icon: '📐', color: 'from-orange-400 to-red-500' },
              { name: 'Wu Line', icon: '✨', color: 'from-yellow-400 to-orange-500' },
              { name: 'Midpoint Circle', icon: '⭕', color: 'from-green-400 to-emerald-500' },
              { name: 'Flood Fill', icon: '🎨', color: 'from-blue-400 to-cyan-500' },
              { name: 'Bézier Curve', icon: '🌊', color: 'from-purple-400 to-indigo-500' }
            ].map((algo, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${algo.color} rounded-md flex items-center justify-center mx-auto mb-1 text-lg`}>
                  {algo.icon}
                </div>
                <div className="text-white text-xs font-semibold">{algo.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-indigo-300 text-xs">
            🎓 Computer Graphics Project • Mathematical Algorithms Visualization • Creative Digital Art
          </p>
        </div>
      </div>
    </div>
  );
}




// talako ramro cha 

// import React from 'react';
// import { 
//   Sparkles, 
//   Brush, 
//   Palette, 
//   Star, 
//   Heart, 
//   Circle,
//   Square,
//   Triangle,
//   Play,
//   Zap,
//   Download,
//   Undo2,
//   Activity,
//   Grid3x3,
//   Calculator,
//   Binary,
//   Cpu,
//   ArrowRight
// } from 'lucide-react';

// interface LandingPageProps {
//   onStartPaint: () => void;
//   onStartAlgorithms: () => void;
// }

// export default function LandingPage({ onStartPaint, onStartAlgorithms }: LandingPageProps) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
//         <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-bounce"></div>
        
//         {/* Additional algorithm-themed background elements */}
//         <div className="absolute top-60 left-60 w-16 h-16 border-2 border-cyan-400 opacity-30 animate-spin rounded-lg"></div>
//         <div className="absolute bottom-60 right-60 w-20 h-20 border-2 border-pink-400 opacity-30 animate-pulse rotate-45"></div>
//       </div>

//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
//         {/* Main Title */}
//         <div className="text-center mb-16">
//           <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
//             Mini Paint
//           </h1>
//           <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
//             Choose your creative journey - Express your artistic side or explore the mathematical beauty behind computer graphics
//           </p>
//         </div>
        
//         {/* Two Main Options */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
          
//           {/* Creative Paint Option */}
//           <div className="group relative">
//             <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
//                   <Brush className="w-10 h-10 text-white" />
//                 </div>
                
//                 <h2 className="text-3xl font-bold text-white mb-4">Creative Studio</h2>
//                 <p className="text-indigo-200 mb-6 text-lg">
//                   Unleash your creativity with professional drawing tools, brushes, and artistic features
//                 </p>
                
//                 {/* Feature icons */}
//                 <div className="flex justify-center space-x-4 mb-8">
//                   <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
//                     <Palette className="w-6 h-6 text-pink-400" />
//                   </div>
//                   <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <Star className="w-6 h-6 text-purple-400" />
//                   </div>
//                   <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
//                     <Heart className="w-6 h-6 text-indigo-400" />
//                   </div>
//                   <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
//                     <Circle className="w-6 h-6 text-cyan-400" />
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={onStartPaint}
//                   className="group/btn relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-xl text-white font-bold text-lg shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 w-full"
//                 >
//                   <div className="flex items-center justify-center space-x-3">
//                     <Play className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
//                     <span>Start Creating</span>
//                     <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
//                   </div>
//                 </button>
//               </div>
//             </div>
            
//             {/* Floating elements around creative option */}
//             <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-400 rounded-full opacity-60 animate-bounce"></div>
//             <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
//           </div>

//           {/* Mathematical Algorithms Option */}
//           <div className="group relative">
//             <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
//               <div className="text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform duration-300">
//                   <Activity className="w-10 h-10 text-white" />
//                 </div>
                
//                 <h2 className="text-3xl font-bold text-white mb-4">Algorithm Visualizer</h2>
//                 <p className="text-indigo-200 mb-6 text-lg">
//                   Explore computer graphics algorithms with pixel-level visualization and step-by-step animation
//                 </p>
                
//                 {/* Algorithm feature icons */}
//                 <div className="flex justify-center space-x-4 mb-8">
//                   <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
//                     <Grid3x3 className="w-6 h-6 text-cyan-400" />
//                   </div>
//                   <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                     <Calculator className="w-6 h-6 text-blue-400" />
//                   </div>
//                   <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
//                     <Binary className="w-6 h-6 text-indigo-400" />
//                   </div>
//                   <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                     <Cpu className="w-6 h-6 text-purple-400" />
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={onStartAlgorithms}
//                   className="group/btn relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-xl text-white font-bold text-lg shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 w-full"
//                 >
//                   <div className="flex items-center justify-center space-x-3">
//                     <Zap className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
//                     <span>Explore Algorithms</span>
//                     <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
//                   </div>
//                 </button>
//               </div>
//             </div>
            
//             {/* Floating elements around algorithm option */}
//             <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-cyan-400 rounded opacity-60 animate-spin"></div>
//             <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-blue-400 rounded-full opacity-60 animate-pulse"></div>
//           </div>
//         </div>

//         {/* Algorithm List Showcase */}
//         <div className="mt-16 text-center max-w-4xl">
//           <h3 className="text-2xl font-bold text-white mb-6">Available Algorithms</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {[
//               { name: 'DDA Line', icon: '📏', color: 'from-red-400 to-pink-500' },
//               { name: 'Bresenham', icon: '📐', color: 'from-orange-400 to-red-500' },
//               { name: 'Wu Line', icon: '✨', color: 'from-yellow-400 to-orange-500' },
//               { name: 'Midpoint Circle', icon: '⭕', color: 'from-green-400 to-emerald-500' },
//               { name: 'Flood Fill', icon: '🎨', color: 'from-blue-400 to-cyan-500' },
//               { name: 'Bézier Curve', icon: '🌊', color: 'from-purple-400 to-indigo-500' }
//             ].map((algo, index) => (
//               <div
//                 key={index}
//                 className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
//               >
//                 <div className={`w-12 h-12 bg-gradient-to-br ${algo.color} rounded-lg flex items-center justify-center mx-auto mb-2 text-xl`}>
//                   {algo.icon}
//                 </div>
//                 <div className="text-white text-sm font-semibold">{algo.name}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-16 text-center">
//           <p className="text-indigo-300 text-sm">
//             🎓 Computer Graphics Project • Mathematical Algorithms Visualization • Creative Digital Art
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



// my try  is above  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////







// import React from 'react';
// import { 
//   Sparkles, 
//   Brush, 
//   Palette, 
//   Star, 
//   Heart, 
//   Circle,
//   Square,
//   Triangle,
//   Play,
//   Zap,
//   Download,
//   Undo2
// } from 'lucide-react';

// interface LandingPageProps {
//   onStart: () => void;
// }

// export default function LandingPage({ onStart }: LandingPageProps) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
//         <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-bounce"></div>
//       </div>

//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
//         {/* Simple Title and Button */}
//         <div className="text-center">
//           <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
//             Mini Paint
//           </h1>
          
//           {/* Start Button */}
//           <button
//             onClick={onStart}
//             className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
//           >
//             <div className="flex items-center space-x-3">
//               <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
//               <span>Start Creating</span>
//               <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
//             </div>
            
//             {/* Animated border */}
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

