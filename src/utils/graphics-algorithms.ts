/**
 * Computer Graphics Algorithms Implementation
 * Educational Mini Paint Application
 * 
 * This file contains implementations of classic computer graphics algorithms
 * used in digital drawing and image processing applications.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Pixel {
  x: number;
  y: number;
  color: string;
  alpha?: number;
}

/**
 * BRESENHAM'S LINE ALGORITHM
 * 
 * Purpose: Draw lines using only integer arithmetic (no floating point)
 * Advantage: Fast, accurate, and avoids floating-point calculations
 * 
 * How it works:
 * 1. Uses decision variable to determine which pixel to draw next
 * 2. Increments along major axis, conditionally increments minor axis
 * 3. Handles all octants (8 directions) of line drawing
 * 
 * Educational Value: Fundamental rasterization algorithm in computer graphics
 */
export function bresenhamLine(
  x0: number, 
  y0: number, 
  x1: number, 
  y1: number, 
  color: string = '#000000'
): Pixel[] {
  const pixels: Pixel[] = [];
  
  // Calculate deltas
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  
  // Determine direction of line
  const sx = x0 < x1 ? 1 : -1;  // Step in x direction
  const sy = y0 < y1 ? 1 : -1;  // Step in y direction
  
  // Decision variable - determines when to increment minor axis
  let err = dx - dy;
  
  let x = x0;
  let y = y0;
  
  while (true) {
    // Add current pixel to result
    pixels.push({ x, y, color });
    
    // Check if we've reached the end point
    if (x === x1 && y === y1) break;
    
    // Calculate error for next step
    const e2 = 2 * err;
    
    // Decide whether to step in x direction
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    
    // Decide whether to step in y direction
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  
  return pixels;
}

/**
 * DDA (Digital Differential Analyzer) LINE ALGORITHM
 * 
 * Purpose: Draw lines using incremental calculations
 * Advantage: Simple to understand and implement
 * 
 * How it works:
 * 1. Calculate slope and determine major axis
 * 2. Increment along major axis by 1, increment minor axis by slope
 * 3. Round coordinates to nearest integer for pixel placement
 * 
 * Educational Value: Shows basic rasterization concepts
 */
export function ddaLine(
  x0: number, 
  y0: number, 
  x1: number, 
  y1: number, 
  color: string = '#000000'
): Pixel[] {
  const pixels: Pixel[] = [];
  
  const dx = x1 - x0;
  const dy = y1 - y0;
  
  // Determine number of steps (major axis)
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  
  // Calculate increment for each step
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;
  
  let x = x0;
  let y = y0;
  
  for (let i = 0; i <= steps; i++) {
    pixels.push({ 
      x: Math.round(x), 
      y: Math.round(y), 
      color 
    });
    
    x += xIncrement;
    y += yIncrement;
  }
  
  return pixels;
}

/**
 * MIDPOINT CIRCLE ALGORITHM (Bresenham's Circle)
 * 
 * Purpose: Draw circles using only integer arithmetic
 * Advantage: Efficient, symmetric, no trigonometric functions
 * 
 * How it works:
 * 1. Uses 8-way symmetry to draw complete circle
 * 2. Decision variable determines inside/outside of circle
 * 3. Only calculates 1/8 of circle, mirrors for other 7 octants
 * 
 * Educational Value: Shows optimization through symmetry
 */
export function midpointCircle(
  centerX: number, 
  centerY: number, 
  radius: number, 
  color: string = '#000000'
): Pixel[] {
  const pixels: Pixel[] = [];
  
  let x = 0;
  let y = radius;
  
  // Decision variable for midpoint algorithm
  let d = 1 - radius;
  
  // Helper function to add 8 symmetric points
  const addSymmetricPoints = (cx: number, cy: number, x: number, y: number) => {
    pixels.push({ x: cx + x, y: cy + y, color });  // Octant 1
    pixels.push({ x: cx - x, y: cy + y, color });  // Octant 2
    pixels.push({ x: cx + x, y: cy - y, color });  // Octant 3
    pixels.push({ x: cx - x, y: cy - y, color });  // Octant 4
    pixels.push({ x: cx + y, y: cy + x, color });  // Octant 5
    pixels.push({ x: cx - y, y: cy + x, color });  // Octant 6
    pixels.push({ x: cx + y, y: cy - x, color });  // Octant 7
    pixels.push({ x: cx - y, y: cy - x, color });  // Octant 8
  };
  
  // Initial point
  addSymmetricPoints(centerX, centerY, x, y);
  
  while (x < y) {
    x++;
    
    if (d < 0) {
      // Midpoint is inside circle, choose E
      d += 2 * x + 1;
    } else {
      // Midpoint is outside circle, choose SE
      y--;
      d += 2 * (x - y) + 1;
    }
    
    addSymmetricPoints(centerX, centerY, x, y);
  }
  
  return pixels;
}

/**
 * FLOOD FILL ALGORITHM (4-Connected)
 * 
 * Purpose: Fill enclosed areas with color
 * Advantage: Fills complex shapes automatically
 * 
 * How it works:
 * 1. Start from seed point, check if it matches target color
 * 2. Replace with new color and recursively fill neighbors
 * 3. Uses stack to avoid recursion depth issues
 * 
 * Educational Value: Shows recursive algorithms and boundary detection
 */
export function floodFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  newColor: string,
  tolerance: number = 0
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const data = new Uint8ClampedArray(imageData.data);
  
  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const newRgb = hexToRgb(newColor);
  
  // Get pixel color at position
  const getPixel = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3]
    };
  };
  
  // Set pixel color at position
  const setPixel = (x: number, y: number, color: {r: number, g: number, b: number}) => {
    const index = (y * width + x) * 4;
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = 255;
  };
  
  // Check if colors match within tolerance
  const colorsMatch = (c1: any, c2: any) => {
    return Math.abs(c1.r - c2.r) <= tolerance &&
           Math.abs(c1.g - c2.g) <= tolerance &&
           Math.abs(c1.b - c2.b) <= tolerance;
  };
  
  const targetColor = getPixel(startX, startY);
  
  // Don't fill if target color is same as new color
  if (colorsMatch(targetColor, newRgb)) {
    return new ImageData(data, width, height);
  }
  
  const stack: Point[] = [{ x: startX, y: startY }];
  
  while (stack.length > 0) {
    const { x, y } = stack.pop()!;
    
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    
    const currentColor = getPixel(x, y);
    
    if (!colorsMatch(currentColor, targetColor)) continue;
    
    setPixel(x, y, newRgb);
    
    // Add 4-connected neighbors
    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
  }
  
  return new ImageData(data, width, height);
}

