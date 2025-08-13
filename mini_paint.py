import pygame
import sys
import math
from enum import Enum
from typing import Tuple, List, Optional
import os

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 1200
WINDOW_HEIGHT = 800
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
TOOLBAR_WIDTH = 350
HEADER_HEIGHT = 80

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (128, 128, 128)
LIGHT_GRAY = (200, 200, 200)
DARK_GRAY = (64, 64, 64)
BLUE = (37, 99, 235)
PURPLE = (139, 92, 246)
RED = (239, 68, 68)
GREEN = (34, 197, 94)
YELLOW = (251, 191, 36)
ORANGE = (249, 115, 22)
PINK = (236, 72, 153)
CYAN = (6, 182, 212)

# Color palette
COLOR_PALETTE = [
    BLACK, WHITE, RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE,
    PINK, CYAN, (128, 0, 0), (0, 128, 0), (0, 0, 128), (128, 128, 0),
    (128, 0, 128), (0, 128, 128), GRAY, LIGHT_GRAY,
    (255, 128, 128), (128, 255, 128), (128, 128, 255), (255, 255, 128),
    (255, 128, 255), (128, 255, 255), (255, 192, 128), (192, 128, 255)
]

class Tool(Enum):
    BRUSH = "brush"
    PEN = "pen"
    MARKER = "marker"
    ERASER = "eraser"
    LINE = "line"
    RECTANGLE = "rectangle"
    CIRCLE = "circle"
    TRIANGLE = "triangle"
    STAR = "star"
    HEART = "heart"

