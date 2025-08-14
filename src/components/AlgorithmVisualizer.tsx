import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Play,
  Square,
  Circle,
  Minus,
  MousePointer,
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface AlgorithmVisualizerProps {
  onBack: () => void;
}

type AlgorithmType = 'dda_line' | 'bresenham_line' | 'wu_line' | 'midpoint_circle' | 'flood_fill' | 'bezier_curve';

export default function AlgorithmVisualizer({ onBack }: AlgorithmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bresenham_line');
  const [canvasSize] = useState({ width: 60, height: 40 }); // Perfect grid size for visualization
  const [startPoint, setStartPoint] = useState<Point>({ x: 15, y: 15 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 45, y: 25 });
  const [center, setCenter] = useState<Point>({ x: 30, y: 20 });
  const [radius, setRadius] = useState(12);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectingWhat, setSelectingWhat] = useState<'start' | 'end' | 'center' | null>(null);
  const [pixels, setPixels] = useState<boolean[][]>([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<Point[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(150); // milliseconds per step

  // Fixed canvas settings for perfect pixel visualization
  const PIXEL_SIZE = 12; // Each pixel is 12x12 pixels on screen
  const CANVAS_WIDTH = canvasSize.width * PIXEL_SIZE;
  const CANVAS_HEIGHT = canvasSize.height * PIXEL_SIZE;

  // Initialize with empty canvas
  useEffect(() => {
    const newPixels = Array(canvasSize.height).fill(null).map(() => 
      Array(canvasSize.width).fill(false)
    );
    setPixels(newPixels);
  }, []);

  const clearPixels = () => {
    const newPixels = Array(canvasSize.height).fill(null).map(() => 
      Array(canvasSize.width).fill(false)
    );
    setPixels(newPixels);
    setAlgorithmSteps([]);
    setAnimationStep(0);
  };

  const setPixel = (x: number, y: number) => {
    if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) return;
    setPixels(prev => {
      const newPixels = [...prev];
      newPixels[y] = [...newPixels[y]];
      newPixels[y][x] = true;
      return newPixels;
    });
  };

  // DDA Line Algorithm
  const ddaLine = (start: Point, end: Point, animate = false): Point[] => {
    const steps: Point[] = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const numSteps = Math.max(Math.abs(dx), Math.abs(dy));
    
    if (numSteps === 0) {
      steps.push({ x: Math.round(start.x), y: Math.round(start.y) });
      if (!animate) setPixel(Math.round(start.x), Math.round(start.y));
      return steps;
    }
    
    const xIncrement = dx / numSteps;
    const yIncrement = dy / numSteps;
    
    let x = start.x;
    let y = start.y;
    
    for (let i = 0; i <= numSteps; i++) {
      const pixelX = Math.round(x);
      const pixelY = Math.round(y);
      steps.push({ x: pixelX, y: pixelY });
      
      if (!animate) {
        setPixel(pixelX, pixelY);
      }
      
      x += xIncrement;
      y += yIncrement;
    }
    
    return steps;
  };

  // Bresenham Line Algorithm
  const bresenhamLine = (start: Point, end: Point, animate = false): Point[] => {
    const steps: Point[] = [];
    let x0 = start.x, y0 = start.y;
    let x1 = end.x, y1 = end.y;
    
    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    
    if (steep) {
      [x0, y0] = [y0, x0];
      [x1, y1] = [y1, x1];
    }
    
    if (x0 > x1) {
      [x0, x1] = [x1, x0];
      [y0, y1] = [y1, y0];
    }
    
    const dx = x1 - x0;
    const dy = Math.abs(y1 - y0);
    let error = Math.floor(dx / 2);
    const yStep = y0 < y1 ? 1 : -1;
    let y = y0;
    
    for (let x = x0; x <= x1; x++) {
      const pixelX = steep ? y : x;
      const pixelY = steep ? x : y;
      
      steps.push({ x: pixelX, y: pixelY });
      
      if (!animate) {
        setPixel(pixelX, pixelY);
      }
      
      error -= dy;
      if (error < 0) {
        y += yStep;
        error += dx;
      }
    }
    
    return steps;
  };

  // Wu Line Algorithm (simulated anti-aliasing by plotting multiple pixels where needed)
  const wuLine = (start: Point, end: Point, animate = false): Point[] => {
    const steps: Point[] = [];
    let x0 = Math.round(start.x);
    let y0 = Math.round(start.y);
    let x1 = Math.round(end.x);
    let y1 = Math.round(end.y);

    const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

    if (steep) {
      [x0, y0] = [y0, x0];
      [x1, y1] = [y1, x1];
    }

    if (x0 > x1) {
      [x0, x1] = [x1, x0];
      [y0, y1] = [y1, y0];
    }

    const dx = x1 - x0;
    const dy = y1 - y0;
    const gradient = dx === 0 ? 1 : dy / dx;
    let intery = y0 + gradient;

    // Plot start
    const startPx = steep ? y0 : x0;
    const startPy = steep ? x0 : y0;
    steps.push({ x: startPx, y: startPy });
    if (!animate) setPixel(startPx, startPy);

    for (let x = x0 + 1; x < x1; x++) {
      const ipart = Math.floor(intery);
      const frac = intery - ipart;

      // Plot two pixels to simulate anti-aliasing
      let px1 = steep ? ipart : x;
      let py1 = steep ? x : ipart;
      steps.push({ x: px1, y: py1 });
      if (!animate) setPixel(px1, py1);

      let px2 = steep ? ipart + 1 : x;
      let py2 = steep ? x : ipart + 1;
      steps.push({ x: px2, y: py2 });
      if (!animate) setPixel(px2, py2);

      intery += gradient;
    }

    // Plot end
    const endPx = steep ? y1 : x1;
    const endPy = steep ? x1 : y1;
    steps.push({ x: endPx, y: endPy });
    if (!animate) setPixel(endPx, endPy);

    return steps;
  };

  // Midpoint Circle Algorithm
  const midpointCircle = (center: Point, radius: number, animate = false): Point[] => {
    const steps: Point[] = [];
    let x = 0;
    let y = radius;
    let p = 1 - radius;
    
    const plotCirclePoints = (cx: number, cy: number, x: number, y: number) => {
      const points = [
        { x: cx + x, y: cy + y },
        { x: cx - x, y: cy + y },
        { x: cx + x, y: cy - y },
        { x: cx - x, y: cy - y },
        { x: cx + y, y: cy + x },
        { x: cx - y, y: cy + x },
        { x: cx + y, y: cy - x },
        { x: cx - y, y: cy - x }
      ];
      
      points.forEach(point => {
        if (point.x >= 0 && point.x < canvasSize.width && 
            point.y >= 0 && point.y < canvasSize.height) {
          steps.push(point);
          if (!animate) {
            setPixel(point.x, point.y);
          }
        }
      });
    };
    
    plotCirclePoints(center.x, center.y, x, y);
    
    while (x < y) {
      x++;
      if (p < 0) {
        p = p + 2 * x + 1;
      } else {
        y--;
        p = p + 2 * (x - y) + 1;
      }
      plotCirclePoints(center.x, center.y, x, y);
    }
    
    return steps;
  };

  // Flood Fill Algorithm (BFS using queue)
  const floodFill = (seed: Point, animate = false): Point[] => {
    const steps: Point[] = [];
    const visited = Array(canvasSize.height).fill(null).map(() => Array(canvasSize.width).fill(false));

    if (seed.x < 0 || seed.x >= canvasSize.width || seed.y < 0 || seed.y >= canvasSize.height) return steps;

    const queue: Point[] = [seed];

    while (queue.length > 0) {
      const point = queue.shift()!;
      const x = point.x;
      const y = point.y;

      if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height || visited[y][x]) continue;

      visited[y][x] = true;
      steps.push(point);
      if (!animate) setPixel(x, y);

      queue.push({ x: x + 1, y });
      queue.push({ x: x - 1, y });
      queue.push({ x: x, y: y + 1 });
      queue.push({ x: x, y: y - 1 });
    }

    return steps;
  };

  // Bézier Curve Algorithm (Quadratic)
  const bezierCurve = (start: Point, control: Point, end: Point, animate = false): Point[] => {
    const steps: Point[] = [];
    const numSteps = Math.max(
      Math.abs(start.x - end.x) + Math.abs(control.x - end.x),
      Math.abs(start.y - end.y) + Math.abs(control.y - end.y)
    ) * 2; // Adaptive steps based on rough length

    for (let i = 0; i <= numSteps; i++) {
      const t = i / numSteps;
      const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
      const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
      const pixelX = Math.round(x);
      const pixelY = Math.round(y);

      // Avoid duplicates
      if (!steps.some(p => p.x === pixelX && p.y === pixelY)) {
        steps.push({ x: pixelX, y: pixelY });
        if (!animate) setPixel(pixelX, pixelY);
      }
    }

    return steps;
  };

  const animateAlgorithm = () => {
    clearPixels();
    setIsAnimating(true);
    setAnimationStep(0);
    
    let steps: Point[] = [];
    
    switch (selectedAlgorithm) {
      case 'dda_line':
        steps = ddaLine(startPoint, endPoint, true);
        break;
      case 'bresenham_line':
        steps = bresenhamLine(startPoint, endPoint, true);
        break;
      case 'wu_line':
        steps = wuLine(startPoint, endPoint, true);
        break;
      case 'midpoint_circle':
        steps = midpointCircle(center, radius, true);
        break;
      case 'flood_fill':
        steps = floodFill(center, true);
        break;
      case 'bezier_curve':
        steps = bezierCurve(startPoint, center, endPoint, true);
        break;
    }
    
    setAlgorithmSteps(steps);
    
    // Animate with user-controlled speed
    const delay = animationSpeed;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setPixel(step.x, step.y);
        setAnimationStep(index + 1);
        if (index === steps.length - 1) {
          setIsAnimating(false);
        }
      }, index * delay);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !selectingWhat) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert to grid coordinates
    const x = Math.floor(clickX / PIXEL_SIZE);
    const y = Math.floor(clickY / PIXEL_SIZE);
    
    // Ensure within bounds
    const boundedX = Math.max(0, Math.min(canvasSize.width - 1, x));
    const boundedY = Math.max(0, Math.min(canvasSize.height - 1, y));
    
    if (selectingWhat === 'start') {
      setStartPoint({ x: boundedX, y: boundedY });
    } else if (selectingWhat === 'end') {
      setEndPoint({ x: boundedX, y: boundedY });
    } else if (selectingWhat === 'center') {
      setCenter({ x: boundedX, y: boundedY });
    }
    
    setIsSelecting(false);
    setSelectingWhat(null);
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Clear with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvasSize.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * PIXEL_SIZE, 0);
      ctx.lineTo(x * PIXEL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasSize.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * PIXEL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * PIXEL_SIZE);
      ctx.stroke();
    }
    
    // Draw pixels
    ctx.fillStyle = '#3b82f6';
    for (let y = 0; y < canvasSize.height; y++) {
      if (!pixels[y]) continue;
      for (let x = 0; x < canvasSize.width; x++) {
        if (pixels[y][x]) {
          ctx.fillRect(
            x * PIXEL_SIZE + 1, 
            y * PIXEL_SIZE + 1, 
            PIXEL_SIZE - 2, 
            PIXEL_SIZE - 2
          );
        }
      }
    }
    
    // Draw control points
    const pointSize = PIXEL_SIZE - 4;
    const pointOffset = 2;
    
    // Start point (red)
    if (['dda_line', 'bresenham_line', 'wu_line', 'bezier_curve'].includes(selectedAlgorithm)) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(
        startPoint.x * PIXEL_SIZE + pointOffset, 
        startPoint.y * PIXEL_SIZE + pointOffset, 
        pointSize, 
        pointSize
      );
    }
    
    // End point (green)
    if (['dda_line', 'bresenham_line', 'wu_line', 'bezier_curve'].includes(selectedAlgorithm)) {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(
        endPoint.x * PIXEL_SIZE + pointOffset, 
        endPoint.y * PIXEL_SIZE + pointOffset, 
        pointSize, 
        pointSize
      );
    }
    
    // Center/Control/Seed point (orange)
    if (['midpoint_circle', 'flood_fill', 'bezier_curve'].includes(selectedAlgorithm)) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(
        center.x * PIXEL_SIZE + pointOffset, 
        center.y * PIXEL_SIZE + pointOffset, 
        pointSize, 
        pointSize
      );
    }
  }, [pixels, startPoint, endPoint, center, selectedAlgorithm, canvasSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const algorithms = [
    { id: 'dda_line', name: 'DDA Line', icon: Minus, description: 'Digital Differential Analyzer' },
    { id: 'bresenham_line', name: 'Bresenham Line', icon: Minus, description: 'Integer-based line drawing' },
    { id: 'wu_line', name: 'Wu Line', icon: Minus, description: 'Anti-aliased line drawing' },
    { id: 'midpoint_circle', name: 'Midpoint Circle', icon: Circle, description: 'Efficient circle drawing' },
    { id: 'flood_fill', name: 'Flood Fill', icon: Square, description: '4-connected area filling' },
    { id: 'bezier_curve', name: 'Bézier Curve', icon: RefreshCw, description: 'Smooth curve generation' }
  ];

  const isLineAlgo = ['dda_line', 'bresenham_line', 'wu_line', 'bezier_curve'].includes(selectedAlgorithm);
  const isCenterAlgo = ['midpoint_circle', 'flood_fill', 'bezier_curve'].includes(selectedAlgorithm);

  const buttonFontClass = selectedAlgorithm === 'bezier_curve' ? 'text-xs' : 'text-sm';

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-blue-290 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105 group"
                title="Back to Paint App"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Algorithm Visualizer
                </h1>
                <p className="text-gray-600 text-sm">Simple pixel-by-pixel algorithm visualization</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                <span className="text-sm text-gray-600">Steps:</span>
                <span className="text-sm font-bold text-gray-800">{animationStep}/{algorithmSteps.length}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                <span className="text-sm text-gray-600">Grid:</span>
                <span className="text-sm font-bold text-gray-800">{canvasSize.width}×{canvasSize.height}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Algorithm Selection Sidebar */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 w-80 flex-shrink-0 space-y-6">
            {/* Algorithm Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                Choose Algorithm
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {algorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgorithm(algo.id as AlgorithmType)}
                    className={`p-4 rounded-xl transition-all transform hover:scale-105 text-left ${
                      selectedAlgorithm === algo.id
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <algo.icon className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">{algo.name}</div>
                        <div className={`text-xs ${selectedAlgorithm === algo.id ? 'text-indigo-100' : 'text-gray-500'}`}>
                          {algo.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Top Controls Row */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between">
                {/* Left Side - Parameters */}
                <div className="flex items-center space-x-6">
                  {(['dda_line', 'bresenham_line', 'wu_line'].includes(selectedAlgorithm)) && (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Start:</span>
                        <button
                          onClick={() => {
                            setIsSelecting(true);
                            setSelectingWhat('start');
                          }}
                          className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                            isSelecting && selectingWhat === 'start' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-red-100 hover:bg-red-200 text-red-700'
                          }`}
                        >
                          ({startPoint.x}, {startPoint.y})
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">End:</span>
                        <button
                          onClick={() => {
                            setIsSelecting(true);
                            setSelectingWhat('end');
                          }}
                          className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                            isSelecting && selectingWhat === 'end' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          ({endPoint.x}, {endPoint.y})
                        </button>
                      </div>
                    </>
                  )}

                  {(selectedAlgorithm === 'bezier_curve') && (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Start:</span>
                        <button
                          onClick={() => {
                            setIsSelecting(true);
                            setSelectingWhat('start');
                          }}
                          className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                            isSelecting && selectingWhat === 'start' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-red-100 hover:bg-red-200 text-red-700'
                          }`}
                        >
                          ({startPoint.x}, {startPoint.y})
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Control:</span>
                        <button
                          onClick={() => {
                            setIsSelecting(true);
                            setSelectingWhat('center');
                          }}
                          className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                            isSelecting && selectingWhat === 'center' 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                          }`}
                        >
                          ({center.x}, {center.y})
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">End:</span>
                        <button
                          onClick={() => {
                            setIsSelecting(true);
                            setSelectingWhat('end');
                          }}
                          className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                            isSelecting && selectingWhat === 'end' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          ({endPoint.x}, {endPoint.y})
                        </button>
                      </div>
                    </>
                  )}

                  {selectedAlgorithm === 'midpoint_circle' && (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Center:</span>
                        <button
                          onClick={() => {
                            setIsSelecting(true);
                            setSelectingWhat('center');
                          }}
                          className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                            isSelecting && selectingWhat === 'center' 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                          }`}
                        >
                          ({center.x}, {center.y})
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Radius:</span>
                        <input
                          type="number"
                          min="1"
                          max="25"
                          value={radius}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setRadius(val);
                          }}
                          className="w-16 px-2 py-1 border border-orange-300 rounded-lg text-center text-orange-700 font-medium bg-orange-50 hover:bg-orange-100"
                        />
                      </div>
                    </>
                  )}

                  {selectedAlgorithm === 'flood_fill' && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Seed:</span>
                      <button
                        onClick={() => {
                          setIsSelecting(true);
                          setSelectingWhat('center');
                        }}
                        className={`px-3 py-2 rounded-lg ${buttonFontClass} transition-all ${
                          isSelecting && selectingWhat === 'center' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                        }`}
                      >
                        ({center.x}, {center.y})
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Side - Controls */}
                <div className="flex items-center space-x-3">
                  {/* Speed Control */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-3 py-2 border border-indigo-200 shadow-sm">
                    <span className="text-sm font-medium text-indigo-700">Speed:</span>
                    <span className="text-xs text-indigo-600 font-medium">Slow</span>
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="25"
                        value={501 - animationSpeed}
                        onChange={(e) => setAnimationSpeed(501 - parseInt(e.target.value))}
                        className="w-20 h-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-300 slider"
                        disabled={isAnimating}
                      />
                      <style jsx>{`
                        .slider::-webkit-slider-thumb {
                          appearance: none;
                          width: 14px;
                          height: 14px;
                          border-radius: 50%;
                          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
                          border: 1px solid white;
                          box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
                          cursor: pointer;
                          transition: all 0.2s ease;
                        }
                        .slider::-webkit-slider-thumb:hover {
                          transform: scale(1.1);
                          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
                        }
                        .slider::-moz-range-thumb {
                          width: 14px;
                          height: 14px;
                          border-radius: 50%;
                          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
                          border: 1px solid white;
                          box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
                          cursor: pointer;
                          border: none;
                        }
                      `}</style>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium">Fast</span>
                    <div className="bg-white/70 rounded-md px-2 py-1 border border-indigo-200/60">
                      <span className="text-xs font-bold text-indigo-800">{animationSpeed}ms</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={animateAlgorithm}
                    disabled={isAnimating}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    <span className="font-medium">{isAnimating ? 'Animating...' : 'Animate'}</span>
                  </button>
                  
                  <button
                    onClick={clearPixels}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="font-medium">Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Visualization Canvas */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex justify-center">
                <div className="border-4 border-gray-300 rounded-xl overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className={`${isSelecting ? 'cursor-crosshair' : 'cursor-default'} block`}
                    style={{ 
                      width: `${CANVAS_WIDTH}px`,
                      height: `${CANVAS_HEIGHT}px`
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
                    <div className="font-semibold text-red-700">Start Point</div>
                    <div className="text-red-600">
                      {isLineAlgo ? `(${startPoint.x}, ${startPoint.y})` : 'N/A'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
                    <div className="font-semibold text-green-700">End Point</div>
                    <div className="text-green-600">
                      {isLineAlgo ? `(${endPoint.x}, ${endPoint.y})` : 'N/A'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-2"></div>
                    <div className="font-semibold text-orange-700">
                      {selectedAlgorithm === 'midpoint_circle' ? 'Center/Radius' :
                       selectedAlgorithm === 'bezier_curve' ? 'Control Point' :
                       selectedAlgorithm === 'flood_fill' ? 'Seed Point' : 'N/A'}
                    </div>
                    <div className="text-orange-600">
                      {selectedAlgorithm === 'midpoint_circle' ? `(${center.x}, ${center.y}) r=${radius}` :
                       isCenterAlgo ? `(${center.x}, ${center.y})` : 'N/A'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-2"></div>
                    <div className="font-semibold text-blue-700">Pixels Drawn</div>
                    <div className="text-blue-600">{pixels.flat().filter(p => p).length}</div>
                  </div>
                </div>
                
                {isSelecting && (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                    <MousePointer className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                    <div className="font-semibold text-yellow-800">
                      Click on the canvas to set the {selectingWhat} point
                    </div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Current grid coordinates will be snapped to nearest pixel
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-sm text-slate-700">
                    <strong>Controls:</strong> Click parameter buttons to set points on grid
                  </div>
                  <div className="text-sm text-slate-700">
                    <strong>Grid:</strong> {canvasSize.width} × {canvasSize.height} pixels
                  </div>
                </div>

                {/* Algorithm Info */}
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border-2 border-indigo-200/50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                      {algorithms.find(a => a.id === selectedAlgorithm)?.name} Algorithm
                    </h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* How it works */}
                    <div className="space-y-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">?</span>
                        </div>
                        <h5 className="font-semibold text-gray-800">How it works</h5>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 border border-blue-200/50">
                        {selectedAlgorithm === 'dda_line' && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Uses floating-point arithmetic to increment along the major axis. 
                            Calculates uniform steps between start and end points.
                          </p>
                        )}
                        {selectedAlgorithm === 'bresenham_line' && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Uses integer arithmetic and error terms to determine pixel placement. 
                            More efficient than DDA as it avoids floating-point operations.
                          </p>
                        )}
                        {selectedAlgorithm === 'wu_line' && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Anti-aliased line drawing that reduces jagged edges by plotting pixels with varying intensities (simulated by multiple pixels here).
                          </p>
                        )}
                        {selectedAlgorithm === 'midpoint_circle' && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Uses 8-way symmetry and decision parameter to draw circles efficiently. 
                            Only calculates 1/8 of the circle, mirrors for the rest.
                          </p>
                        )}
                        {selectedAlgorithm === 'flood_fill' && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Fills a connected region starting from a seed point using a queue-based approach for 4-connected pixels (BFS).
                          </p>
                        )}
                        {selectedAlgorithm === 'bezier_curve' && (
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Generates a smooth quadratic curve defined by start, control, and end points by sampling along a parameter t.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Algorithm steps */}
                    <div className="space-y-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <h5 className="font-semibold text-gray-800">Algorithm Steps</h5>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4 border border-green-200/50">
                        {selectedAlgorithm === 'dda_line' && (
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Calculate dx = x₂ - x₁, dy = y₂ - y₁</li>
                            <li>Find number of steps = max(|dx|, |dy|)</li>
                            <li>Calculate increments: Δx = dx/steps, Δy = dy/steps</li>
                            <li>Plot pixels by rounding x += Δx, y += Δy</li>
                          </ol>
                        )}
                        {selectedAlgorithm === 'bresenham_line' && (
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Calculate dx, dy and initialize error term</li>
                            <li>For each x coordinate along major axis</li>
                            <li>Plot pixel at current (x, y)</li>
                            <li>Update error and y coordinate as needed</li>
                          </ol>
                        )}
                        {selectedAlgorithm === 'wu_line' && (
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Determine steepness and swap coordinates if needed</li>
                            <li>Calculate gradient dy/dx</li>
                            <li>For each step along major axis, plot two pixels at floor(y) and floor(y)+1</li>
                            <li>Update y-intermediate value with gradient</li>
                          </ol>
                        )}
                        {selectedAlgorithm === 'midpoint_circle' && (
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Start at (0, r) with decision parameter p = 1 - r</li>
                            <li>Plot 8 symmetric points for current (x, y)</li>
                            <li>Update x, and y/p based on decision parameter</li>
                            <li>Continue until x ≥ y</li>
                          </ol>
                        )}
                        {selectedAlgorithm === 'flood_fill' && (
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Initialize queue with seed point</li>
                            <li>While queue is not empty, dequeue point</li>
                            <li>Fill pixel if not visited, mark as visited</li>
                            <li>Enqueue four neighboring points</li>
                          </ol>
                        )}
                        {selectedAlgorithm === 'bezier_curve' && (
                          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Determine number of sampling steps</li>
                            <li>For t from 0 to 1 in steps</li>
                            <li>Calculate x = (1-t)²*P0x + 2(1-t)t*P1x + t²*P2x (similar for y)</li>
                            <li>Round to nearest pixel and plot if unique</li>
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 border border-purple-200/50 text-center">
                      <div className="text-2xl font-bold text-purple-700">{algorithmSteps.length}</div>
                      <div className="text-xs text-purple-600 font-medium">Total Pixels</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-3 border border-blue-200/50 text-center">
                      <div className="text-2xl font-bold text-blue-700">{animationStep}/{algorithmSteps.length}</div>
                      <div className="text-xs text-blue-600 font-medium">Progress</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border border-green-200/50 text-center">
                      <div className="text-2xl font-bold text-green-700">{animationSpeed}ms</div>
                      <div className="text-xs text-green-600 font-medium">Step Delay</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






// yo talako ramro cha 






// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { 
//   ArrowLeft, 
//   RotateCcw, 
//   Play,
//   Square,
//   Circle,
//   Minus,
//   MousePointer,
//   Activity,
//   Zap,
//   RefreshCw
// } from 'lucide-react';

// interface Point {
//   x: number;
//   y: number;
// }

// interface AlgorithmVisualizerProps {
//   onBack: () => void;
// }

// type AlgorithmType = 'dda_line' | 'bresenham_line' | 'wu_line' | 'midpoint_circle' | 'flood_fill' | 'bezier_curve';

// export default function AlgorithmVisualizer({ onBack }: AlgorithmVisualizerProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bresenham_line');
//   const [canvasSize] = useState({ width: 60, height: 40 }); // Perfect grid size for visualization
//   const [startPoint, setStartPoint] = useState<Point>({ x: 15, y: 15 });
//   const [endPoint, setEndPoint] = useState<Point>({ x: 45, y: 25 });
//   const [center, setCenter] = useState<Point>({ x: 30, y: 20 });
//   const [radius, setRadius] = useState(12);
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectingWhat, setSelectingWhat] = useState<'start' | 'end' | 'center' | null>(null);
//   const [pixels, setPixels] = useState<boolean[][]>([]);
//   const [animationStep, setAnimationStep] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [algorithmSteps, setAlgorithmSteps] = useState<Point[]>([]);
//   const [animationSpeed, setAnimationSpeed] = useState(150); // milliseconds per step

//   // Fixed canvas settings for perfect pixel visualization
//   const PIXEL_SIZE = 12; // Each pixel is 12x12 pixels on screen
//   const CANVAS_WIDTH = canvasSize.width * PIXEL_SIZE;
//   const CANVAS_HEIGHT = canvasSize.height * PIXEL_SIZE;

//   // Initialize with empty canvas
//   useEffect(() => {
//     const newPixels = Array(canvasSize.height).fill(null).map(() => 
//       Array(canvasSize.width).fill(false)
//     );
//     setPixels(newPixels);
//   }, []);

//   const clearPixels = () => {
//     const newPixels = Array(canvasSize.height).fill(null).map(() => 
//       Array(canvasSize.width).fill(false)
//     );
//     setPixels(newPixels);
//     setAlgorithmSteps([]);
//     setAnimationStep(0);
//   };

//   const setPixel = (x: number, y: number) => {
//     if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) return;
//     setPixels(prev => {
//       const newPixels = [...prev];
//       newPixels[y] = [...newPixels[y]];
//       newPixels[y][x] = true;
//       return newPixels;
//     });
//   };

//   // DDA Line Algorithm
//   const ddaLine = (start: Point, end: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     const dx = end.x - start.x;
//     const dy = end.y - start.y;
//     const numSteps = Math.max(Math.abs(dx), Math.abs(dy));
    
//     if (numSteps === 0) {
//       steps.push({ x: Math.round(start.x), y: Math.round(start.y) });
//       if (!animate) setPixel(Math.round(start.x), Math.round(start.y));
//       return steps;
//     }
    
//     const xIncrement = dx / numSteps;
//     const yIncrement = dy / numSteps;
    
//     let x = start.x;
//     let y = start.y;
    
//     for (let i = 0; i <= numSteps; i++) {
//       const pixelX = Math.round(x);
//       const pixelY = Math.round(y);
//       steps.push({ x: pixelX, y: pixelY });
      
//       if (!animate) {
//         setPixel(pixelX, pixelY);
//       }
      
//       x += xIncrement;
//       y += yIncrement;
//     }
    
//     return steps;
//   };

//   // Bresenham Line Algorithm
//   const bresenhamLine = (start: Point, end: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     let x0 = start.x, y0 = start.y;
//     let x1 = end.x, y1 = end.y;
    
//     const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    
//     if (steep) {
//       [x0, y0] = [y0, x0];
//       [x1, y1] = [y1, x1];
//     }
    
//     if (x0 > x1) {
//       [x0, x1] = [x1, x0];
//       [y0, y1] = [y1, y0];
//     }
    
//     const dx = x1 - x0;
//     const dy = Math.abs(y1 - y0);
//     let error = Math.floor(dx / 2);
//     const yStep = y0 < y1 ? 1 : -1;
//     let y = y0;
    
//     for (let x = x0; x <= x1; x++) {
//       const pixelX = steep ? y : x;
//       const pixelY = steep ? x : y;
      
//       steps.push({ x: pixelX, y: pixelY });
      
//       if (!animate) {
//         setPixel(pixelX, pixelY);
//       }
      
//       error -= dy;
//       if (error < 0) {
//         y += yStep;
//         error += dx;
//       }
//     }
    
//     return steps;
//   };

//   // Wu Line Algorithm (simulated anti-aliasing by plotting multiple pixels where needed)
//   const wuLine = (start: Point, end: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     let x0 = Math.round(start.x);
//     let y0 = Math.round(start.y);
//     let x1 = Math.round(end.x);
//     let y1 = Math.round(end.y);

//     const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

//     if (steep) {
//       [x0, y0] = [y0, x0];
//       [x1, y1] = [y1, x1];
//     }

//     if (x0 > x1) {
//       [x0, x1] = [x1, x0];
//       [y0, y1] = [y1, y0];
//     }

//     const dx = x1 - x0;
//     const dy = y1 - y0;
//     const gradient = dy / dx;
//     let intery = y0 + gradient;

//     // Plot start
//     const startPx = steep ? y0 : x0;
//     const startPy = steep ? x0 : y0;
//     steps.push({ x: startPx, y: startPy });
//     if (!animate) setPixel(startPx, startPy);

//     for (let x = x0 + 1; x < x1; x++) {
//       const ipart = Math.floor(intery);
//       const frac = intery - ipart;

//       // Plot two pixels to simulate anti-aliasing
//       let px1 = steep ? ipart : x;
//       let py1 = steep ? x : ipart;
//       steps.push({ x: px1, y: py1 });
//       if (!animate) setPixel(px1, py1);

//       let px2 = steep ? ipart + 1 : x;
//       let py2 = steep ? x : ipart + 1;
//       steps.push({ x: px2, y: py2 });
//       if (!animate) setPixel(px2, py2);

//       intery += gradient;
//     }

//     // Plot end
//     const endPx = steep ? y1 : x1;
//     const endPy = steep ? x1 : y1;
//     steps.push({ x: endPx, y: endPy });
//     if (!animate) setPixel(endPx, endPy);

//     return steps;
//   };

//   // Midpoint Circle Algorithm
//   const midpointCircle = (center: Point, radius: number, animate = false): Point[] => {
//     const steps: Point[] = [];
//     let x = 0;
//     let y = radius;
//     let p = 1 - radius;
    
//     const plotCirclePoints = (cx: number, cy: number, x: number, y: number) => {
//       const points = [
//         { x: cx + x, y: cy + y },
//         { x: cx - x, y: cy + y },
//         { x: cx + x, y: cy - y },
//         { x: cx - x, y: cy - y },
//         { x: cx + y, y: cy + x },
//         { x: cx - y, y: cy + x },
//         { x: cx + y, y: cy - x },
//         { x: cx - y, y: cy - x }
//       ];
      
//       points.forEach(point => {
//         if (point.x >= 0 && point.x < canvasSize.width && 
//             point.y >= 0 && point.y < canvasSize.height) {
//           steps.push(point);
//           if (!animate) {
//             setPixel(point.x, point.y);
//           }
//         }
//       });
//     };
    
//     plotCirclePoints(center.x, center.y, x, y);
    
//     while (x < y) {
//       x++;
//       if (p < 0) {
//         p = p + 2 * x + 1;
//       } else {
//         y--;
//         p = p + 2 * (x - y) + 1;
//       }
//       plotCirclePoints(center.x, center.y, x, y);
//     }
    
//     return steps;
//   };

//   // Flood Fill Algorithm (4-connected)
//   const floodFill = (seed: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     const visited = Array(canvasSize.height).fill(null).map(() => Array(canvasSize.width).fill(false));

//     if (seed.x < 0 || seed.x >= canvasSize.width || seed.y < 0 || seed.y >= canvasSize.height) return steps;

//     const stack: Point[] = [seed];

//     while (stack.length > 0) {
//       const point = stack.pop()!;
//       const x = point.x;
//       const y = point.y;

//       if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height || visited[y][x]) continue;

//       visited[y][x] = true;
//       steps.push(point);
//       if (!animate) setPixel(x, y);

//       stack.push({ x: x + 1, y });
//       stack.push({ x: x - 1, y });
//       stack.push({ x: x, y: y + 1 });
//       stack.push({ x: x, y: y - 1 });
//     }

//     return steps;
//   };

//   // Bézier Curve Algorithm (Quadratic)
//   const bezierCurve = (start: Point, control: Point, end: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     const numSteps = Math.max(
//       Math.abs(start.x - end.x) + Math.abs(control.x - end.x),
//       Math.abs(start.y - end.y) + Math.abs(control.y - end.y)
//     ) * 2; // Adaptive steps based on rough length

//     for (let i = 0; i <= numSteps; i++) {
//       const t = i / numSteps;
//       const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
//       const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
//       const pixelX = Math.round(x);
//       const pixelY = Math.round(y);

//       // Avoid duplicates
//       if (!steps.some(p => p.x === pixelX && p.y === pixelY)) {
//         steps.push({ x: pixelX, y: pixelY });
//         if (!animate) setPixel(pixelX, pixelY);
//       }
//     }

//     return steps;
//   };

//   const animateAlgorithm = () => {
//     clearPixels();
//     setIsAnimating(true);
//     setAnimationStep(0);
    
//     let steps: Point[] = [];
    
//     switch (selectedAlgorithm) {
//       case 'dda_line':
//         steps = ddaLine(startPoint, endPoint, true);
//         break;
//       case 'bresenham_line':
//         steps = bresenhamLine(startPoint, endPoint, true);
//         break;
//       case 'wu_line':
//         steps = wuLine(startPoint, endPoint, true);
//         break;
//       case 'midpoint_circle':
//         steps = midpointCircle(center, radius, true);
//         break;
//       case 'flood_fill':
//         steps = floodFill(center, true);
//         break;
//       case 'bezier_curve':
//         steps = bezierCurve(startPoint, center, endPoint, true);
//         break;
//     }
    
//     setAlgorithmSteps(steps);
    
//     // Animate with user-controlled speed
//     const delay = animationSpeed;
//     steps.forEach((step, index) => {
//       setTimeout(() => {
//         setPixel(step.x, step.y);
//         setAnimationStep(index + 1);
//         if (index === steps.length - 1) {
//           setIsAnimating(false);
//         }
//       }, index * delay);
//     });
//   };

//   const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isSelecting || !selectingWhat) return;
    
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const rect = canvas.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const clickY = e.clientY - rect.top;
    
//     // Convert to grid coordinates
//     const x = Math.floor(clickX / PIXEL_SIZE);
//     const y = Math.floor(clickY / PIXEL_SIZE);
    
//     // Ensure within bounds
//     const boundedX = Math.max(0, Math.min(canvasSize.width - 1, x));
//     const boundedY = Math.max(0, Math.min(canvasSize.height - 1, y));
    
//     if (selectingWhat === 'start') {
//       setStartPoint({ x: boundedX, y: boundedY });
//     } else if (selectingWhat === 'end') {
//       setEndPoint({ x: boundedX, y: boundedY });
//     } else if (selectingWhat === 'center') {
//       setCenter({ x: boundedX, y: boundedY });
//     }
    
//     setIsSelecting(false);
//     setSelectingWhat(null);
//   };

//   const drawCanvas = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
    
//     canvas.width = CANVAS_WIDTH;
//     canvas.height = CANVAS_HEIGHT;
    
//     // Clear with white background
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
//     // Draw grid lines
//     ctx.strokeStyle = '#e2e8f0';
//     ctx.lineWidth = 1;
    
//     // Vertical lines
//     for (let x = 0; x <= canvasSize.width; x++) {
//       ctx.beginPath();
//       ctx.moveTo(x * PIXEL_SIZE, 0);
//       ctx.lineTo(x * PIXEL_SIZE, CANVAS_HEIGHT);
//       ctx.stroke();
//     }
    
//     // Horizontal lines
//     for (let y = 0; y <= canvasSize.height; y++) {
//       ctx.beginPath();
//       ctx.moveTo(0, y * PIXEL_SIZE);
//       ctx.lineTo(CANVAS_WIDTH, y * PIXEL_SIZE);
//       ctx.stroke();
//     }
    
//     // Draw pixels
//     ctx.fillStyle = '#3b82f6';
//     for (let y = 0; y < canvasSize.height; y++) {
//       if (!pixels[y]) continue;
//       for (let x = 0; x < canvasSize.width; x++) {
//         if (pixels[y][x]) {
//           ctx.fillRect(
//             x * PIXEL_SIZE + 1, 
//             y * PIXEL_SIZE + 1, 
//             PIXEL_SIZE - 2, 
//             PIXEL_SIZE - 2
//           );
//         }
//       }
//     }
    
//     // Draw control points
//     const pointSize = PIXEL_SIZE - 4;
//     const pointOffset = 2;
    
//     // Start point (red)
//     if (['dda_line', 'bresenham_line', 'wu_line', 'bezier_curve'].includes(selectedAlgorithm)) {
//       ctx.fillStyle = '#ef4444';
//       ctx.fillRect(
//         startPoint.x * PIXEL_SIZE + pointOffset, 
//         startPoint.y * PIXEL_SIZE + pointOffset, 
//         pointSize, 
//         pointSize
//       );
//     }
    
//     // End point (green)
//     if (['dda_line', 'bresenham_line', 'wu_line', 'bezier_curve'].includes(selectedAlgorithm)) {
//       ctx.fillStyle = '#22c55e';
//       ctx.fillRect(
//         endPoint.x * PIXEL_SIZE + pointOffset, 
//         endPoint.y * PIXEL_SIZE + pointOffset, 
//         pointSize, 
//         pointSize
//       );
//     }
    
//     // Center/Control/Seed point (orange)
//     if (['midpoint_circle', 'flood_fill', 'bezier_curve'].includes(selectedAlgorithm)) {
//       ctx.fillStyle = '#f59e0b';
//       ctx.fillRect(
//         center.x * PIXEL_SIZE + pointOffset, 
//         center.y * PIXEL_SIZE + pointOffset, 
//         pointSize, 
//         pointSize
//       );
//     }
//   }, [pixels, startPoint, endPoint, center, selectedAlgorithm, canvasSize]);

//   useEffect(() => {
//     drawCanvas();
//   }, [drawCanvas]);

//   const algorithms = [
//     { id: 'dda_line', name: 'DDA Line', icon: Minus, description: 'Digital Differential Analyzer' },
//     { id: 'bresenham_line', name: 'Bresenham Line', icon: Minus, description: 'Integer-based line drawing' },
//     { id: 'wu_line', name: 'Wu Line', icon: Minus, description: 'Anti-aliased line drawing' },
//     { id: 'midpoint_circle', name: 'Midpoint Circle', icon: Circle, description: 'Efficient circle drawing' },
//     { id: 'flood_fill', name: 'Flood Fill', icon: Square, description: '4-connected area filling' },
//     { id: 'bezier_curve', name: 'Bézier Curve', icon: RefreshCw, description: 'Smooth curve generation' }
//   ];

//   const isLineAlgo = ['dda_line', 'bresenham_line', 'wu_line', 'bezier_curve'].includes(selectedAlgorithm);
//   const isCenterAlgo = ['midpoint_circle', 'flood_fill', 'bezier_curve'].includes(selectedAlgorithm);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={onBack}
//                 className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105 group"
//                 title="Back to Paint App"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-1 transition-transform" />
//               </button>
//               <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <Activity className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Algorithm Visualizer
//                 </h1>
//                 <p className="text-gray-600 text-sm">Simple pixel-by-pixel algorithm visualization</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
//                 <span className="text-sm text-gray-600">Steps:</span>
//                 <span className="text-sm font-bold text-gray-800">{animationStep}/{algorithmSteps.length}</span>
//               </div>
//               <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
//                 <span className="text-sm text-gray-600">Grid:</span>
//                 <span className="text-sm font-bold text-gray-800">{canvasSize.width}×{canvasSize.height}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-6">
//           {/* Algorithm Selection Sidebar */}
//           <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 w-80 flex-shrink-0 space-y-6">
//             {/* Algorithm Selection */}
//             <div>
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                 <Zap className="w-5 h-5 mr-2 text-indigo-600" />
//                 Choose Algorithm
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {algorithms.map((algo) => (
//                   <button
//                     key={algo.id}
//                     onClick={() => setSelectedAlgorithm(algo.id as AlgorithmType)}
//                     className={`p-4 rounded-xl transition-all transform hover:scale-105 text-left ${
//                       selectedAlgorithm === algo.id
//                         ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
//                         : 'bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-sm'
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <algo.icon className="w-5 h-5" />
//                       <div>
//                         <div className="font-semibold">{algo.name}</div>
//                         <div className={`text-xs ${selectedAlgorithm === algo.id ? 'text-indigo-100' : 'text-gray-500'}`}>
//                           {algo.description}
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 space-y-6">
//             {/* Top Controls Row */}
//             <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
//               <div className="flex items-center justify-between">
//                 {/* Left Side - Parameters */}
//                 <div className="flex items-center space-x-6">
//                   {(['dda_line', 'bresenham_line', 'wu_line'].includes(selectedAlgorithm)) && (
//                     <>
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Start:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('start');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'start' 
//                               ? 'bg-red-500 text-white' 
//                               : 'bg-red-100 hover:bg-red-200 text-red-700'
//                           }`}
//                         >
//                           ({startPoint.x}, {startPoint.y})
//                         </button>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">End:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('end');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'end' 
//                               ? 'bg-green-500 text-white' 
//                               : 'bg-green-100 hover:bg-green-200 text-green-700'
//                           }`}
//                         >
//                           ({endPoint.x}, {endPoint.y})
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {(selectedAlgorithm === 'bezier_curve') && (
//                     <>
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Start:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('start');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'start' 
//                               ? 'bg-red-500 text-white' 
//                               : 'bg-red-100 hover:bg-red-200 text-red-700'
//                           }`}
//                         >
//                           ({startPoint.x}, {startPoint.y})
//                         </button>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Control:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('center');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'center' 
//                               ? 'bg-orange-500 text-white' 
//                               : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
//                           }`}
//                         >
//                           ({center.x}, {center.y})
//                         </button>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">End:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('end');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'end' 
//                               ? 'bg-green-500 text-white' 
//                               : 'bg-green-100 hover:bg-green-200 text-green-700'
//                           }`}
//                         >
//                           ({endPoint.x}, {endPoint.y})
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {selectedAlgorithm === 'midpoint_circle' && (
//                     <>
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Center:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('center');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'center' 
//                               ? 'bg-orange-500 text-white' 
//                               : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
//                           }`}
//                         >
//                           ({center.x}, {center.y})
//                         </button>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Radius:</span>
//                         <input
//                           type="number"
//                           min="1"
//                           max="25"
//                           value={radius}
//                           onChange={(e) => {
//                             const val = parseInt(e.target.value);
//                             if (!isNaN(val)) setRadius(val);
//                           }}
//                           className="w-16 px-2 py-1 border border-orange-300 rounded-lg text-center text-orange-700 font-medium bg-orange-50 hover:bg-orange-100"
//                         />
//                       </div>
//                     </>
//                   )}

//                   {selectedAlgorithm === 'flood_fill' && (
//                     <div className="flex items-center gap-3">
//                       <span className="text-sm font-medium text-gray-700">Seed:</span>
//                       <button
//                         onClick={() => {
//                           setIsSelecting(true);
//                           setSelectingWhat('center');
//                         }}
//                         className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                           isSelecting && selectingWhat === 'center' 
//                             ? 'bg-orange-500 text-white' 
//                             : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
//                         }`}
//                       >
//                         ({center.x}, {center.y})
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Right Side - Controls */}
//                 <div className="flex items-center space-x-3">
//                   {/* Speed Control */}
//                   <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-3 py-2 border border-indigo-200 shadow-sm">
//                     <span className="text-sm font-medium text-indigo-700">Speed:</span>
//                     <span className="text-xs text-indigo-600 font-medium">Slow</span>
//                     <div className="relative flex items-center">
//                       <input
//                         type="range"
//                         min="50"
//                         max="500"
//                         step="25"
//                         value={501 - animationSpeed}
//                         onChange={(e) => setAnimationSpeed(501 - parseInt(e.target.value))}
//                         className="w-20 h-2 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-300 slider"
//                         disabled={isAnimating}
//                       />
//                       <style jsx>{`
//                         .slider::-webkit-slider-thumb {
//                           appearance: none;
//                           width: 14px;
//                           height: 14px;
//                           border-radius: 50%;
//                           background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
//                           border: 1px solid white;
//                           box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
//                           cursor: pointer;
//                           transition: all 0.2s ease;
//                         }
//                         .slider::-webkit-slider-thumb:hover {
//                           transform: scale(1.1);
//                           box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
//                         }
//                         .slider::-moz-range-thumb {
//                           width: 14px;
//                           height: 14px;
//                           border-radius: 50%;
//                           background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
//                           border: 1px solid white;
//                           box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
//                           cursor: pointer;
//                           border: none;
//                         }
//                       `}</style>
//                     </div>
//                     <span className="text-xs text-indigo-600 font-medium">Fast</span>
//                     <div className="bg-white/70 rounded-md px-2 py-1 border border-indigo-200/60">
//                       <span className="text-xs font-bold text-indigo-800">{animationSpeed}ms</span>
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={animateAlgorithm}
//                     disabled={isAnimating}
//                     className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
//                   >
//                     <Play className="w-5 h-5" />
//                     <span className="font-medium">{isAnimating ? 'Animating...' : 'Animate'}</span>
//                   </button>
                  
//                   <button
//                     onClick={clearPixels}
//                     className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center gap-2"
//                   >
//                     <RotateCcw className="w-5 h-5" />
//                     <span className="font-medium">Clear</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Visualization Canvas */}
//             <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
//               <div className="flex justify-center">
//                 <div className="border-4 border-gray-300 rounded-xl overflow-hidden">
//                   <canvas
//                     ref={canvasRef}
//                     onClick={handleCanvasClick}
//                     width={CANVAS_WIDTH}
//                     height={CANVAS_HEIGHT}
//                     className={`${isSelecting ? 'cursor-crosshair' : 'cursor-default'} block`}
//                     style={{ 
//                       width: `${CANVAS_WIDTH}px`,
//                       height: `${CANVAS_HEIGHT}px`
//                     }}
//                   />
//                 </div>
//               </div>
              
//               <div className="mt-6 space-y-4">
//                 <div className="grid grid-cols-4 gap-4 text-sm">
//                   <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-red-700">Start Point</div>
//                     <div className="text-red-600">
//                       {isLineAlgo ? `(${startPoint.x}, ${startPoint.y})` : 'N/A'}
//                     </div>
//                   </div>
//                   <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-green-700">End Point</div>
//                     <div className="text-green-600">
//                       {isLineAlgo ? `(${endPoint.x}, ${endPoint.y})` : 'N/A'}
//                     </div>
//                   </div>
//                   <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
//                     <div className="w-4 h-4 bg-orange-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-orange-700">
//                       {selectedAlgorithm === 'midpoint_circle' ? 'Center/Radius' :
//                        selectedAlgorithm === 'bezier_curve' ? 'Control Point' :
//                        selectedAlgorithm === 'flood_fill' ? 'Seed Point' : 'N/A'}
//                     </div>
//                     <div className="text-orange-600">
//                       {selectedAlgorithm === 'midpoint_circle' ? `(${center.x}, ${center.y}) r=${radius}` :
//                        isCenterAlgo ? `(${center.x}, ${center.y})` : 'N/A'}
//                     </div>
//                   </div>
//                   <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                     <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-blue-700">Pixels Drawn</div>
//                     <div className="text-blue-600">{pixels.flat().filter(p => p).length}</div>
//                   </div>
//                 </div>
                
//                 {isSelecting && (
//                   <div className="text-center p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
//                     <MousePointer className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
//                     <div className="font-semibold text-yellow-800">
//                       Click on the canvas to set the {selectingWhat} point
//                     </div>
//                     <div className="text-sm text-yellow-700 mt-1">
//                       Current grid coordinates will be snapped to nearest pixel
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-2 gap-4 text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
//                   <div className="text-sm text-slate-700">
//                     <strong>Controls:</strong> Click parameter buttons to set points on grid
//                   </div>
//                   <div className="text-sm text-slate-700">
//                     <strong>Grid:</strong> {canvasSize.width} × {canvasSize.height} pixels
//                   </div>
//                 </div>

//                 {/* Algorithm Info */}
//                 <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border-2 border-indigo-200/50 rounded-2xl p-6 shadow-lg">
//                   <div className="flex items-center mb-4">
//                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
//                       <Activity className="w-6 h-6 text-white" />
//                     </div>
//                     <h4 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
//                       {algorithms.find(a => a.id === selectedAlgorithm)?.name} Algorithm
//                     </h4>
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-6">
//                     {/* How it works */}
//                     <div className="space-y-3">
//                       <div className="flex items-center mb-2">
//                         <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
//                           <span className="text-white text-xs font-bold">?</span>
//                         </div>
//                         <h5 className="font-semibold text-gray-800">How it works</h5>
//                       </div>
//                       <div className="bg-white/70 rounded-xl p-4 border border-blue-200/50">
//                         {selectedAlgorithm === 'dda_line' && (
//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             Uses floating-point arithmetic to increment along the major axis. 
//                             Calculates uniform steps between start and end points.
//                           </p>
//                         )}
//                         {selectedAlgorithm === 'bresenham_line' && (
//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             Uses integer arithmetic and error terms to determine pixel placement. 
//                             More efficient than DDA as it avoids floating-point operations.
//                           </p>
//                         )}
//                         {selectedAlgorithm === 'wu_line' && (
//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             Anti-aliased line drawing that reduces jagged edges by plotting pixels with varying intensities (simulated by multiple pixels here).
//                           </p>
//                         )}
//                         {selectedAlgorithm === 'midpoint_circle' && (
//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             Uses 8-way symmetry and decision parameter to draw circles efficiently. 
//                             Only calculates 1/8 of the circle, mirrors for the rest.
//                           </p>
//                         )}
//                         {selectedAlgorithm === 'flood_fill' && (
//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             Fills a connected region starting from a seed point using a stack-based approach for 4-connected pixels.
//                           </p>
//                         )}
//                         {selectedAlgorithm === 'bezier_curve' && (
//                           <p className="text-sm text-gray-700 leading-relaxed">
//                             Generates a smooth quadratic curve defined by start, control, and end points by sampling along a parameter t.
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Algorithm steps */}
//                     <div className="space-y-3">
//                       <div className="flex items-center mb-2">
//                         <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2">
//                           <span className="text-white text-xs font-bold">1</span>
//                         </div>
//                         <h5 className="font-semibold text-gray-800">Algorithm Steps</h5>
//                       </div>
//                       <div className="bg-white/70 rounded-xl p-4 border border-green-200/50">
//                         {selectedAlgorithm === 'dda_line' && (
//                           <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
//                             <li>Calculate dx = x₂ - x₁, dy = y₂ - y₁</li>
//                             <li>Find number of steps = max(|dx|, |dy|)</li>
//                             <li>Calculate increments: Δx = dx/steps, Δy = dy/steps</li>
//                             <li>Plot pixels by rounding x += Δx, y += Δy</li>
//                           </ol>
//                         )}
//                         {selectedAlgorithm === 'bresenham_line' && (
//                           <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
//                             <li>Calculate dx, dy and initialize error term</li>
//                             <li>For each x coordinate along major axis</li>
//                             <li>Plot pixel at current (x, y)</li>
//                             <li>Update error and y coordinate as needed</li>
//                           </ol>
//                         )}
//                         {selectedAlgorithm === 'wu_line' && (
//                           <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
//                             <li>Determine steepness and swap coordinates if needed</li>
//                             <li>Calculate gradient dy/dx</li>
//                             <li>For each step along major axis, plot two pixels at floor(y) and floor(y)+1</li>
//                             <li>Update y-intermediate value with gradient</li>
//                           </ol>
//                         )}
//                         {selectedAlgorithm === 'midpoint_circle' && (
//                           <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
//                             <li>Start at (0, r) with decision parameter p = 1 - r</li>
//                             <li>Plot 8 symmetric points for current (x, y)</li>
//                             <li>Update x, and y/p based on decision parameter</li>
//                             <li>Continue until x ≥ y</li>
//                           </ol>
//                         )}
//                         {selectedAlgorithm === 'flood_fill' && (
//                           <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
//                             <li>Initialize stack with seed point</li>
//                             <li>While stack is not empty, pop point</li>
//                             <li>Fill pixel if not visited, mark as visited</li>
//                             <li>Push four neighboring points to stack</li>
//                           </ol>
//                         )}
//                         {selectedAlgorithm === 'bezier_curve' && (
//                           <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
//                             <li>Determine number of sampling steps</li>
//                             <li>For t from 0 to 1 in steps</li>
//                             <li>Calculate x = (1-t)²*P0x + 2(1-t)t*P1x + t²*P2x (similar for y)</li>
//                             <li>Round to nearest pixel and plot if unique</li>
//                           </ol>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Statistics */}
//                   <div className="mt-6 grid grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 border border-purple-200/50 text-center">
//                       <div className="text-2xl font-bold text-purple-700">{algorithmSteps.length}</div>
//                       <div className="text-xs text-purple-600 font-medium">Total Pixels</div>
//                     </div>
//                     <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-3 border border-blue-200/50 text-center">
//                       <div className="text-2xl font-bold text-blue-700">{animationStep}/{algorithmSteps.length}</div>
//                       <div className="text-xs text-blue-600 font-medium">Progress</div>
//                     </div>
//                     <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border border-green-200/50 text-center">
//                       <div className="text-2xl font-bold text-green-700">{animationSpeed}ms</div>
//                       <div className="text-xs text-green-600 font-medium">Step Delay</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// yo mathiko ni ramro cha 










// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { 
//   ArrowLeft, 
//   ZoomIn, 
//   ZoomOut, 
//   RotateCcw, 
//   Grid3x3,
//   Eye,
//   EyeOff,
//   Play,
//   Square,
//   Circle,
//   Minus,
//   MousePointer,
//   Download,
//   Activity,
//   Zap,
//   RefreshCw
// } from 'lucide-react';

// interface Point {
//   x: number;
//   y: number;
// }

// interface Color {
//   r: number;
//   g: number;
//   b: number;
//   a?: number;
// }

// interface AlgorithmVisualizerProps {
//   onBack: () => void;
// }

// type AlgorithmType = 'dda_line' | 'bresenham_line' | 'wu_line' | 'midpoint_circle' | 'flood_fill' | 'bezier_curve';

// export default function AlgorithmVisualizer({ onBack }: AlgorithmVisualizerProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bresenham_line');
//   const [zoom, setZoom] = useState(8); // zoom factor
//   const [showGrid, setShowGrid] = useState(true);
//   const [showPixels, setShowPixels] = useState(true);
//   const [canvasSize] = useState({ width: 90, height: 60 }); // logical grid size
//   const [startPoint, setStartPoint] = useState<Point>({ x: 15, y: 15 });
//   const [endPoint, setEndPoint] = useState<Point>({ x: 75, y: 45 });
//   const [center, setCenter] = useState<Point>({ x: 45, y: 30 });
//   const [radius, setRadius] = useState(20);
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectingWhat, setSelectingWhat] = useState<'start' | 'end' | 'center' | null>(null);
//   const [pixels, setPixels] = useState<boolean[][]>([]);
//   const [animationStep, setAnimationStep] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [algorithmSteps, setAlgorithmSteps] = useState<Point[]>([]);

//   // Fixed canvas display dimensions
//   const CANVAS_DISPLAY_WIDTH = 900;
//   const CANVAS_DISPLAY_HEIGHT = 600;

//   // Initialize with some visible content
//   useEffect(() => {
//     const newPixels = Array(canvasSize.height).fill(null).map(() => 
//       Array(canvasSize.width).fill(false)
//     );
//     setPixels(newPixels);
    
//     // Execute the default algorithm to show something initially
//     setTimeout(() => {
//       // Run the algorithm without animation to show initial result
//       let steps: Point[] = [];
//       switch (selectedAlgorithm) {
//         case 'dda_line':
//           steps = ddaLine(startPoint, endPoint, false);
//           break;
//         case 'bresenham_line':
//           steps = bresenhamLine(startPoint, endPoint, false);
//           break;
//         case 'midpoint_circle':
//           steps = midpointCircle(center, radius, false);
//           break;
//       }
//       setAlgorithmSteps(steps);
//     }, 500);
//   }, [canvasSize]);

//   const clearPixels = () => {
//     const newPixels = Array(canvasSize.height).fill(null).map(() => 
//       Array(canvasSize.width).fill(false)
//     );
//     setPixels(newPixels);
//     setAlgorithmSteps([]);
//     setAnimationStep(0);
//   };

//   const setPixel = (x: number, y: number) => {
//     if (x < 0 || x >= canvasSize.width || y < 0 || y >= canvasSize.height) return;
//     setPixels(prev => {
//       const newPixels = [...prev];
//       newPixels[y] = [...newPixels[y]];
//       newPixels[y][x] = true;
//       return newPixels;
//     });
//   };

//   // DDA Line Algorithm
//   const ddaLine = (start: Point, end: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     const dx = end.x - start.x;
//     const dy = end.y - start.y;
//     const numSteps = Math.max(Math.abs(dx), Math.abs(dy));
    
//     const xIncrement = dx / numSteps;
//     const yIncrement = dy / numSteps;
    
//     let x = start.x;
//     let y = start.y;
    
//     for (let i = 0; i <= numSteps; i++) {
//       const pixelX = Math.round(x);
//       const pixelY = Math.round(y);
//       steps.push({ x: pixelX, y: pixelY });
      
//       if (!animate) {
//         setPixel(pixelX, pixelY);
//       }
      
//       x += xIncrement;
//       y += yIncrement;
//     }
    
//     return steps;
//   };

//   // Bresenham Line Algorithm
//   const bresenhamLine = (start: Point, end: Point, animate = false): Point[] => {
//     const steps: Point[] = [];
//     let x0 = start.x, y0 = start.y;
//     let x1 = end.x, y1 = end.y;
    
//     const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    
//     if (steep) {
//       [x0, y0] = [y0, x0];
//       [x1, y1] = [y1, x1];
//     }
    
//     if (x0 > x1) {
//       [x0, x1] = [x1, x0];
//       [y0, y1] = [y1, y0];
//     }
    
//     const dx = x1 - x0;
//     const dy = Math.abs(y1 - y0);
//     let error = Math.floor(dx / 2);
//     const yStep = y0 < y1 ? 1 : -1;
//     let y = y0;
    
//     for (let x = x0; x <= x1; x++) {
//       const pixelX = steep ? y : x;
//       const pixelY = steep ? x : y;
      
//       steps.push({ x: pixelX, y: pixelY });
      
//       if (!animate) {
//         setPixel(pixelX, pixelY);
//       }
      
//       error -= dy;
//       if (error < 0) {
//         y += yStep;
//         error += dx;
//       }
//     }
    
//     return steps;
//   };

//   // Midpoint Circle Algorithm
//   const midpointCircle = (center: Point, radius: number, animate = false): Point[] => {
//     const steps: Point[] = [];
//     let x = 0;
//     let y = radius;
//     let p = 1 - radius;
    
//     const plotCirclePoints = (cx: number, cy: number, x: number, y: number) => {
//       const points = [
//         { x: cx + x, y: cy + y },
//         { x: cx - x, y: cy + y },
//         { x: cx + x, y: cy - y },
//         { x: cx - x, y: cy - y },
//         { x: cx + y, y: cy + x },
//         { x: cx - y, y: cy + x },
//         { x: cx + y, y: cy - x },
//         { x: cx - y, y: cy - x }
//       ];
      
//       points.forEach(point => {
//         if (point.x >= 0 && point.x < canvasSize.width && 
//             point.y >= 0 && point.y < canvasSize.height) {
//           steps.push(point);
//           if (!animate) {
//             setPixel(point.x, point.y);
//           }
//         }
//       });
//     };
    
//     plotCirclePoints(center.x, center.y, x, y);
    
//     while (x < y) {
//       x++;
//       if (p < 0) {
//         p = p + 2 * x + 1;
//       } else {
//         y--;
//         p = p + 2 * (x - y) + 1;
//       }
//       plotCirclePoints(center.x, center.y, x, y);
//     }
    
//     return steps;
//   };

//   const animateAlgorithm = () => {
//     clearPixels();
//     setIsAnimating(true);
//     setAnimationStep(0);
    
//     let steps: Point[] = [];
    
//     switch (selectedAlgorithm) {
//       case 'dda_line':
//         steps = ddaLine(startPoint, endPoint, true);
//         break;
//       case 'bresenham_line':
//         steps = bresenhamLine(startPoint, endPoint, true);
//         break;
//       case 'midpoint_circle':
//         steps = midpointCircle(center, radius, true);
//         break;
//     }
    
//     setAlgorithmSteps(steps);
    
//     // Animate step by step
//     steps.forEach((step, index) => {
//       setTimeout(() => {
//         setPixel(step.x, step.y);
//         setAnimationStep(index + 1);
//         if (index === steps.length - 1) {
//           setIsAnimating(false);
//         }
//       }, index * 100);
//     });
//   };

//   const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isSelecting || !selectingWhat) return;
    
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const rect = canvas.getBoundingClientRect();
    
//     // Get click position relative to canvas display
//     const clickX = e.clientX - rect.left;
//     const clickY = e.clientY - rect.top;
    
//     // Calculate pixel size to match the drawing
//     const pixelWidth = CANVAS_DISPLAY_WIDTH / canvasSize.width;
//     const pixelHeight = CANVAS_DISPLAY_HEIGHT / canvasSize.height;
    
//     // Convert to logical grid coordinates
//     const x = Math.floor(clickX / pixelWidth);
//     const y = Math.floor(clickY / pixelHeight);
    
//     // Clamp to valid bounds
//     const clampedX = Math.max(0, Math.min(canvasSize.width - 1, x));
//     const clampedY = Math.max(0, Math.min(canvasSize.height - 1, y));
    
//     if (selectingWhat === 'start') {
//       setStartPoint({ x: clampedX, y: clampedY });
//     } else if (selectingWhat === 'end') {
//       setEndPoint({ x: clampedX, y: clampedY });
//     } else if (selectingWhat === 'center') {
//       setCenter({ x: clampedX, y: clampedY });
//     }
    
//     setIsSelecting(false);
//     setSelectingWhat(null);
//   };

//   const drawCanvas = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
    
//     // Set canvas actual size to display size
//     canvas.width = CANVAS_DISPLAY_WIDTH;
//     canvas.height = CANVAS_DISPLAY_HEIGHT;
    
//     // Calculate pixel size to fill entire canvas
//     const pixelWidth = CANVAS_DISPLAY_WIDTH / canvasSize.width;
//     const pixelHeight = CANVAS_DISPLAY_HEIGHT / canvasSize.height;
    
//     // Clear canvas with white background
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, CANVAS_DISPLAY_WIDTH, CANVAS_DISPLAY_HEIGHT);
    
//     // Draw grid lines - exactly matching pixel boundaries
//     if (showGrid) {
//       ctx.strokeStyle = '#d1d5db';
//       ctx.lineWidth = 1;
      
//       // Vertical grid lines
//       for (let x = 0; x <= canvasSize.width; x++) {
//         const xPos = Math.round(x * pixelWidth) + 0.5;
//         ctx.beginPath();
//         ctx.moveTo(xPos, 0);
//         ctx.lineTo(xPos, CANVAS_DISPLAY_HEIGHT);
//         ctx.stroke();
//       }
      
//       // Horizontal grid lines
//       for (let y = 0; y <= canvasSize.height; y++) {
//         const yPos = Math.round(y * pixelHeight) + 0.5;
//         ctx.beginPath();
//         ctx.moveTo(0, yPos);
//         ctx.lineTo(CANVAS_DISPLAY_WIDTH, yPos);
//         ctx.stroke();
//       }
//     }
    
//     // Draw pixels - exactly filling each grid cell
//     if (showPixels) {
//       ctx.fillStyle = '#3b82f6';
      
//       pixels.forEach((row, y) => {
//         row.forEach((pixel, x) => {
//           if (pixel) {
//             // Fill entire grid cell with small padding
//             const padding = 1;
//             ctx.fillRect(
//               Math.round(x * pixelWidth) + padding,
//               Math.round(y * pixelHeight) + padding,
//               Math.round(pixelWidth) - padding * 2,
//               Math.round(pixelHeight) - padding * 2
//             );
//           }
//         });
//       });
//     }
    
//     // Draw control points
//     const pointSize = Math.max(6, Math.min(pixelWidth, pixelHeight) * 0.5);
    
//     // Start point (red)
//     ctx.fillStyle = '#ef4444';
//     ctx.fillRect(
//       startPoint.x * pixelWidth + (pixelWidth - pointSize) / 2,
//       startPoint.y * pixelHeight + (pixelHeight - pointSize) / 2,
//       pointSize,
//       pointSize
//     );
    
//     // End point (green)
//     ctx.fillStyle = '#22c55e';
//     ctx.fillRect(
//       endPoint.x * pixelWidth + (pixelWidth - pointSize) / 2,
//       endPoint.y * pixelHeight + (pixelHeight - pointSize) / 2,
//       pointSize,
//       pointSize
//     );
    
//     // Center point for circle (orange)
//     if (selectedAlgorithm === 'midpoint_circle') {
//       ctx.fillStyle = '#f59e0b';
//       ctx.fillRect(
//         center.x * pixelWidth + (pixelWidth - pointSize) / 2,
//         center.y * pixelHeight + (pixelHeight - pointSize) / 2,
//         pointSize,
//         pointSize
//       );
//     }
    
//   }, [pixels, zoom, showGrid, showPixels, startPoint, endPoint, center, canvasSize, selectedAlgorithm]);

//   useEffect(() => {
//     drawCanvas();
//   }, [drawCanvas]);

//   const algorithms = [
//     { id: 'dda_line', name: 'DDA Line', icon: Minus, description: 'Digital Differential Analyzer for line drawing' },
//     { id: 'bresenham_line', name: 'Bresenham Line', icon: Minus, description: 'Integer-based line drawing algorithm' },
//     { id: 'wu_line', name: 'Wu Line', icon: Minus, description: 'Anti-aliased line drawing' },
//     { id: 'midpoint_circle', name: 'Midpoint Circle', icon: Circle, description: 'Efficient circle drawing algorithm' },
//     { id: 'flood_fill', name: 'Flood Fill', icon: Square, description: '4-connected area filling' },
//     { id: 'bezier_curve', name: 'Bézier Curve', icon: RefreshCw, description: 'Smooth curve generation' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={onBack}
//                 className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105 group"
//                 title="Back to Paint App"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-1 transition-transform" />
//               </button>
//               <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <Activity className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Algorithm Visualizer
//                 </h1>
//                 <p className="text-gray-600 text-sm">Mathematical algorithms for computer graphics with pixel-level visualization</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
//                 <span className="text-sm text-gray-600">Steps:</span>
//                 <span className="text-sm font-bold text-gray-800">{animationStep}/{algorithmSteps.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-6">
//           {/* Algorithm Selection Sidebar */}
//           <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 w-80 h-fit flex-shrink-0">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <Zap className="w-5 h-5 mr-2 text-indigo-600" />
//               Choose Algorithm
//             </h3>
//             <div className="grid grid-cols-1 gap-3">
//               {algorithms.map((algo) => (
//                 <button
//                   key={algo.id}
//                   onClick={() => setSelectedAlgorithm(algo.id as AlgorithmType)}
//                   className={`p-4 rounded-xl transition-all transform hover:scale-105 text-left ${
//                     selectedAlgorithm === algo.id
//                       ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
//                       : 'bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-sm'
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <algo.icon className="w-5 h-5" />
//                     <div>
//                       <div className="font-semibold">{algo.name}</div>
//                       <div className={`text-xs ${selectedAlgorithm === algo.id ? 'text-indigo-100' : 'text-gray-500'}`}>
//                         {algo.description}
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 space-y-6">
//             {/* Controls Panel - Now above canvas */}
//             <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
//               <div className="flex items-center gap-8">
//                 {/* Parameters Section */}
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3">Parameters</h3>
                  
//                   {(selectedAlgorithm === 'dda_line' || selectedAlgorithm === 'bresenham_line' || selectedAlgorithm === 'wu_line') && (
//                     <div className="flex items-center gap-6">
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Start:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('start');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'start' 
//                               ? 'bg-red-500 text-white' 
//                               : 'bg-red-100 hover:bg-red-200 text-red-700'
//                           }`}
//                         >
//                           ({startPoint.x}, {startPoint.y})
//                         </button>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">End:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('end');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'end' 
//                               ? 'bg-green-500 text-white' 
//                               : 'bg-green-100 hover:bg-green-200 text-green-700'
//                           }`}
//                         >
//                           ({endPoint.x}, {endPoint.y})
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {selectedAlgorithm === 'midpoint_circle' && (
//                     <div className="flex items-center gap-6">
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Center:</span>
//                         <button
//                           onClick={() => {
//                             setIsSelecting(true);
//                             setSelectingWhat('center');
//                           }}
//                           className={`px-3 py-2 rounded-lg text-sm transition-all ${
//                             isSelecting && selectingWhat === 'center' 
//                               ? 'bg-yellow-500 text-white' 
//                               : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
//                           }`}
//                         >
//                           ({center.x}, {center.y})
//                         </button>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         <span className="text-sm font-medium text-gray-700">Radius:</span>
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="range"
//                             min="5"
//                             max="30"
//                             value={radius}
//                             onChange={(e) => setRadius(parseInt(e.target.value))}
//                             className="w-24 h-2 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg appearance-none cursor-pointer"
//                           />
//                           <span className="text-sm font-bold text-gray-800 w-8">{radius}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Zoom Controls */}
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setZoom(Math.max(1, zoom - 2))}
//                     className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:scale-105"
//                     title="Zoom Out"
//                   >
//                     <ZoomOut className="w-5 h-5" />
//                   </button>
                  
//                   <button
//                     onClick={() => setZoom(Math.min(50, zoom + 2))}
//                     className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all hover:scale-105"
//                     title="Zoom In"
//                   >
//                     <ZoomIn className="w-5 h-5" />
//                   </button>
                  
//                   <button
//                     onClick={() => {
//                       setShowPixels(!showPixels);
//                       setShowGrid(!showGrid);
//                     }}
//                     className={`p-3 rounded-xl transition-all hover:scale-105 ${
//                       showPixels ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
//                     }`}
//                     title="Toggle Grid & Pixels"
//                   >
//                     {showPixels ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//                   </button>
//                 </div>

//                 {/* Controls Section */}
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={animateAlgorithm}
//                     disabled={isAnimating}
//                     className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
//                   >
//                     <Play className="w-5 h-5" />
//                     <span className="font-medium">Animate</span>
//                   </button>
                  
//                   <button
//                     onClick={clearPixels}
//                     className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg flex items-center gap-2"
//                   >
//                     <RotateCcw className="w-5 h-5" />
//                     <span className="font-medium">Clear</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Visualization Canvas */}
//             <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
//               <div 
//                 ref={containerRef}
//                 className="relative border-4 border-gray-400 rounded-xl bg-white"
//                 style={{ 
//                   width: `${CANVAS_DISPLAY_WIDTH}px`, 
//                   height: `${CANVAS_DISPLAY_HEIGHT}px` 
//                 }}
//               >
//                 <canvas
//                   ref={canvasRef}
//                   onClick={handleCanvasClick}
//                   width={CANVAS_DISPLAY_WIDTH}
//                   height={CANVAS_DISPLAY_HEIGHT}
//                   className={`${isSelecting ? 'cursor-crosshair' : 'cursor-default'} block`}
//                   style={{ 
//                     width: `${CANVAS_DISPLAY_WIDTH}px`,
//                     height: `${CANVAS_DISPLAY_HEIGHT}px`,
//                     imageRendering: 'pixelated'
//                   }}
//                 />
//               </div>
              
//               <div className="mt-6 space-y-4">
//                 <div className="grid grid-cols-4 gap-4 text-sm">
//                   <div className="text-center p-3 bg-red-100 rounded-lg">
//                     <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-red-700">Start Point</div>
//                     <div className="text-red-600">({startPoint.x}, {startPoint.y})</div>
//                   </div>
//                   <div className="text-center p-3 bg-green-100 rounded-lg">
//                     <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-green-700">End Point</div>
//                     <div className="text-green-600">({endPoint.x}, {endPoint.y})</div>
//                   </div>
//                   <div className="text-center p-3 bg-blue-100 rounded-lg">
//                     <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-blue-700">Active Pixels</div>
//                     <div className="text-blue-600">{pixels.flat().filter(p => p).length}</div>
//                   </div>
//                   <div className="text-center p-3 bg-purple-100 rounded-lg">
//                     <div className="w-4 h-4 bg-purple-500 rounded mx-auto mb-2"></div>
//                     <div className="font-semibold text-purple-700">Zoom Level</div>
//                     <div className="text-purple-600">{zoom}x</div>
//                   </div>
//                 </div>
                
//                 {isSelecting && (
//                   <div className="text-center p-4 bg-yellow-100 rounded-lg border border-yellow-300">
//                     <MousePointer className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
//                     <div className="font-semibold text-yellow-800">
//                       Click on the canvas to set the {selectingWhat} point
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }