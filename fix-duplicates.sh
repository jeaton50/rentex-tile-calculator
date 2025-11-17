#!/bin/bash
# Script to fix duplicate functions in index.html

INPUT="/home/user/rentex-tile-calculator/index.html.backup"
OUTPUT="/home/user/rentex-tile-calculator/index-cleaned.html"

# Remove lines 352-376 (first duplicate of updateTableRowColor and displayIBoltWarning)
sed -n '1,351p' "$INPUT" > "$OUTPUT"
sed -n '377,801p' "$INPUT" >> "$OUTPUT"
sed -n '860,$p' "$INPUT" >> "$OUTPUT"

echo "Duplicates removed. Output saved to $OUTPUT"