class MiniPaint:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Mini Paint - Professional Digital Art Studio")
        
        # Canvas setup
        self.canvas = pygame.Surface((CANVAS_WIDTH, CANVAS_HEIGHT))
        self.canvas.fill(WHITE)
        self.preview_surface = pygame.Surface((CANVAS_WIDTH, CANVAS_HEIGHT))
        self.preview_surface.set_alpha(200)
        
        # Drawing state
        self.current_tool = Tool.BRUSH
        self.current_color = BLUE
        self.brush_size = 5
        self.opacity = 255
        self.is_drawing = False
        self.last_pos = None
        self.start_pos = None
        self.show_preview = True
        
        # History for undo/redo
        self.history = [self.canvas.copy()]
        self.history_index = 0
        self.max_history = 50
        
        # UI state
        self.show_landing = True
        self.color_picker_open = False
        
        # Fonts
        self.font_large = pygame.font.Font(None, 48)
        self.font_medium = pygame.font.Font(None, 32)
        self.font_small = pygame.font.Font(None, 24)
        
        # Clock for FPS
        self.clock = pygame.time.Clock()
        
    def save_state(self):
        """Save current canvas state to history"""
        if self.history_index < len(self.history) - 1:
            self.history = self.history[:self.history_index + 1]
        
        self.history.append(self.canvas.copy())
        if len(self.history) > self.max_history:
            self.history.pop(0)
        else:
            self.history_index += 1
    
    def undo(self):
        """Undo last action"""
        if self.history_index > 0:
            self.history_index -= 1
            self.canvas = self.history[self.history_index].copy()
    
    def redo(self):
        """Redo last undone action"""
        if self.history_index < len(self.history) - 1:
            self.history_index += 1
            self.canvas = self.history[self.history_index].copy()
    
    def clear_canvas(self):
        """Clear the entire canvas"""
        self.canvas.fill(WHITE)
        self.save_state()
    
    def get_canvas_pos(self, screen_pos: Tuple[int, int]) -> Optional[Tuple[int, int]]:
        """Convert screen position to canvas position"""
        canvas_x = TOOLBAR_WIDTH + 20
        canvas_y = HEADER_HEIGHT + 20
        
        x, y = screen_pos
        canvas_rel_x = x - canvas_x
        canvas_rel_y = y - canvas_y
        
        if 0 <= canvas_rel_x < CANVAS_WIDTH and 0 <= canvas_rel_y < CANVAS_HEIGHT:
            return (canvas_rel_x, canvas_rel_y)
        return None
    
    def draw_line_smooth(self, surface: pygame.Surface, start: Tuple[int, int], 
                        end: Tuple[int, int], color: Tuple[int, int, int], width: int):
        """Draw a smooth line between two points"""
        if start == end:
            pygame.draw.circle(surface, color, start, width // 2)
            return
        
        # Calculate distance and steps for smooth line
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        distance = math.sqrt(dx * dx + dy * dy)
        
        if distance == 0:
            return
        
        steps = int(distance)
        for i in range(steps + 1):
            t = i / max(steps, 1)
            x = int(start[0] + t * dx)
            y = int(start[1] + t * dy)
            pygame.draw.circle(surface, color, (x, y), width // 2)
    
    def draw_star(self, surface: pygame.Surface, center: Tuple[int, int], 
                  radius: int, color: Tuple[int, int, int], width: int):
        """Draw a star shape"""
        points = []
        for i in range(10):
            angle = i * math.pi / 5
            if i % 2 == 0:
                r = radius
            else:
                r = radius // 2
            x = center[0] + int(r * math.cos(angle - math.pi / 2))
            y = center[1] + int(r * math.sin(angle - math.pi / 2))
            points.append((x, y))
        
        if width == 1:
            pygame.draw.polygon(surface, color, points, width)
        else:
            pygame.draw.polygon(surface, color, points, width)
    
    def draw_heart(self, surface: pygame.Surface, center: Tuple[int, int], 
                   size: int, color: Tuple[int, int, int], width: int):
        """Draw a heart shape"""
        # Simplified heart using circles and triangle
        x, y = center
        heart_size = size // 2
        
        # Top circles
        pygame.draw.circle(surface, color, (x - heart_size//2, y - heart_size//3), heart_size//2, width)
        pygame.draw.circle(surface, color, (x + heart_size//2, y - heart_size//3), heart_size//2, width)
        
        # Bottom triangle
        points = [
            (x - heart_size, y),
            (x + heart_size, y),
            (x, y + heart_size)
        ]
        pygame.draw.polygon(surface, color, points, width)
    
    def draw_preview(self, end_pos: Tuple[int, int]):
        """Draw preview of current shape being drawn"""
        if not self.show_preview or not self.start_pos:
            return
        
        self.preview_surface.fill((0, 0, 0, 0))
        
        if self.current_tool == Tool.LINE:
            pygame.draw.line(self.preview_surface, self.current_color, 
                           self.start_pos, end_pos, self.brush_size)
        
        elif self.current_tool == Tool.RECTANGLE:
            rect = pygame.Rect(
                min(self.start_pos[0], end_pos[0]),
                min(self.start_pos[1], end_pos[1]),
                abs(end_pos[0] - self.start_pos[0]),
                abs(end_pos[1] - self.start_pos[1])
            )
            pygame.draw.rect(self.preview_surface, self.current_color, rect, self.brush_size)
        
        elif self.current_tool == Tool.CIRCLE:
            radius = int(math.sqrt((end_pos[0] - self.start_pos[0])**2 + 
                                 (end_pos[1] - self.start_pos[1])**2))
            if radius > 0:
                pygame.draw.circle(self.preview_surface, self.current_color, 
                                 self.start_pos, radius, self.brush_size)
        
        elif self.current_tool == Tool.TRIANGLE:
            width = end_pos[0] - self.start_pos[0]
            height = end_pos[1] - self.start_pos[1]
            points = [
                (self.start_pos[0] + width // 2, self.start_pos[1]),
                (self.start_pos[0], self.start_pos[1] + height),
                (self.start_pos[0] + width, self.start_pos[1] + height)
            ]
            pygame.draw.polygon(self.preview_surface, self.current_color, points, self.brush_size)
        
        elif self.current_tool == Tool.STAR:
            radius = abs(end_pos[0] - self.start_pos[0]) // 2
            if radius > 0:
                self.draw_star(self.preview_surface, self.start_pos, radius, 
                             self.current_color, self.brush_size)
        
        elif self.current_tool == Tool.HEART:
            size = abs(end_pos[0] - self.start_pos[0])
            if size > 0:
                self.draw_heart(self.preview_surface, self.start_pos, size, 
                              self.current_color, self.brush_size)
    
    def handle_drawing(self, pos: Tuple[int, int], mouse_pressed: bool):
        """Handle drawing operations"""
        canvas_pos = self.get_canvas_pos(pos)
        if not canvas_pos:
            return
        
        if mouse_pressed and not self.is_drawing:
            # Start drawing
            self.is_drawing = True
            self.start_pos = canvas_pos
            self.last_pos = canvas_pos
            
            if self.current_tool in [Tool.BRUSH, Tool.PEN, Tool.MARKER, Tool.ERASER]:
                if self.current_tool == Tool.ERASER:
                    pygame.draw.circle(self.canvas, WHITE, canvas_pos, self.brush_size // 2)
                else:
                    size = self.brush_size
                    if self.current_tool == Tool.PEN:
                        size = max(1, size // 2)
                    elif self.current_tool == Tool.MARKER:
                        size = int(size * 1.5)
                    
                    pygame.draw.circle(self.canvas, self.current_color, canvas_pos, size // 2)
        
        elif mouse_pressed and self.is_drawing:
            # Continue drawing
            if self.current_tool in [Tool.BRUSH, Tool.PEN, Tool.MARKER, Tool.ERASER]:
                if self.last_pos:
                    if self.current_tool == Tool.ERASER:
                        self.draw_line_smooth(self.canvas, self.last_pos, canvas_pos, WHITE, self.brush_size)
                    else:
                        size = self.brush_size
                        if self.current_tool == Tool.PEN:
                            size = max(1, size // 2)
                        elif self.current_tool == Tool.MARKER:
                            size = int(size * 1.5)
                        
                        self.draw_line_smooth(self.canvas, self.last_pos, canvas_pos, self.current_color, size)
                
                self.last_pos = canvas_pos
            else:
                # Shape tools - show preview
                self.draw_preview(canvas_pos)
        
        elif not mouse_pressed and self.is_drawing:
            # Finish drawing
            self.is_drawing = False
            
            if self.current_tool == Tool.LINE and self.start_pos:
                pygame.draw.line(self.canvas, self.current_color, self.start_pos, canvas_pos, self.brush_size)
            
            elif self.current_tool == Tool.RECTANGLE and self.start_pos:
                rect = pygame.Rect(
                    min(self.start_pos[0], canvas_pos[0]),
                    min(self.start_pos[1], canvas_pos[1]),
                    abs(canvas_pos[0] - self.start_pos[0]),
                    abs(canvas_pos[1] - self.start_pos[1])
                )
                pygame.draw.rect(self.canvas, self.current_color, rect, self.brush_size)
            
            elif self.current_tool == Tool.CIRCLE and self.start_pos:
                radius = int(math.sqrt((canvas_pos[0] - self.start_pos[0])**2 + 
                                     (canvas_pos[1] - self.start_pos[1])**2))
                if radius > 0:
                    pygame.draw.circle(self.canvas, self.current_color, self.start_pos, radius, self.brush_size)
            
            elif self.current_tool == Tool.TRIANGLE and self.start_pos:
                width = canvas_pos[0] - self.start_pos[0]
                height = canvas_pos[1] - self.start_pos[1]
                points = [
                    (self.start_pos[0] + width // 2, self.start_pos[1]),
                    (self.start_pos[0], self.start_pos[1] + height),
                    (self.start_pos[0] + width, self.start_pos[1] + height)
                ]
                pygame.draw.polygon(self.canvas, self.current_color, points, self.brush_size)
            
            elif self.current_tool == Tool.STAR and self.start_pos:
                radius = abs(canvas_pos[0] - self.start_pos[0]) // 2
                if radius > 0:
                    self.draw_star(self.canvas, self.start_pos, radius, self.current_color, self.brush_size)
            
            elif self.current_tool == Tool.HEART and self.start_pos:
                size = abs(canvas_pos[0] - self.start_pos[0])
                if size > 0:
                    self.draw_heart(self.canvas, self.start_pos, size, self.current_color, self.brush_size)
            
            # Clear preview and save state
            self.preview_surface.fill((0, 0, 0, 0))
            self.save_state()
            self.start_pos = None
            self.last_pos = None
    
    def draw_button(self, surface: pygame.Surface, rect: pygame.Rect, text: str, 
                   color: Tuple[int, int, int], text_color: Tuple[int, int, int] = WHITE,
                   font: pygame.font.Font = None, border_radius: int = 8) -> bool:
        """Draw a button and return True if clicked"""
        if font is None:
            font = self.font_small
        
        # Draw button background
        pygame.draw.rect(surface, color, rect, border_radius=border_radius)
        pygame.draw.rect(surface, DARK_GRAY, rect, 2, border_radius=border_radius)
        
        # Draw text
        text_surface = font.render(text, True, text_color)
        text_rect = text_surface.get_rect(center=rect.center)
        surface.blit(text_surface, text_rect)
        
        # Check if clicked
        mouse_pos = pygame.mouse.get_pos()
        mouse_clicked = pygame.mouse.get_pressed()[0]
        return rect.collidepoint(mouse_pos) and mouse_clicked
    
    def draw_tool_button(self, surface: pygame.Surface, rect: pygame.Rect, 
                        tool: Tool, icon_text: str) -> bool:
        """Draw a tool button"""
        is_selected = self.current_tool == tool
        color = BLUE if is_selected else LIGHT_GRAY
        text_color = WHITE if is_selected else BLACK
        
        return self.draw_button(surface, rect, icon_text, color, text_color, self.font_medium)
    
    def draw_landing_page(self):
        """Draw the landing page"""
        # Gradient background
        for y in range(WINDOW_HEIGHT):
            color_ratio = y / WINDOW_HEIGHT
            r = int(75 + (30 - 75) * color_ratio)
            g = int(0 + (41 - 0) * color_ratio)
            b = int(130 + (81 - 130) * color_ratio)
            pygame.draw.line(self.screen, (r, g, b), (0, y), (WINDOW_WIDTH, y))
        
        # Title
        title_text = self.font_large.render("Mini Paint", True, WHITE)
        title_rect = title_text.get_rect(center=(WINDOW_WIDTH // 2, WINDOW_HEIGHT // 2 - 50))
        self.screen.blit(title_text, title_rect)
        
        # Start button
        start_button = pygame.Rect(WINDOW_WIDTH // 2 - 100, WINDOW_HEIGHT // 2 + 20, 200, 60)
        if self.draw_button(self.screen, start_button, "Start Creating", PURPLE, WHITE, self.font_medium, 15):
            self.show_landing = False
    
    def draw_toolbar(self):
        """Draw the toolbar"""
        # Toolbar background
        toolbar_rect = pygame.Rect(0, 0, TOOLBAR_WIDTH, WINDOW_HEIGHT)
        pygame.draw.rect(self.screen, (240, 240, 250), toolbar_rect)
        pygame.draw.line(self.screen, GRAY, (TOOLBAR_WIDTH, 0), (TOOLBAR_WIDTH, WINDOW_HEIGHT), 2)
        
        y_offset = 20
        
        # Title
        title_text = self.font_medium.render("Mini Paint Studio", True, DARK_GRAY)
        self.screen.blit(title_text, (20, y_offset))
        y_offset += 50
        
        # Tools section
        tools_text = self.font_small.render("Drawing Tools", True, DARK_GRAY)
        self.screen.blit(tools_text, (20, y_offset))
        y_offset += 30
        
        # Tool buttons (3 columns)
        tools = [
            (Tool.BRUSH, "🖌️"), (Tool.PEN, "✏️"), (Tool.MARKER, "🖍️"),
            (Tool.ERASER, "🧽"), (Tool.LINE, "📏"), (Tool.RECTANGLE, "⬜"),
            (Tool.CIRCLE, "⭕"), (Tool.TRIANGLE, "🔺"), (Tool.STAR, "⭐"),
            (Tool.HEART, "❤️")
        ]
        
        for i, (tool, icon) in enumerate(tools):
            row = i // 3
            col = i % 3
            x = 20 + col * 100
            y = y_offset + row * 50
            
            button_rect = pygame.Rect(x, y, 90, 40)
            if self.draw_tool_button(self.screen, button_rect, tool, icon):
                self.current_tool = tool
        
        y_offset += len(tools) // 3 * 50 + 50
        
        # Brush size
        size_text = self.font_small.render(f"Brush Size: {self.brush_size}px", True, DARK_GRAY)
        self.screen.blit(size_text, (20, y_offset))
        y_offset += 30
        
        # Size slider (simplified)
        slider_rect = pygame.Rect(20, y_offset, 250, 20)
        pygame.draw.rect(self.screen, LIGHT_GRAY, slider_rect, border_radius=10)
        
        # Slider handle
        handle_x = 20 + int((self.brush_size - 1) / 99 * 250)
        handle_rect = pygame.Rect(handle_x - 10, y_offset - 5, 20, 30)
        pygame.draw.rect(self.screen, BLUE, handle_rect, border_radius=10)
        
        # Handle slider interaction
        mouse_pos = pygame.mouse.get_pos()
        mouse_pressed = pygame.mouse.get_pressed()[0]
        if slider_rect.collidepoint(mouse_pos) and mouse_pressed:
            relative_x = mouse_pos[0] - 20
            self.brush_size = max(1, min(100, int(relative_x / 250 * 99) + 1))
        
        y_offset += 50
        
        # Color palette
        color_text = self.font_small.render("Color Palette", True, DARK_GRAY)
        self.screen.blit(color_text, (20, y_offset))
        y_offset += 30
        
        # Current color display
        current_color_rect = pygame.Rect(20, y_offset, 50, 50)
        pygame.draw.rect(self.screen, self.current_color, current_color_rect)
        pygame.draw.rect(self.screen, BLACK, current_color_rect, 2)
        
        # Color palette grid
        for i, color in enumerate(COLOR_PALETTE):
            row = i // 8
            col = i % 8
            x = 20 + col * 35
            y = y_offset + 60 + row * 35
            
            color_rect = pygame.Rect(x, y, 30, 30)
            pygame.draw.rect(self.screen, color, color_rect)
            pygame.draw.rect(self.screen, BLACK, color_rect, 1)
            
            # Check if color clicked
            mouse_pos = pygame.mouse.get_pos()
            mouse_clicked = pygame.mouse.get_pressed()[0]
            if color_rect.collidepoint(mouse_pos) and mouse_clicked:
                self.current_color = color
        
        y_offset += 200
        
        # Action buttons
        button_width = 100
        button_height = 40
        button_spacing = 10
        
        # Undo button
        undo_rect = pygame.Rect(20, y_offset, button_width, button_height)
        if self.draw_button(self.screen, undo_rect, "Undo", GRAY if self.history_index <= 0 else GREEN):
            if self.history_index > 0:
                self.undo()
        
        # Redo button
        redo_rect = pygame.Rect(20 + button_width + button_spacing, y_offset, button_width, button_height)
        if self.draw_button(self.screen, redo_rect, "Redo", GRAY if self.history_index >= len(self.history) - 1 else GREEN):
            if self.history_index < len(self.history) - 1:
                self.redo()
        
        y_offset += button_height + button_spacing
        
        # Clear button
        clear_rect = pygame.Rect(20, y_offset, button_width, button_height)
        if self.draw_button(self.screen, clear_rect, "Clear", RED):
            self.clear_canvas()
        
        # Save button
        save_rect = pygame.Rect(20 + button_width + button_spacing, y_offset, button_width, button_height)
        if self.draw_button(self.screen, save_rect, "Save", BLUE):
            self.save_canvas()
        
        y_offset += button_height + button_spacing
        
        # Back button
        back_rect = pygame.Rect(20, y_offset, button_width * 2 + button_spacing, button_height)
        if self.draw_button(self.screen, back_rect, "← Back to Home", PURPLE):
            self.show_landing = True
    
    def save_canvas(self):
        """Save the canvas as a PNG file"""
        try:
            # Create saves directory if it doesn't exist
            if not os.path.exists("saves"):
                os.makedirs("saves")
            
            # Generate filename with timestamp
            import datetime
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"saves/mini_paint_masterpiece_{timestamp}.png"
            
            pygame.image.save(self.canvas, filename)
            print(f"Canvas saved as {filename}")
        except Exception as e:
            print(f"Error saving canvas: {e}")
    
    def draw_main_app(self):
        """Draw the main application interface"""
        # Background
        self.screen.fill((250, 250, 255))
        
        # Draw toolbar
        self.draw_toolbar()
        
        # Canvas area background
        canvas_bg_rect = pygame.Rect(TOOLBAR_WIDTH + 10, HEADER_HEIGHT + 10, 
                                   CANVAS_WIDTH + 20, CANVAS_HEIGHT + 20)
        pygame.draw.rect(self.screen, WHITE, canvas_bg_rect, border_radius=10)
        pygame.draw.rect(self.screen, GRAY, canvas_bg_rect, 3, border_radius=10)
        
        # Draw canvas
        canvas_rect = pygame.Rect(TOOLBAR_WIDTH + 20, HEADER_HEIGHT + 20, 
                                CANVAS_WIDTH, CANVAS_HEIGHT)
        self.screen.blit(self.canvas, canvas_rect)
        
        # Draw preview if showing
        if self.show_preview:
            self.screen.blit(self.preview_surface, canvas_rect)
        
        # Canvas border
        pygame.draw.rect(self.screen, DARK_GRAY, canvas_rect, 2)
        
        # Status bar
        status_y = HEADER_HEIGHT + CANVAS_HEIGHT + 40
        status_text = f"Tool: {self.current_tool.value.title()} | Size: {self.brush_size}px | History: {self.history_index + 1}/{len(self.history)}"
        status_surface = self.font_small.render(status_text, True, DARK_GRAY)
        self.screen.blit(status_surface, (TOOLBAR_WIDTH + 20, status_y))
    
    def handle_events(self):
        """Handle pygame events"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_z and pygame.key.get_pressed()[pygame.K_LCTRL]:
                    self.undo()
                elif event.key == pygame.K_y and pygame.key.get_pressed()[pygame.K_LCTRL]:
                    self.redo()
                elif event.key == pygame.K_s and pygame.key.get_pressed()[pygame.K_LCTRL]:
                    self.save_canvas()
                elif event.key == pygame.K_ESCAPE:
                    self.show_landing = True
        
        return True
    
    def run(self):
        """Main game loop"""
        running = True
        
        while running:
            running = self.handle_events()
            
            # Handle mouse input for drawing
            if not self.show_landing:
                mouse_pos = pygame.mouse.get_pos()
                mouse_pressed = pygame.mouse.get_pressed()[0]
                self.handle_drawing(mouse_pos, mouse_pressed)
            
            # Draw appropriate screen
            if self.show_landing:
                self.draw_landing_page()
            else:
                self.draw_main_app()
            
            pygame.display.flip()
            self.clock.tick(60)
        
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    app = MiniPaint()
    app.run()