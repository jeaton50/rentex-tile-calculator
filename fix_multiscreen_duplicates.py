#!/usr/bin/env python3
"""
Remove duplicate multi-screen function assignments from index.html
These functions are properly exported from multiscreen.js
"""

import re
from pathlib import Path

def fix_index_html():
    """Remove duplicate multi-screen assignments"""
    index_path = Path('/home/user/rentex-tile-calculator/index.html')

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the global variable initialization section that duplicates multiscreen.js
    # This is the section from "// Global variables" through the switchToScreen function

    # Pattern to match the entire duplicate multi-screen section
    pattern = r'// Global variables\s+window\.screenConfigurations = \[new ScreenConfig\(1\)\];[\s\S]*?window\.switchToScreen = function\(index\) \{[\s\S]*?\};'

    matches = list(re.finditer(pattern, content))

    if matches:
        print(f"Found {len(matches)} multi-screen duplicate sections")
        for match in matches:
            start = match.start()
            end = match.end()
            lines_before = content[:start].count('\n')
            lines_after = content[:end].count('\n')
            print(f"  Removing lines {lines_before+1} to {lines_after+1}")

        # Remove the matched section
        content = re.sub(pattern, '  // Multi-screen functions are exported from multiscreen.js module\n', content)
        print("✓ Removed duplicate multi-screen function assignments")
    else:
        print("✗ Could not find duplicate multi-screen section")

    # Write back
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("\n✅ Multiscreen duplicates removed!")

if __name__ == '__main__':
    fix_index_html()
