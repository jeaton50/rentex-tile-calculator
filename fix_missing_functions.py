#!/usr/bin/env python3
"""
Fix missing function errors:
1. Remove duplicate captureEntireScreen functions
2. Add zoom functions (zoomIn, zoomOut, resetScreen)
"""

import re
from pathlib import Path

def fix_index_html():
    """Fix missing functions in index.html"""
    index_path = Path('/home/user/rentex-tile-calculator/index.html')

    with open(index_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find and remove captureEntireScreen function blocks
    new_lines = []
    i = 0
    removed_functions = 0

    while i < len(lines):
        line = lines[i]

        # Check if this line starts a captureEntireScreen function
        if re.match(r'\s*async function captureEntireScreen\(\)', line):
            print(f"Found captureEntireScreen at line {i+1}")
            # Skip lines until we find the closing of this function
            brace_count = 0
            in_function = False
            start_line = i

            while i < len(lines):
                for char in lines[i]:
                    if char == '{':
                        brace_count += 1
                        in_function = True
                    elif char == '}':
                        brace_count -= 1

                if in_function and brace_count == 0:
                    # Found the end of the function
                    print(f"Removed captureEntireScreen (lines {start_line+1}-{i+1})")
                    removed_functions += 1
                    i += 1
                    # Skip any blank lines after the function
                    while i < len(lines) and lines[i].strip() == '':
                        i += 1
                    break
                i += 1
            continue

        # Keep this line
        new_lines.append(line)
        i += 1

    # Add zoom functions after the generateWall function
    # Find a good place to insert - after the last script tag in the body
    insert_index = None
    for i, line in enumerate(new_lines):
        if 'Multi-screen functions are exported from multiscreen.js' in line:
            insert_index = i + 1
            break

    if insert_index:
        zoom_functions = """
    // Zoom functions for canvas
    let currentZoomLevel = 4; // Default zoom level

    function zoomIn() {
      currentZoomLevel = Math.min(currentZoomLevel + 1, 8);
      if (typeof generateWall === 'function') {
        generateWall();
      }
    }

    function zoomOut() {
      currentZoomLevel = Math.max(currentZoomLevel - 1, 1);
      if (typeof generateWall === 'function') {
        generateWall();
      }
    }

    function resetScreen() {
      currentZoomLevel = 4;
      if (typeof generateWall === 'function') {
        generateWall();
      }
    }

"""
        new_lines.insert(insert_index, zoom_functions)
        print("✓ Added zoom functions (zoomIn, zoomOut, resetScreen)")

    # Write back
    with open(index_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

    print(f"\n{'='*60}")
    print(f"Fix completed!")
    print(f"{'='*60}")
    print(f"Functions removed: {removed_functions} captureEntireScreen functions")
    print(f"Functions added: 3 zoom functions")

if __name__ == '__main__':
    fix_index_html()
