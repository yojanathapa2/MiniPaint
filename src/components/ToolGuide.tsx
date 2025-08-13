import React, { useState } from 'react';
import { 
  Brush, 
  Pen, 
  Paintbrush, 
  Eraser, 
  Minus, 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  Heart, 
  Droplets, 
  Spline,
  Info,
  X,
  Zap,
  Eye
} from 'lucide-react';

interface ToolGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolGuide({ isOpen, onClose }: ToolGuideProps) {
  const [selectedTool, setSelectedTool] = useState<string>('brush');

  if (!isOpen) return null;

  const tools = [
    {
      id: 'brush',
      icon: Brush,
      name: 'Brush Tool',
      description: 'Freehand drawing with variable thickness',
      usage: 'Click and drag to draw smooth, flowing lines. Perfect for artistic sketching and painting.',
      algorithm: 'Uses canvas stroke() with interpolation between mouse points',
      tips: [
        'Adjust brush size for different line weights',
        'Lower opacity for watercolor effects',
        'Use for general drawing and sketching'
      ]
    },
    {
      id: 'pen',
      name: 'Pen Tool',
      icon: Pen,
      description: 'Precise drawing with thin, consistent lines',
      usage: 'Click and drag for detailed work. Line thickness is half of brush size setting.',
      algorithm: 'Similar to brush but with reduced line width for precision',
      tips: [
        'Best for detailed illustrations',
        'Consistent line weight',
        'Great for technical drawings'
      ]
    },
    {
      id: 'marker',
      name: 'Marker Tool',
      icon: Paintbrush,
      description: 'Bold strokes with semi-transparency',
      usage: 'Click and drag for bold, highlighted effects. Creates thick, semi-transparent strokes.',
      algorithm: 'Uses increased line width (1.5x) with reduced opacity (60%)',
      tips: [
        'Perfect for highlighting',
        'Creates layered color effects',
        'Good for bold artistic strokes'
      ]
    },
    {
      id: 'eraser',
      name: 'Eraser Tool',
      icon: Eraser,
      description: 'Remove parts of your drawing',
      usage: 'Click and drag to erase. Uses destination-out composite operation.',
      algorithm: 'Uses globalCompositeOperation = "destination-out" to remove pixels',
      tips: [
        'Adjust size for precision erasing',
        'Can create interesting effects',
        'Use for corrections and highlights'
      ]
    },
    {
      id: 'line',
      name: 'Line Tool',
      icon: Minus,
      description: 'Draw straight lines using computer graphics algorithms',
      usage: 'Click to set start point, drag to end point, release to draw line.',
      algorithm: 'Implements Bresenham\'s, DDA, or Wu\'s line algorithms',
      tips: [
        'Choose algorithm: Bresenham (fast), DDA (simple), Wu (smooth)',
        'Bresenham uses only integers - most efficient',
        'Wu\'s algorithm provides anti-aliasing for smooth lines'
      ]
    },
    {
      id: 'rectangle',
      name: 'Rectangle Tool',
      icon: Square,
      description: 'Draw rectangles using line algorithms',
      usage: 'Click and drag from one corner to opposite corner.',
      algorithm: 'Combines 4 line segments using selected line algorithm',
      tips: [
        'Uses same algorithm as line tool',
        'Perfect geometric shapes',
        'Great for UI mockups and layouts'
      ]
    },
    {
      id: 'circle',
      name: 'Circle Tool',
      icon: Circle,
      description: 'Draw perfect circles using Midpoint Circle Algorithm',
      usage: 'Click center point, drag to set radius, release to draw.',
      algorithm: 'Midpoint Circle Algorithm (Bresenham\'s Circle) - uses 8-way symmetry',
      tips: [
        'Uses only integer arithmetic',
        'Calculates 1/8 of circle, mirrors for efficiency',
        'Perfect mathematical circles'
      ]
    },
    {
      id: 'triangle',
      name: 'Triangle Tool',
      icon: Triangle,
      description: 'Draw triangles using line algorithms',
      usage: 'Click and drag to define triangle bounds.',
      algorithm: 'Combines 3 line segments using selected line algorithm',
      tips: [
        'Creates isosceles triangles',
        'Uses line algorithm for each edge',
        'Good for geometric designs'
      ]
    },
    {
      id: 'star',
      name: 'Star Tool',
      icon: Star,
      description: 'Draw 5-pointed stars',
      usage: 'Click center, drag to set size.',
      algorithm: 'Calculates 10 points using trigonometry, connects with lines',
      tips: [
        'Creates perfect 5-pointed stars',
        'Uses polar coordinates',
        'Great for decorative elements'
      ]
    },
    {
      id: 'heart',
      name: 'Heart Tool',
      icon: Heart,
      description: 'Draw heart shapes',
      usage: 'Click and drag to set heart size.',
      algorithm: 'Uses Bézier curves and circles to create heart shape',
      tips: [
        'Combines geometric shapes',
        'Perfect for decorative art',
        'Mathematically precise curves'
      ]
    },
    {
      id: 'bucket',
      name: 'Bucket Fill Tool',
      icon: Droplets,
      description: 'Fill enclosed areas with color',
      usage: 'Click on any area to fill it with current color.',
      algorithm: 'Flood Fill Algorithm - 4-connected pixel replacement',
      tips: [
        'Fills connected pixels of same color',
        'Uses stack-based approach to avoid recursion',
        'Great for coloring enclosed shapes'
      ]
    },
    {
      id: 'bezier',
      name: 'Bézier Curve Tool',
      icon: Spline,
      description: 'Draw smooth curves using control points',
      usage: 'Click 4 points to define curve: start, control1, control2, end.',
      algorithm: 'Cubic Bézier curves using Bernstein polynomials',
      tips: [
        'Creates mathematically smooth curves',
        'Used in vector graphics and fonts',
        'Control points define curve shape'
      ]
    }
  ];

  const selectedToolData = tools.find(tool => tool.id === selectedTool);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Mini Paint Tool Guide</h2>
                <p className="text-blue-100">Learn about drawing tools and computer graphics algorithms</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Tool List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Drawing Tools</h3>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedTool === tool.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className={`text-sm ${
                            selectedTool === tool.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {tool.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tool Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedToolData && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white">
                    <selectedToolData.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedToolData.name}</h3>
                    <p className="text-gray-600">{selectedToolData.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Usage */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      How to Use
                    </h4>
                    <p className="text-blue-700">{selectedToolData.usage}</p>
                  </div>

                  {/* Algorithm */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Computer Graphics Algorithm
                    </h4>
                    <p className="text-purple-700">{selectedToolData.algorithm}</p>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">💡 Pro Tips</h4>
                    <ul className="space-y-2">
                      {selectedToolData.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2 text-green-700">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Algorithm Comparison for Line Tools */}
                  {['line', 'rectangle', 'triangle'].includes(selectedTool) && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-3">🔬 Algorithm Comparison</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/50 rounded-lg p-3">
                          <h5 className="font-medium text-amber-800">Bresenham's</h5>
                          <p className="text-amber-700">Fast, integer-only, industry standard</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <h5 className="font-medium text-amber-800">DDA</h5>
                          <p className="text-amber-700">Simple, educational, may use floats</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <h5 className="font-medium text-amber-800">Wu's Line</h5>
                          <p className="text-amber-700">Anti-aliased, smooth, slower</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}