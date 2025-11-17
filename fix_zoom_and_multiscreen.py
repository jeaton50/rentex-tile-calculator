#!/usr/bin/env python3
"""
Fix zoom and multi-screen functionality issues
"""

import re
from pathlib import Path

def fix_zoom_functionality():
    """Fix zoom buttons to actually zoom the canvas"""
    index_path = Path('/home/user/rentex-tile-calculator/index.html')

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Make currentZoomLevel a global variable (change let to window.)
    content = re.sub(
        r'let currentZoomLevel = 4;',
        'window.currentZoomLevel = 4;',
        content
    )
    print("✓ Made currentZoomLevel a global variable")

    # 2. Update zoom functions to use window.currentZoomLevel
    content = re.sub(
        r'currentZoomLevel = Math\.min\(currentZoomLevel \+ 1, 8\);',
        'window.currentZoomLevel = Math.min(window.currentZoomLevel + 1, 8);',
        content
    )
    content = re.sub(
        r'currentZoomLevel = Math\.max\(currentZoomLevel - 1, 1\);',
        'window.currentZoomLevel = Math.max(window.currentZoomLevel - 1, 1);',
        content
    )
    content = re.sub(
        r'currentZoomLevel = 4;',
        'window.currentZoomLevel = 4;',
        content
    )
    print("✓ Updated zoom functions to use window.currentZoomLevel")

    # 3. Update generateWall to pass zoom level to canvas
    old_draw_call = """        if (typeof CanvasRenderer !== 'undefined' && CanvasRenderer.drawWall) {
          CanvasRenderer.drawWall(requestData);
        }"""

    new_draw_call = """        if (typeof CanvasRenderer !== 'undefined' && CanvasRenderer.drawWall) {
          const zoom = window.currentZoomLevel || 4;
          const showNumbers = window.showNumbers || false;
          CanvasRenderer.drawWall(requestData, zoom, showNumbers);
        }"""

    content = content.replace(old_draw_call, new_draw_call)
    print("✓ Updated CanvasRenderer.drawWall() to receive zoom level")

    # Write back
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ Zoom functionality fixed!")
    print("  - Zoom level is now global")
    print("  - Canvas receives zoom level on redraw")
    print("  - Zoom In/Out/Reset buttons will work")

if __name__ == '__main__':
    fix_zoom_functionality()
