import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Brush, 
  Eraser, 
  Circle, 
  Square, 
  Minus, 
  Download, 
  Palette, 
  RotateCcw, 
  RotateCw, 
  Trash2,
  MousePointer,
  Move3D,
  Pen,
  Paintbrush,
  Sparkles,
  Zap,
  Heart,
  Star,
  Triangle,
  Eye,
  EyeOff,
  Home,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import ToolGuide from './ToolGuide';

type Tool = 'brush' | 'pen' | 'marker' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart' | 'move';

interface DrawingState {
  imageData: ImageData | null;
  tool: Tool;
  color: string;
  size: number;
}

interface PaintAppProps {
  onBack: () => void;
}

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080', '#c0c0c0',
  '#ff8080', '#80ff80', '#8080ff', '#ffff80', '#ff80ff', '#80ffff', '#ffc080', '#c080ff',
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
];

const GRADIENTS = [
  'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(45deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
];

export default function PaintApp({ onBack }: PaintAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#2563eb');
  const [size, setSize] = useState(5);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#2563eb');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const [showToolGuide, setShowToolGuide] = useState(false);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas || !previewCanvas) return;
    
    const ctx = canvas.getContext('2d');
    const previewCtx = previewCanvas.getContext('2d');
    if (!ctx || !previewCtx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    previewCanvas.width = 800;
    previewCanvas.height = 600;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const clearPreview = () => {
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;
    
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;
    
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  };

  const drawPreview = (endPos: { x: number, y: number }) => {
    if (!showPreview) return;
    
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;
    
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;
    
    clearPreview();
    
    previewCtx.strokeStyle = color;
    previewCtx.fillStyle = color;
    previewCtx.lineWidth = size;
    previewCtx.lineCap = 'round';
    previewCtx.lineJoin = 'round';
    previewCtx.globalAlpha = opacity / 100;
    
    if (tool === 'line') {
      previewCtx.beginPath();
      previewCtx.moveTo(startPos.x, startPos.y);
      previewCtx.lineTo(endPos.x, endPos.y);
      previewCtx.stroke();
    } else if (tool === 'rectangle') {
      const width = endPos.x - startPos.x;
      const height = endPos.y - startPos.y;
      previewCtx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
      previewCtx.beginPath();
      previewCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      previewCtx.stroke();
    } else if (tool === 'triangle') {
      const width = endPos.x - startPos.x;
      const height = endPos.y - startPos.y;
      previewCtx.beginPath();
      previewCtx.moveTo(startPos.x + width / 2, startPos.y);
      previewCtx.lineTo(startPos.x, startPos.y + height);
      previewCtx.lineTo(startPos.x + width, startPos.y + height);
      previewCtx.closePath();
      previewCtx.stroke();
    } else if (tool === 'star') {
      drawStar(previewCtx, startPos.x, startPos.y, Math.abs(endPos.x - startPos.x) / 2, 5);
    } else if (tool === 'heart') {
      drawHeart(previewCtx, startPos.x, startPos.y, Math.abs(endPos.x - startPos.x) / 2);
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number) => {
    const angle = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? radius : radius / 2;
      const currX = x + Math.cos(i * angle - Math.PI / 2) * r;
      const currY = y + Math.sin(i * angle - Math.PI / 2) * r;
      if (i === 0) ctx.moveTo(currX, currY);
      else ctx.lineTo(currX, currY);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (topCurveHeight + size) / 2, x, y + (topCurveHeight + size) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (topCurveHeight + size) / 2, x + size / 2, y + (topCurveHeight + size) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
    
    ctx.globalAlpha = opacity / 100;
    
    if (tool === 'brush' || tool === 'pen' || tool === 'marker') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      
      if (tool === 'brush') {
        ctx.lineWidth = size;
      } else if (tool === 'pen') {
        ctx.lineWidth = Math.max(1, size / 2);
      } else if (tool === 'marker') {
        ctx.lineWidth = size * 1.5;
        ctx.globalAlpha = 0.6;
      }
    } else if (tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setCurrentPos(pos);
    
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (tool === 'brush' || tool === 'pen' || tool === 'marker' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      // Show preview for shape tools
      drawPreview(pos);
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getMousePos(e);
    
    ctx.globalAlpha = opacity / 100;
    
    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.stroke();
    } else if (tool === 'rectangle') {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.stroke();
    } else if (tool === 'triangle') {
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      ctx.beginPath();
      ctx.moveTo(startPos.x + width / 2, startPos.y);
      ctx.lineTo(startPos.x, startPos.y + height);
      ctx.lineTo(startPos.x + width, startPos.y + height);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.stroke();
    } else if (tool === 'star') {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      drawStar(ctx, startPos.x, startPos.y, Math.abs(pos.x - startPos.x) / 2, 5);
    } else if (tool === 'heart') {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      drawHeart(ctx, startPos.x, startPos.y, Math.abs(pos.x - startPos.x) / 2);
    }
    
    // Reset composite operation and alpha
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    clearPreview();
    setIsDrawing(false);
    saveState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    clearPreview();
    saveState();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex - 1;
      const imageData = history[newIndex];
      ctx.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex + 1;
      const imageData = history[newIndex];
      ctx.putImageData(imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'mini-paint-masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const selectColor = (selectedColor: string) => {
    setColor(selectedColor);
    setShowColorPicker(false);
  };

  const applyCustomColor = () => {
    setColor(customColor);
    setShowColorPicker(false);
  };

  const getCursorStyle = () => {
    switch (tool) {
      case 'eraser': return 'crosshair';
      case 'move': return 'move';
      case 'brush': return 'crosshair';
      case 'pen': return 'crosshair';
      case 'marker': return 'crosshair';
      default: return 'crosshair';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105 group"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mini Paint Studio
                </h1>
                <p className="text-gray-600 text-sm">Create stunning digital artwork with professional tools</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                <span className="text-sm text-gray-600">Preview:</span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`p-1 rounded transition-colors ${showPreview ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                title="Undo"
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                title="Redo"
              >
                <RotateCw className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={downloadCanvas}
                className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all hover:scale-105 shadow-lg"
                title="Download Masterpiece"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowToolGuide(true)}
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all hover:scale-105 shadow-lg"
                title="Tool Guide & Algorithms"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={clearCanvas}
                className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all hover:scale-105 shadow-lg"
                title="Clear Canvas"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Enhanced Toolbar */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 w-96 h-fit">
            <div className="space-y-8">
              {/* Tools */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Drawing Tools
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { tool: 'brush', icon: Brush, label: 'Brush', gradient: 'from-blue-500 to-blue-600' },
                    { tool: 'pen', icon: Pen, label: 'Pen', gradient: 'from-gray-500 to-gray-600' },
                    { tool: 'marker', icon: Paintbrush, label: 'Marker', gradient: 'from-yellow-500 to-orange-500' },
                    { tool: 'eraser', icon: Eraser, label: 'Eraser', gradient: 'from-pink-500 to-red-500' },
                    { tool: 'line', icon: Minus, label: 'Line', gradient: 'from-green-500 to-green-600' },
                    { tool: 'rectangle', icon: Square, label: 'Rectangle', gradient: 'from-purple-500 to-purple-600' },
                    { tool: 'circle', icon: Circle, label: 'Circle', gradient: 'from-indigo-500 to-indigo-600' },
                    { tool: 'triangle', icon: Triangle, label: 'Triangle', gradient: 'from-teal-500 to-teal-600' },
                    { tool: 'star', icon: Star, label: 'Star', gradient: 'from-amber-500 to-yellow-500' },
                    { tool: 'heart', icon: Heart, label: 'Heart', gradient: 'from-rose-500 to-pink-500' },
                    { tool: 'move', icon: Move3D, label: 'Move', gradient: 'from-slate-500 to-slate-600' }
                  ].map(({ tool: toolName, icon: Icon, label, gradient }) => (
                    <button
                      key={toolName}
                      onClick={() => setTool(toolName as Tool)}
                      className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                        tool === toolName
                          ? `bg-gradient-to-br ${gradient} text-white shadow-lg scale-105`
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-sm'
                      }`}
                      title={label}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size & Opacity */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Circle className="w-4 h-4 mr-2 text-blue-600" />
                    Brush Size
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Size</span>
                      <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">{size}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-center">
                      <div
                        className="rounded-full bg-gradient-to-br from-blue-500 to-purple-500 transition-all shadow-lg"
                        style={{ width: Math.max(size / 2, 8), height: Math.max(size / 2, 8) }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Opacity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Transparency</span>
                      <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">{opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-400 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Colors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-blue-600" />
                  Color Palette
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Color</span>
                    <div 
                      className="w-12 h-12 rounded-xl border-3 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-8 gap-2">
                    {COLORS.map((colorOption) => (
                      <button
                        key={colorOption}
                        onClick={() => selectColor(colorOption)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all transform hover:scale-110 ${
                          color === colorOption ? 'border-blue-500 scale-110 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: colorOption }}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Gradient Inspirations</p>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENTS.map((gradient, index) => (
                        <div
                          key={index}
                          className="w-full h-8 rounded-lg cursor-pointer transform hover:scale-105 transition-transform shadow-sm"
                          style={{ background: gradient }}
                          onClick={() => {
                            // Extract a representative color from gradient
                            const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#a8edea'];
                            selectColor(colors[index]);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {showColorPicker && (
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border-0 cursor-pointer shadow-lg"
                        />
                        <button
                          onClick={applyCustomColor}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                        >
                          Apply Custom
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="relative border-4 border-gray-400 rounded-xl overflow-hidden shadow-inner bg-white" style={{ width: '820px', height: '620px' }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="absolute top-2 left-2 z-10 block border-2 border-gray-200 bg-white"
                  width={800}
                  height={600}
                  style={{ cursor: getCursorStyle() }}
                />
                <canvas
                  ref={previewCanvasRef}
                  className="absolute top-2 left-2 z-20 pointer-events-none block"
                  width={800}
                  height={600}
                  style={{ opacity: showPreview ? 0.8 : 0 }}
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    Canvas: 800 × 600 px
                  </span>
                  <span className="flex items-center">
                    <MousePointer className="w-4 h-4 mr-1" />
                    Tool: {tool.charAt(0).toUpperCase() + tool.slice(1)}
                  </span>
                  <span className="flex items-center">
                    <Circle className="w-4 h-4 mr-1" />
                    Position: {Math.round(currentPos.x)}, {Math.round(currentPos.y)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>History: {historyIndex + 1}/{history.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ToolGuide isOpen={showToolGuide} onClose={() => setShowToolGuide(false)} />
    </div>
  );
}