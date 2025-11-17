#!/bin/bash
# Automated testing script for Rentex LED Wall Calculator refactoring
# Checks for common issues and verifies file integrity

set -e

echo "========================================"
echo "Rentex LED Wall Calculator - Test Suite"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

# Test function
test_case() {
    local description="$1"
    local test_command="$2"

    echo -n "Testing: $description... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Warning function
warning() {
    local message="$1"
    echo -e "${YELLOW}WARNING: $message${NC}"
    ((WARNINGS++))
}

echo "=== File Structure Tests ==="
echo ""

test_case "index.html exists" "[ -f index.html ]"
test_case "index.html.backup exists" "[ -f index.html.backup ]"
test_case "css/main.css exists" "[ -f css/main.css ]"
test_case "js/constants.js exists" "[ -f js/constants.js ]"
test_case "js/utils.js exists" "[ -f js/utils.js ]"
test_case "js/state.js exists" "[ -f js/state.js ]"
test_case "js/app.js exists" "[ -f js/app.js ]"
test_case "static/images/block.png exists" "[ -f static/images/block.png ]"
test_case "static/images/rentexLogo.png exists" "[ -f static/images/rentexLogo.png ]"

echo ""
echo "=== HTML Validation Tests ==="
echo ""

test_case "HTML has DOCTYPE" "grep -q '<!DOCTYPE html>' index.html"
test_case "HTML has lang attribute" "grep -q '<html lang=' index.html"
test_case "HTML has charset UTF-8" "grep -q 'charset=\"UTF-8\"' index.html"
test_case "HTML has viewport meta" "grep -q 'viewport' index.html"
test_case "HTML closes properly" "grep -q '</html>' index.html"

echo ""
echo "=== CSS Integration Tests ==="
echo ""

test_case "HTML links to main.css" "grep -q 'href=\"css/main.css\"' index.html"
test_case "main.css has content" "[ -s css/main.css ]"
test_case "main.css has body styles" "grep -q 'body {' css/main.css"
test_case "main.css has table styles" "grep -q '#equipmentTable' css/main.css"

echo ""
echo "=== JavaScript Integration Tests ==="
echo ""

test_case "HTML loads constants.js" "grep -q 'src=\"js/constants.js\"' index.html"
test_case "HTML loads utils.js" "grep -q 'src=\"js/utils.js\"' index.html"
test_case "HTML loads state.js" "grep -q 'src=\"js/state.js\"' index.html"
test_case "HTML loads app.js" "grep -q 'src=\"js/app.js\"' index.html"

echo ""
echo "=== JavaScript Syntax Tests ==="
echo ""

test_case "constants.js syntax valid" "node -c js/constants.js"
test_case "utils.js syntax valid" "node -c js/utils.js"
test_case "state.js syntax valid" "node -c js/state.js"
test_case "app.js syntax valid" "node -c js/app.js"

echo ""
echo "=== Constants Definition Tests ==="
echo ""

test_case "CONSTANTS object defined" "grep -q 'const CONSTANTS =' js/constants.js"
test_case "POWER constants defined" "grep -q 'POWER:' js/constants.js"
test_case "EQUIPMENT constants defined" "grep -q 'EQUIPMENT =' js/constants.js"
test_case "SANDBAG_TABLES defined" "grep -q 'SANDBAG_TABLES =' js/constants.js"

echo ""
echo "=== Utility Functions Tests ==="
echo ""

test_case "debounce function defined" "grep -q 'function debounce' js/utils.js"
test_case "showError function defined" "grep -q 'function showError' js/utils.js"
test_case "validateNumber function defined" "grep -q 'function validateNumber' js/utils.js"
test_case "formatNumber function defined" "grep -q 'function formatNumber' js/utils.js"

echo ""
echo "=== State Management Tests ==="
echo ""

test_case "AppState object defined" "grep -q 'const AppState =' js/state.js"
test_case "AppState.init defined" "grep -q 'init()' js/state.js"
test_case "AppState.getFormData defined" "grep -q 'getFormData()' js/state.js"

echo ""
echo "=== Duplicate Code Tests ==="
echo ""

# Count occurrences of potential duplicates
UPDATE_TABLE_COUNT=$(grep -c 'function updateTableRowColor' index.html || echo "0")
IBOLT_WARNING_COUNT=$(grep -c 'function displayIBoltWarning' index.html || echo "0")
SCREEN_CONTAINER_COUNT=$(grep -c 'id="numberOfScreensContainer"' index.html || echo "0")

if [ "$UPDATE_TABLE_COUNT" -le 1 ]; then
    echo -e "Testing: No duplicate updateTableRowColor... ${GREEN}PASS${NC}"
    ((PASSED++))
else
    echo -e "Testing: No duplicate updateTableRowColor... ${RED}FAIL${NC} (found $UPDATE_TABLE_COUNT)"
    ((FAILED++))
fi

if [ "$IBOLT_WARNING_COUNT" -le 1 ]; then
    echo -e "Testing: No duplicate displayIBoltWarning... ${GREEN}PASS${NC}"
    ((PASSED++))
else
    echo -e "Testing: No duplicate displayIBoltWarning... ${RED}FAIL${NC} (found $IBOLT_WARNING_COUNT)"
    ((FAILED++))
fi

if [ "$SCREEN_CONTAINER_COUNT" -le 1 ]; then
    echo -e "Testing: No duplicate numberOfScreensContainer... ${GREEN}PASS${NC}"
    ((PASSED++))
else
    echo -e "Testing: No duplicate numberOfScreensContainer... ${RED}FAIL${NC} (found $SCREEN_CONTAINER_COUNT)"
    ((FAILED++))
fi

echo ""
echo "=== External Dependencies Tests ==="
echo ""

test_case "jQuery loaded" "grep -q 'jquery.min.js' index.html"
test_case "jQuery UI loaded" "grep -q 'jquery-ui.min.js' index.html"
test_case "Font Awesome loaded" "grep -q 'font-awesome' index.html"
test_case "html2canvas loaded" "grep -q 'html2canvas' index.html"
test_case "XLSX library loaded" "grep -q 'xlsx' index.html"

echo ""
echo "=== Critical Functions Test ==="
echo ""

test_case "generateWall function exists" "grep -q 'function generateWall' index.html"
test_case "displayEquipment function exists" "grep -q 'function displayEquipment' index.html"
test_case "exportToExcel function exists" "grep -q 'function exportToExcel' index.html"
test_case "captureEntireScreen function exists" "grep -q 'function captureEntireScreen' index.html"

echo ""
echo "=== File Size Checks ==="
echo ""

# Check that files aren't empty or suspiciously small
HTML_SIZE=$(stat -f%z index.html 2>/dev/null || stat -c%s index.html 2>/dev/null)
CSS_SIZE=$(stat -f%z css/main.css 2>/dev/null || stat -c%s css/main.css 2>/dev/null)

if [ "$HTML_SIZE" -gt 100000 ]; then
    echo -e "Testing: index.html has reasonable size... ${GREEN}PASS${NC} (${HTML_SIZE} bytes)"
    ((PASSED++))
else
    echo -e "Testing: index.html has reasonable size... ${RED}FAIL${NC} (${HTML_SIZE} bytes - too small)"
    ((FAILED++))
fi

if [ "$CSS_SIZE" -gt 5000 ]; then
    echo -e "Testing: main.css has reasonable size... ${GREEN}PASS${NC} (${CSS_SIZE} bytes)"
    ((PASSED++))
else
    echo -e "Testing: main.css has reasonable size... ${YELLOW}WARNING${NC} (${CSS_SIZE} bytes - seems small)"
    warning "CSS file might be incomplete"
fi

echo ""
echo "=== Backup Verification ==="
echo ""

if [ -f index.html.backup ]; then
    BACKUP_SIZE=$(stat -f%z index.html.backup 2>/dev/null || stat -c%s index.html.backup 2>/dev/null)
    echo -e "Testing: Backup file exists and has content... ${GREEN}PASS${NC} (${BACKUP_SIZE} bytes)"
    ((PASSED++))
else
    echo -e "Testing: Backup file exists... ${RED}FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"
echo ""
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Open index.html in a web browser"
    echo "2. Follow the manual tests in TESTING_GUIDE.md"
    echo "3. Check browser console for any errors"
    exit 0
else
    echo -e "${RED}✗ Some tests failed!${NC}"
    echo ""
    echo "Please review the failures above and fix before proceeding."
    exit 1
fi
