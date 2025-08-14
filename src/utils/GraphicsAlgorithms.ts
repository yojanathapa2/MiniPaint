// GraphicsAlgorithms.tsx - Computer Graphics Algorithms Implementation

export interface Point {
  x: number;
  y: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export class GraphicsAlgorithms {
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.imageData = ctx.getImageData(0, 0, this.width, this.height);
  }

  // Update image data from canvas
  updateImageData() {
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
  }

  // Apply image data to canvas
  applyImageData() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  // Set pixel color in image data
  private setPixel(x: number, y: number, color: Color) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    
    const index = (y * this.width + x) * 4;
    this.imageData.data[index] = color.r;
    this.imageData.data[index + 1] = color.g;
    this.imageData.data[index + 2] = color.b;
    this.imageData.data[index + 3] = color.a || 255;
  }

  // Get pixel color from image data
  private getPixel(x: number, y: number): Color {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    
    const index = (y * this.width + x) * 4;
    return {
      r: this.imageData.data[index],
      g: this.imageData.data[index + 1],
      b: this.imageData.data[index + 2],
      a: this.imageData.data[index + 3]
    };
  }

  // Convert hex color to Color object
  private hexToColor(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b, a: 255 };
  }

  // 1. DDA LINE ALGORITHM
  ddaLine(start: Point, end: Point, color: string) {
    this.updateImageData();
    const colorObj = this.hexToColor(color);
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    const xIncrement = dx / steps;
    const yIncrement = dy / steps;
    
    let x = start.x;
    let y = start.y;
    
    for (let i = 0; i <= steps; i++) {
      this.setPixel(Math.round(x), Math.round(y), colorObj);
      x += xIncrement;
      y += yIncrement;
    }
    
    this.applyImageData();
  }

  // 2. BRESENHAM'S LINE ALGORITHM
  bresenhamLine(start: Point, end: Point, color: string) {
    this.updateImageData();
    const colorObj = this.hexToColor(color);
    
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
    const dy = Math.abs(y1 - y0);
    let error = Math.floor(dx / 2);
    const yStep = y0 < y1 ? 1 : -1;
    let y = y0;
    
    for (let x = x0; x <= x1; x++) {
      if (steep) {
        this.setPixel(y, x, colorObj);
      } else {
        this.setPixel(x, y, colorObj);
      }
      
      error -= dy;
      if (error < 0) {
        y += yStep;
        error += dx;
      }
    }
    
    this.applyImageData();
  }

  // 3. WU'S LINE ALGORITHM (Anti-aliased)
  wuLine(start: Point, end: Point, color: string) {
    this.updateImageData();
    const baseColor = this.hexToColor(color);
    
    const steep = Math.abs(start.y - end.y) > Math.abs(start.x - end.x);
    
    let x0 = start.x, y0 = start.y, x1 = end.x, y1 = end.y;
    
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
    
    // First endpoint
    let xEnd = Math.round(x0);
    let yEnd = y0 + gradient * (xEnd - x0);
    let xGap = 1 - (x0 + 0.5 - Math.floor(x0 + 0.5));
    let xPixel1 = xEnd;
    let yPixel1 = Math.floor(yEnd);
    
    if (steep) {
      this.setPixel(yPixel1, xPixel1, { ...baseColor, a: Math.floor(255 * (1 - (yEnd - yPixel1)) * xGap) });
      this.setPixel(yPixel1 + 1, xPixel1, { ...baseColor, a: Math.floor(255 * (yEnd - yPixel1) * xGap) });
    } else {
      this.setPixel(xPixel1, yPixel1, { ...baseColor, a: Math.floor(255 * (1 - (yEnd - yPixel1)) * xGap) });
      this.setPixel(xPixel1, yPixel1 + 1, { ...baseColor, a: Math.floor(255 * (yEnd - yPixel1) * xGap) });
    }
    
    let intery = yEnd + gradient;
    
    // Second endpoint
    xEnd = Math.round(x1);
    yEnd = y1 + gradient * (xEnd - x1);
    xGap = x1 + 0.5 - Math.floor(x1 + 0.5);
    let xPixel2 = xEnd;
    let yPixel2 = Math.floor(yEnd);
    
    if (steep) {
      this.setPixel(yPixel2, xPixel2, { ...baseColor, a: Math.floor(255 * (1 - (yEnd - yPixel2)) * xGap) });
      this.setPixel(yPixel2 + 1, xPixel2, { ...baseColor, a: Math.floor(255 * (yEnd - yPixel2) * xGap) });
    } else {
      this.setPixel(xPixel2, yPixel2, { ...baseColor, a: Math.floor(255 * (1 - (yEnd - yPixel2)) * xGap) });
      this.setPixel(xPixel2, yPixel2 + 1, { ...baseColor, a: Math.floor(255 * (yEnd - yPixel2) * xGap) });
    }
    
    // Main loop
    for (let x = xPixel1 + 1; x < xPixel2; x++) {
      if (steep) {
        this.setPixel(Math.floor(intery), x, { ...baseColor, a: Math.floor(255 * (1 - (intery - Math.floor(intery)))) });
        this.setPixel(Math.floor(intery) + 1, x, { ...baseColor, a: Math.floor(255 * (intery - Math.floor(intery))) });
      } else {
        this.setPixel(x, Math.floor(intery), { ...baseColor, a: Math.floor(255 * (1 - (intery - Math.floor(intery)))) });
        this.setPixel(x, Math.floor(intery) + 1, { ...baseColor, a: Math.floor(255 * (intery - Math.floor(intery))) });
      }
      intery += gradient;
    }
    
    this.applyImageData();
  }

  // 4. MIDPOINT CIRCLE ALGORITHM
  midpointCircle(center: Point, radius: number, color: string) {
    this.updateImageData();
    const colorObj = this.hexToColor(color);
    
    let x = 0;
    let y = radius;
    let p = 1 - radius;
    
    const plotCirclePoints = (cx: number, cy: number, x: number, y: number) => {
      this.setPixel(cx + x, cy + y, colorObj);
      this.setPixel(cx - x, cy + y, colorObj);
      this.setPixel(cx + x, cy - y, colorObj);
      this.setPixel(cx - x, cy - y, colorObj);
      this.setPixel(cx + y, cy + x, colorObj);
      this.setPixel(cx - y, cy + x, colorObj);
      this.setPixel(cx + y, cy - x, colorObj);
      this.setPixel(cx - y, cy - x, colorObj);
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
    
    this.applyImageData();
  }

  // 5. FLOOD FILL ALGORITHM (4-Connected)
  floodFill(startPoint: Point, fillColor: string) {
    this.updateImageData();
    const newColor = this.hexToColor(fillColor);
    const originalColor = this.getPixel(startPoint.x, startPoint.y);
    
    // If the color is the same, no need to fill
    if (this.colorsEqual(originalColor, newColor)) return;
    
    const stack: Point[] = [startPoint];
    
    while (stack.length > 0) {
      const point = stack.pop()!;
      const currentColor = this.getPixel(point.x, point.y);
      
      if (!this.colorsEqual(currentColor, originalColor)) continue;
      
      this.setPixel(point.x, point.y, newColor);
      
      // Add 4-connected neighbors
      if (point.x > 0) stack.push({ x: point.x - 1, y: point.y });
      if (point.x < this.width - 1) stack.push({ x: point.x + 1, y: point.y });
      if (point.y > 0) stack.push({ x: point.x, y: point.y - 1 });
      if (point.y < this.height - 1) stack.push({ x: point.x, y: point.y + 1 });
    }
    
    this.applyImageData();
  }

  // 6. BEZIER CURVE
  drawBezierCurve(controlPoints: Point[], color: string) {
    if (controlPoints.length < 4) return;
    
    this.updateImageData();
    const colorObj = this.hexToColor(color);
    
    const steps = 1000;
    
    for (let t = 0; t <= 1; t += 1 / steps) {
      const point = this.calculateBezierPoint(controlPoints, t);
      this.setPixel(Math.round(point.x), Math.round(point.y), colorObj);
    }
    
    this.applyImageData();
  }

  private calculateBezierPoint(points: Point[], t: number): Point {
    if (points.length === 1) return points[0];
    
    const newPoints: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * points[i].x + t * points[i + 1].x,
        y: (1 - t) * points[i].y + t * points[i + 1].y
      });
    }
    
    return this.calculateBezierPoint(newPoints, t);
  }

  // 7. COHEN-SUTHERLAND LINE CLIPPING
  cohenSutherlandClip(start: Point, end: Point, clipRect: { xMin: number, yMin: number, xMax: number, yMax: number }, color: string) {
    const INSIDE = 0; // 0000
    const LEFT = 1;   // 0001
    const RIGHT = 2;  // 0010
    const BOTTOM = 4; // 0100
    const TOP = 8;    // 1000
    
    const computeCode = (x: number, y: number): number => {
      let code = INSIDE;
      
      if (x < clipRect.xMin) code |= LEFT;
      else if (x > clipRect.xMax) code |= RIGHT;
      
      if (y < clipRect.yMin) code |= BOTTOM;
      else if (y > clipRect.yMax) code |= TOP;
      
      return code;
    };
    
    let x0 = start.x, y0 = start.y;
    let x1 = end.x, y1 = end.y;
    
    let code0 = computeCode(x0, y0);
    let code1 = computeCode(x1, y1);
    let accept = false;
    
    while (true) {
      if (!(code0 | code1)) {
        // Both endpoints inside rectangle
        accept = true;
        break;
      } else if (code0 & code1) {
        // Both endpoints outside rectangle
        break;
      } else {
        // Some segment inside rectangle
        let codeOut = code0 ? code0 : code1;
        let x: number, y: number;
        
        if (codeOut & TOP) {
          x = x0 + (x1 - x0) * (clipRect.yMax - y0) / (y1 - y0);
          y = clipRect.yMax;
        } else if (codeOut & BOTTOM) {
          x = x0 + (x1 - x0) * (clipRect.yMin - y0) / (y1 - y0);
          y = clipRect.yMin;
        } else if (codeOut & RIGHT) {
          y = y0 + (y1 - y0) * (clipRect.xMax - x0) / (x1 - x0);
          x = clipRect.xMax;
        } else if (codeOut & LEFT) {
          y = y0 + (y1 - y0) * (clipRect.xMin - x0) / (x1 - x0);
          x = clipRect.xMin;
        } else {
          x = 0;
          y = 0;
        }
        
        if (codeOut === code0) {
          x0 = x;
          y0 = y;
          code0 = computeCode(x0, y0);
        } else {
          x1 = x;
          y1 = y;
          code1 = computeCode(x1, y1);
        }
      }
    }
    
    if (accept) {
      this.bresenhamLine({ x: x0, y: y0 }, { x: x1, y: y1 }, color);
    }
  }

  // Helper function to compare colors
  private colorsEqual(color1: Color, color2: Color): boolean {
    return color1.r === color2.r && 
           color1.g === color2.g && 
           color1.b === color2.b && 
           (color1.a || 255) === (color2.a || 255);
  }
}

// Export algorithm types for use in main paint app
export enum AlgorithmType {
  DDA_LINE = 'dda',
  BRESENHAM_LINE = 'bresenham',
  WU_LINE = 'wu',
  MIDPOINT_CIRCLE = 'midpoint_circle',
  FLOOD_FILL = 'flood_fill',
  BEZIER_CURVE = 'bezier',
  COHEN_SUTHERLAND = 'cohen_sutherland'
}

export default GraphicsAlgorithms;