/**
 * ANTI-ALIASED LINE DRAWING (Wu's Algorithm)
 * 
 * Purpose: Draw smooth lines with anti-aliasing
 * Advantage: Eliminates jagged edges, produces smooth lines
 * 
 * How it works:
 * 1. Uses fractional coverage to determine pixel intensity
 * 2. Blends colors based on how much line covers each pixel
 * 3. Creates smooth appearance by varying opacity
 * 
 * Educational Value: Shows advanced rasterization techniques
 */
export function wuLine(
  x0: number, 
  y0: number, 
  x1: number, 
  y1: number, 
  color: string = '#000000'
): Pixel[] {
  const pixels: Pixel[] = [];
  
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
  const gradient = dy / dx;
  
  // Handle first endpoint
  let xend = Math.round(x0);
  let yend = y0 + gradient * (xend - x0);
  let xgap = 1 - (x0 + 0.5 - Math.floor(x0 + 0.5));
  let xpxl1 = xend;
  let ypxl1 = Math.floor(yend);
  
  const plot = (x: number, y: number, alpha: number) => {
    if (steep) {
      pixels.push({ x: y, y: x, color, alpha });
    } else {
      pixels.push({ x, y, color, alpha });
    }
  };
  
  plot(xpxl1, ypxl1, (1 - (yend - ypxl1)) * xgap);
  plot(xpxl1, ypxl1 + 1, (yend - ypxl1) * xgap);
  
  let intery = yend + gradient;
  
  // Handle second endpoint
  xend = Math.round(x1);
  yend = y1 + gradient * (xend - x1);
  xgap = x1 + 0.5 - Math.floor(x1 + 0.5);
  let xpxl2 = xend;
  let ypxl2 = Math.floor(yend);
  
  plot(xpxl2, ypxl2, (1 - (yend - ypxl2)) * xgap);
  plot(xpxl2, ypxl2 + 1, (yend - ypxl2) * xgap);
  
  // Main loop
  for (let x = xpxl1 + 1; x < xpxl2; x++) {
    plot(x, Math.floor(intery), 1 - (intery - Math.floor(intery)));
    plot(x, Math.floor(intery) + 1, intery - Math.floor(intery));
    intery += gradient;
  }
  
  return pixels;
}

