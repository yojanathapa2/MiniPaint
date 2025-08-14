# MiniPaint - React & TypeScript Version

A professional digital art studio built with React, TypeScript, and Tailwind CSS, featuring a beautiful interface, powerful drawing tools, and an algorithm visualizer.

## 🎨 Features

### Drawing Tools
- **Brush** - Smooth freehand drawing
- **Pen** - Precise thin lines
- **Marker** - Bold, semi-transparent strokes
- **Eraser** - Remove unwanted marks
- **Line** - Draw straight lines (DDA/Bresenham/Wu)
- **Rectangle** - Perfect rectangles
- **Circle** - Perfect circles (Midpoint algorithm)
- **Triangle** - Geometric triangles
- **Star** - 5-pointed stars
- **Heart** - Heart shapes

### Algorithm Visualizer
- **Algorithms**:
  - DDA Line: Digital Differential Analyzer
  - Bresenham Line: Integer-based line drawing
  - Wu Line: Anti-aliased line drawing
  - Midpoint Circle: Efficient circle drawing
  - Flood Fill: 4-connected area filling (BFS)
  - Bézier Curve: Smooth quadratic curves
- **Interactive Grid**: 60x40 pixels with adjustable points
- **Animation**: Visualize algorithm steps with 50-500ms speed control
- **Bézier Curve Note**: Smaller font size for control point buttons to prevent text wrapping

### Professional Features
- **Adjustable brush size** (1-100px)
- **Rich color palette** (24+ colors)
- **Real-time preview** for shapes and algorithms
- **Undo/Redo support** (50 levels)
- **Save artwork** as PNG files
- **Keyboard shortcuts**
- **Smooth drawing** with anti-aliasing
- **Professional UI** with landing page and bluish gradient (from-blue-50 via-blue-100 to-blue-200)

## 🚀 Installation & Usage

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)

### Installation
1. Clone the repository:
   - git clone <repository-url>
2. Navigate to the project directory:
   - cd mini-paint
3. Install dependencies:
   - npm install
4. Run the application:
   - npm start
5. Open the application:
   - Open http://localhost:3000 in your browser

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag** - Draw with selected tool
- **Click on tools** - Select drawing tool or algorithm
- **Click on colors** - Change drawing color
- **Drag slider** - Adjust brush size or animation speed
- **Canvas Click** - Set algorithm points (start/end/control)

### Keyboard Shortcuts
- **Ctrl + Z** - Undo
- **Ctrl + Y** - Redo
- **Ctrl + S** - Save canvas
- **Escape** - Return to home screen

### Interface
- **Start Creating** - Enter the drawing application
- **Back to Home** - Return to landing page
- **Clear** - Clear entire canvas
- **Save** - Export artwork as PNG
- **Algorithm Visualizer** - Explore pixel-based algorithms


## 🎯 Technical Features

- **Smooth Drawing**: Anti-aliased canvas rendering for fluid strokes
- **Shape Preview**: Real-time preview for shapes and algorithms
- **Memory Management**: Efficient 50-level undo/redo system
- **File Export**: High-quality PNG export with timestamps
- **Responsive UI**: 60 FPS interface with Tailwind CSS and bluish gradient
- **Algorithm Visualization**: Interactive pixel grid for algorithms like BFS Flood Fill

## 🎨 Art Tips

1. **Use different tools** for varied effects:
   - Brush for general sketching
   - Pen for detailed work
   - Marker for bold highlights
2. **Combine shapes** to create complex artwork
3. **Use algorithms** for precise drawing (e.g., Bézier Curve for smooth curves)
4. **Use undo/redo** to experiment freely
5. **Save frequently** to preserve your work

## 🔧 Customization

The application is highly customizable. You can modify:
- Color palette in COLOR_PALETTE
- Canvas size via CANVAS_WIDTH and CANVAS_HEIGHT
- Tool behavior in respective components
- UI colors and layout in styles/ (e.g., adjust from-blue-50 via-blue-100 to-blue-200)

## 📸 Screenshots

The application features:
- Beautiful gradient landing page
- Professional toolbar with organized tools
- Large drawing canvas (800x600)
- Interactive algorithm visualizer (60x40 grid)
- Real-time status and animation controls

## 🤝 Contributing

Feel free to contribute by:
- Adding new drawing tools or algorithms
- Improving UI/UX
- Adding new export formats
- Optimizing performance

1. Fork the repository
2. Create a feature branch (git checkout -b feature/new-tool)
3. Commit changes (git commit -m "Add new tool")
4. Push to the branch (git push origin feature/new-tool)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Creating! 🎨**
