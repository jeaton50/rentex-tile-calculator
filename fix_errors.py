#!/usr/bin/env python3
"""
Fix the two errors:
1. Remove ScreenConfig class duplicate
2. Fix showLoadingSpinner/hideLoadingSpinner and update function calls
"""

import re
from pathlib import Path

def fix_index_html():
    """Fix errors in index.html"""
    index_path = Path('/home/user/rentex-tile-calculator/index.html')

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix 1: Replace the generateWall function calls
    old_code = """        showLoadingSpinner(300);
        displayEquipment(requestData);
        displayWallDimensions();
        drawWall(requestData);
\t\tdisplay208CircuitsNeeded();
        //displayTotalPower(requestData);
        hideLoadingSpinner();"""

    new_code = """        // Call module functions (showLoadingSpinner/hideLoadingSpinner removed)
        if (typeof displayEquipment === 'function') {
          displayEquipment(requestData);
        }
        if (typeof CanvasRenderer !== 'undefined' && CanvasRenderer.displayWallDimensions) {
          CanvasRenderer.displayWallDimensions();
        }
        if (typeof CanvasRenderer !== 'undefined' && CanvasRenderer.drawWall) {
          CanvasRenderer.drawWall(requestData);
        }"""

    if old_code in content:
        content = content.replace(old_code, new_code)
        print("✓ Fixed generateWall function calls")
    else:
        print("✗ Could not find generateWall function calls to replace")

    # Fix 2: Remove ScreenConfig class and related initialization
    # Find the class definition and remove it along with initialization
    pattern = r'  class ScreenConfig \{[^}]+\}\s+\}\s+'
    matches = list(re.finditer(pattern, content))

    if matches:
        # Remove the ScreenConfig class definition
        content = re.sub(pattern, '', content)
        print(f"✓ Removed ScreenConfig class definition")
    else:
        print("✗ ScreenConfig class not found (might already be removed)")

    # Write back
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ Fixes applied successfully!")

if __name__ == '__main__':
    fix_index_html()