/**
 * COHEN-SUTHERLAND LINE CLIPPING ALGORITHM
 * 
 * Purpose: Clip lines to rectangular boundaries
 * Advantage: Efficient rejection of lines outside viewport
 * 
 * How it works:
 * 1. Assigns region codes to line endpoints
 * 2. Uses bitwise operations to determine clipping needs
 * 3. Iteratively clips line segments until inside viewport
 * 
 * Educational Value: Shows computational geometry and optimization
 */
export function cohenSutherlandClip(
  x0: number, y0: number, 
  x1: number, y1: number,
  xmin: number, ymin: number, 
  xmax: number, ymax: number
): { x0: number, y0: number, x1: number, y1: number } | null {
  
  // Region codes
  const INSIDE = 0; // 0000
  const LEFT = 1;   // 0001
  const RIGHT = 2;  // 0010
  const BOTTOM = 4; // 0100
  const TOP = 8;    // 1000
  
  // Compute region code for a point
  const computeCode = (x: number, y: number): number => {
    let code = INSIDE;
    
    if (x < xmin) code |= LEFT;
    else if (x > xmax) code |= RIGHT;
    
    if (y < ymin) code |= BOTTOM;
    else if (y > ymax) code |= TOP;
    
    return code;
  };
  
  let code0 = computeCode(x0, y0);
  let code1 = computeCode(x1, y1);
  
  while (true) {
    // Both endpoints inside rectangle
    if ((code0 | code1) === 0) {
      return { x0, y0, x1, y1 };
    }
    
    // Both endpoints share an outside region
    if ((code0 & code1) !== 0) {
      return null; // Line is completely outside
    }
    
    // Line needs clipping
    let codeOut = code0 !== 0 ? code0 : code1;
    let x: number, y: number;
    
    // Find intersection point
    if (codeOut & TOP) {
      x = x0 + (x1 - x0) * (ymax - y0) / (y1 - y0);
      y = ymax;
    } else if (codeOut & BOTTOM) {
      x = x0 + (x1 - x0) * (ymin - y0) / (y1 - y0);
      y = ymin;
    } else if (codeOut & RIGHT) {
      y = y0 + (y1 - y0) * (xmax - x0) / (x1 - x0);
      x = xmax;
    } else if (codeOut & LEFT) {
      y = y0 + (y1 - y0) * (xmin - x0) / (x1 - x0);
      x = xmin;
    }
    
    // Replace point outside clipping rectangle
    if (codeOut === code0) {
      x0 = x!;
      y0 = y!;
      code0 = computeCode(x0, y0);
    } else {
      x1 = x!;
      y1 = y!;
      code1 = computeCode(x1, y1);
    }
  }
}

/**
 * BEZIER CURVE IMPLEMENTATION
 * 
 * Purpose: Draw smooth curves using control points
 * Advantage: Mathematically precise curves, scalable
 * 
 * How it works:
 * 1. Uses parametric equations with parameter t (0 to 1)
 * 2. Blends control points using Bernstein polynomials
 * 3. Generates smooth curve by sampling parameter space
 * 
 * Educational Value: Shows parametric curve mathematics
 */
export function drawBezierCurve(
  p0: Point, p1: Point, p2: Point, p3: Point,
  color: string = '#000000',
  steps: number = 100
): Pixel[] {
  const pixels: Pixel[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    
    // Cubic Bezier formula
    const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
    const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;
    
    pixels.push({ 
      x: Math.round(x), 
      y: Math.round(y), 
      color 
    });
  }
  
  return pixels;
}