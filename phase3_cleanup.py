#!/usr/bin/env python3
"""
Phase 3 Cleanup Script
Removes duplicate function definitions from index.html that now exist in modules
"""

import re
from pathlib import Path

# Functions that should be KEPT (wrapper functions that call modules)
KEEP_FUNCTIONS = {
    'handleDimensionInput',  # Wrapper that calls Calculator module
    'incrementDimension',    # Wrapper that calls Calculator module
    'handleArrowKeys',       # Helper function
    'updateDimensionsFromBlocks',  # Small wrapper
    'updateWall',            # Small wrapper
    'generateWall',          # Small wrapper
    'debounce',              # Utility function still used
}

# Functions that should be REMOVED (duplicates now in modules)
REMOVE_FUNCTIONS = {
    # Calculator Module duplicates
    'calculateBlocks',
    'calcSpares',
    'display208CircuitsNeeded',
    'display208Circuits',
    'display110Circuits',

    # UI Module duplicates
    'updateWarning',
    'toggleInputType',
    'restrictGroundSupportTypes',
    'restrictFlownSupportTypes',
    'handleWallTypeChange',
    'toggleGroundSupportOptions',
    'toggleFlownSupportOptions',
    'handleWallConfigChange',
    'updateBlocksBasedOnSelection',
    'updateHeightWarning',
    'handleAspectRatioChange',
    'setupVerticalWarning',
    'togglePowerDistroOptions',

    # Canvas Module duplicates
    'drawWall',
    'drawSupports',
    'drawBases',
    'zoomIn',
    'zoomOut',
    'resetScreen',

    # Export Module duplicates
    'exportToExcel',
    'getEquipmentForScreen',
    'isIOS',
    'fallbackDownload',

    # Equipment Module duplicates
    'displayEquipment',
    'addEquipmentRow',
    'displayWallDimensions',
    'displayEstShippingWeight',
    'displayWallWeight',
    'displayTotalPower',
    'updateDummyTileQty',
    'getDummyTileCount',

    # Multi-screen Module duplicates
    'initMultiScreenSystem',
    'toggleMultiScreenManagement',
    'addMultiScreenStyles',
    'createMultiScreenUI',
    'updateScreenSelector',
    'updateScreenTabs',
    'saveCurrentScreenConfig',
    'loadScreenConfig',
    'calculateCombinedDistro',
    'showCombineDistroDialog',
    'closeCombineDistroDialog',
    'applyCombinedDistro',
    'updateCombinedEquipment',
    'addCombineDistroButton',
    'calculateCombinedProcessing',
    'showCombineProcessingDialog',
    'closeCombineProcessingDialog',
    'applyCombinedProcessing',

    # Helper functions now in modules
    'generateScreenSizesFromTileQuantity',
    'selectScreenSize',
    'isPowerDistroEquipment',
    'isProcessingEquipment',
    'isDummyTileEquipment',
    'addEquipmentTogglesToScreen',
    'updateScreenEquipmentVisibility',
    'updatePowerWeightSummary',
    'showLoadingSpinner',
    'hideLoadingSpinner',
}


def find_function_block(lines, start_idx):
    """
    Find the complete function block starting at start_idx
    Returns (end_idx, function_name) or (None, None) if not found
    """
    # Match function declaration
    func_match = re.match(r'\s*function\s+(\w+)\s*\(', lines[start_idx])
    if not func_match:
        return None, None

    func_name = func_match.group(1)
    brace_count = 0
    in_function = False

    for i in range(start_idx, len(lines)):
        line = lines[i]

        # Count braces
        for char in line:
            if char == '{':
                brace_count += 1
                in_function = True
            elif char == '}':
                brace_count -= 1

        # Function block complete when braces balanced
        if in_function and brace_count == 0:
            return i, func_name

    return None, None


def cleanup_index_html():
    """Main cleanup function"""
    index_path = Path('/home/user/rentex-tile-calculator/index.html')

    # Read file
    with open(index_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Track removed functions
    removed_functions = []
    lines_removed = 0

    # Process file line by line
    i = 0
    new_lines = []

    while i < len(lines):
        line = lines[i]

        # Check if this line starts a function
        if re.match(r'\s*function\s+\w+\s*\(', line):
            end_idx, func_name = find_function_block(lines, i)

            if func_name and end_idx:
                # Check if we should remove this function
                if func_name in REMOVE_FUNCTIONS:
                    # Skip this entire function block
                    print(f"Removing function: {func_name} (lines {i+1}-{end_idx+1})")
                    removed_functions.append(func_name)
                    lines_removed += (end_idx - i + 1)

                    # Skip to line after function, also skip any blank lines after
                    i = end_idx + 1
                    while i < len(lines) and lines[i].strip() == '':
                        i += 1
                        lines_removed += 1
                    continue
                elif func_name in KEEP_FUNCTIONS:
                    print(f"Keeping function: {func_name} (wrapper/helper)")

        # Keep this line
        new_lines.append(line)
        i += 1

    # Write cleaned file
    with open(index_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

    # Report
    print(f"\n{'='*60}")
    print(f"Phase 3 Cleanup Complete!")
    print(f"{'='*60}")
    print(f"Functions removed: {len(removed_functions)}")
    print(f"Lines removed: {lines_removed}")
    print(f"Removed functions: {', '.join(sorted(removed_functions))}")

    return len(removed_functions), lines_removed


if __name__ == '__main__':
    cleanup_index_html()
