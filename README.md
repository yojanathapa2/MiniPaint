# Mini Paint - Python Pygame Version

A professional digital art studio built with Python and Pygame, featuring a beautiful interface and powerful drawing tools.

## 🎨 Features

### Drawing Tools
- **Brush** - Smooth freehand drawing
- **Pen** - Precise thin lines
- **Marker** - Bold, semi-transparent strokes
- **Eraser** - Remove unwanted marks
- **Line** - Draw straight lines
- **Rectangle** - Perfect rectangles
- **Circle** - Perfect circles
- **Triangle** - Geometric triangles
- **Star** - 5-pointed stars
- **Heart** - Heart shapes

### Professional Features
- **Adjustable brush size** (1-100px)
- **Rich color palette** (24+ colors)
- **Real-time preview** for shapes
- **Undo/Redo support** (50 levels)
- **Save artwork** as PNG files
- **Keyboard shortcuts**
- **Smooth drawing** with anti-aliasing
- **Professional UI** with landing page

## 🚀 Installation & Usage

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation
1. Install required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python mini_paint.py
```

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag** - Draw with selected tool
- **Click on tools** - Select drawing tool
- **Click on colors** - Change drawing color
- **Drag slider** - Adjust brush size

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

## 📁 File Structure

```
mini_paint.py       # Main application file
requirements.txt    # Python dependencies
README.md          # This file
saves/             # Directory for saved artworks (auto-created)
```

## 🎯 Technical Features

- **Smooth Drawing**: Advanced line interpolation for fluid strokes
- **Shape Preview**: Real-time preview while drawing shapes
- **Memory Management**: Efficient history system with 50-level undo
- **File Export**: High-quality PNG export with timestamps
- **Responsive UI**: 60 FPS interface with smooth interactions

## 🎨 Art Tips

1. **Use different tools** for different effects:
   - Brush for general drawing
   - Pen for detailed work
   - Marker for bold highlights

2. **Combine shapes** to create complex artwork
3. **Use undo/redo** to experiment freely
4. **Save frequently** to preserve your work

## 🔧 Customization

The application is highly customizable. You can modify:
- Color palette in `COLOR_PALETTE`
- Canvas size via `CANVAS_WIDTH` and `CANVAS_HEIGHT`
- Tool behavior in the respective drawing methods
- UI colors and layout

## 📸 Screenshots

The application features:
- Beautiful gradient landing page
- Professional toolbar with organized tools
- Large drawing canvas (800x600)
- Real-time status information
- Intuitive color picker

## 🤝 Contributing

Feel free to contribute by:
- Adding new drawing tools
- Improving the UI/UX
- Adding new export formats
- Optimizing performance

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Creating! 🎨**