# Testing Guide - Rentex LED Wall Calculator (Refactored)

## Quick Start

1. Open `index.html` in a web browser
2. Open browser Developer Tools (F12)
3. Check the Console tab for any errors
4. Follow the test checklist below

---

## Pre-Flight Checks

### ✅ File Verification

Run these commands to verify all files are in place:

```bash
# Check main files exist
ls -l index.html css/main.css js/*.js

# Verify images are present
ls -l static/images/

# Check for backups
ls -l index.html.backup
```

**Expected:** All files should exist without errors.

---

## Browser Testing Checklist

### 1. Initial Load Test

**Steps:**
1. Open `index.html` in Chrome, Firefox, or Safari
2. Open Developer Tools (F12)
3. Check Console tab

**Expected Results:**
- [ ] Page loads without errors
- [ ] Console shows: "Block image loaded successfully"
- [ ] Console shows: "Application initialized successfully"
- [ ] No red error messages in console
- [ ] All CSS styles are applied
- [ ] Rentex logo appears in header

**Common Issues:**
- If CSS doesn't load: Check that `css/main.css` path is correct
- If JS errors: Check that all `js/*.js` files are loaded

---

### 2. UI Components Test

**Steps:** Verify all UI elements are visible and styled correctly

**Expected Results:**
- [ ] Header with logo displays correctly
- [ ] Order #, Date, and Location fields are visible
- [ ] Configuration Settings panel on left side
- [ ] Canvas container in center/right
- [ ] Equipment Requirements table below
- [ ] All buttons are visible and styled

---

### 3. Product Type Selection Test

**Steps:**
1. Click on "Select Wall Type" dropdown
2. Select each product type one by one:
   - Absen
   - Black Pearl 2 B1
   - Black Pearl 2 B2
   - Black Pearl 2V2
   - Theatrixx

**Expected Results:**
- [ ] Dropdown works smoothly
- [ ] Equipment table updates for each product
- [ ] Table row colors change (light red, blue, green, yellow, purple)
- [ ] Canvas redraws with correct tile image
- [ ] No console errors

**Product-Specific Checks:**
- **Absen:** Table rows have light red background (#ffecec)
- **BP2B1:** Table rows have light blue background (#ecf7ff)
- **BP2B2:** Table rows have light green background (#eaffec)
- **BP2V2:** Table rows have light yellow background (#fdf7e7)
- **Theatrixx:** Table rows have light purple background (#f3eaff)

---

### 4. Wall Configuration Test

**Steps:**
1. Test "Custom" configuration:
   - Select "Custom" radio button
   - Change "Horizontal/Vertical" values
   - Verify canvas updates

2. Test "Popular Formats":
   - Select "Popular Formats" radio button
   - Choose "16:9" aspect ratio
   - Select screen size from dropdown
   - Verify block counts update

**Expected Results:**
- [ ] Custom mode: Inputs are editable
- [ ] Popular Formats: Aspect ratio dropdown appears
- [ ] Screen size dropdown populates correctly
- [ ] Block counts calculate correctly
- [ ] Canvas updates in real-time

---

### 5. Input Mode Test

**Steps:**
1. Select "Input Tiles" radio button
   - Enter horizontal tiles: 10
   - Enter vertical tiles: 5
   - Check dimensions auto-calculate

2. Select "Input Dimensions" radio button
   - Enter width: 16.4 feet
   - Enter height: 8.2 feet
   - Check tiles auto-calculate

**Expected Results:**
- [ ] Switching between modes works
- [ ] Values auto-calculate correctly
- [ ] Canvas updates with new dimensions
- [ ] Equipment table updates

---

### 6. Support Type Test

**Steps:**
1. Test Ground Support:
   - Select "Ground Support" radio button
   - Choose "Single Base" from dropdown
   - Choose "Double Base" from dropdown
   - Verify equipment changes

2. Test Flown Support:
   - Select "Flown Support" radio button
   - Choose "Single Header" from dropdown
   - Choose "Double Header" from dropdown
   - For BP2 products, check for IBolt warning

**Expected Results:**
- [ ] Ground support options appear/disappear correctly
- [ ] Flown support options appear/disappear correctly
- [ ] Equipment table shows correct support equipment
- [ ] IBolt warning appears for BP2 products with flown support
- [ ] Canvas shows headers or bases correctly

---

### 7. Power Distribution Test

**Steps:**
1. Select different power distro types:
   - Auto
   - CUBEDIST
   - TP1
   - 110v
   - Customer (208v)

**Expected Results:**
- [ ] Equipment table updates with correct distro equipment
- [ ] Power calculations display correctly
- [ ] Voltage changes affect equipment list

---

### 8. Canvas Rendering Test

**Steps:**
1. Set to 5x5 tiles
2. Check "Show Tile Numbers" checkbox
3. Uncheck "Show Tile Numbers"
4. Click "Zoom In" button (3 times)
5. Click "Zoom Out" button (3 times)
6. Click "Reset" button

**Expected Results:**
- [ ] Canvas displays tile grid
- [ ] Tile numbers appear/disappear when toggled
- [ ] Zoom in increases tile size
- [ ] Zoom out decreases tile size
- [ ] Reset returns to default zoom
- [ ] No distortion or rendering errors

---

### 9. Equipment Table Test

**Steps:**
1. Configure a wall (e.g., 10x5 Absen with ground support)
2. Scroll through equipment table
3. Verify quantities make sense
4. Check total weight displays

**Expected Results:**
- [ ] Table populates with equipment
- [ ] Equipment codes (Ecode) are correct
- [ ] Quantities are reasonable (no negative numbers)
- [ ] Total weight displays at bottom
- [ ] Table scrolls if content is long

---

### 10. Multiple Screen Management Test

**Steps:**
1. Check "Multiple Screen Management" checkbox
2. Click "Add Screen" button
3. Configure second screen differently
4. Click through screen tabs
5. Check combined equipment totals

**Expected Results:**
- [ ] Multiple screen UI appears
- [ ] Can add screens
- [ ] Each screen has independent configuration
- [ ] Tabs switch between screens
- [ ] Combined equipment calculates correctly

---

### 11. Excel Export Test

**Steps:**
1. Configure a wall
2. Click "Export to SL+" button
3. Check if Excel file downloads
4. Open Excel file

**Expected Results:**
- [ ] Excel file downloads
- [ ] File contains equipment data
- [ ] Columns are properly formatted
- [ ] Data matches screen display
- [ ] SortOrder column exists
- [ ] Opens in Excel/spreadsheet app

**File Format Check:**
- Columns: Main, Product, Equipment, QtyOrdered, Description, SortOrder
- Data is not corrupted
- Numbers are formatted correctly

---

### 12. Email/Screenshot Test

**Steps:**
1. Configure a wall
2. Fill in Order #, Date, and Location
3. Click "Email" button
4. Check if screenshot is captured

**Expected Results:**
- [ ] Screenshot captures entire page
- [ ] Email client opens (or screenshot downloads on iOS)
- [ ] Email contains pre-filled subject and body
- [ ] Screenshot is in clipboard (non-iOS)

---

### 13. Advanced Features Test

**Steps:**
1. Check "Advanced" checkbox
2. Enter tile quantity
3. Click "Generate Screen Sizes"
4. Check for Dummy Tiles option (BP2 products)

**Expected Results:**
- [ ] Advanced options appear
- [ ] Screen size suggestions generate
- [ ] Dummy tiles option shows for BP2 products
- [ ] Calculations are correct

---

### 14. Wall Type Test

**Steps:**
1. Select each wall type:
   - Flat Wall
   - Concave Wall
   - Convex Wall
2. For Absen, check curved wall message
3. For BP2, check that Convex option is hidden

**Expected Results:**
- [ ] Flat wall: Standard configuration
- [ ] Concave: Warning message appears
- [ ] Convex: Warning message appears (if available)
- [ ] BP2 products: Convex option is hidden
- [ ] Support types adjust for curved walls

---

### 15. Redundancy Test

**Steps:**
1. Select "Redundancy" dropdown
2. Choose each option:
   - None
   - Distribution and Cables
   - Fully Redundant

**Expected Results:**
- [ ] Equipment quantities change
- [ ] Processors multiply for redundancy
- [ ] Cables multiply appropriately

---

### 16. Source Signals Test

**Steps:**
1. Change "# of Source Signals" from 1 to 5
2. Verify processor counts increase

**Expected Results:**
- [ ] Processor quantities adjust to source signals
- [ ] Minimum processor count respects source signals

---

## Performance Tests

### Load Time Test
1. Open index.html
2. Check Network tab in Developer Tools
3. Verify all resources load quickly

**Expected:**
- [ ] Page loads in < 2 seconds
- [ ] All CSS/JS files load successfully
- [ ] All images load successfully
- [ ] No 404 errors

### Responsiveness Test
1. Resize browser window to mobile size (375px wide)
2. Check if layout adapts
3. Test all features on mobile size

**Expected:**
- [ ] Layout becomes single column
- [ ] All controls remain accessible
- [ ] Canvas scales appropriately
- [ ] No horizontal scrolling

---

## Console Error Check

Throughout all tests, monitor the browser console for:

**❌ Errors to Watch For:**
- `Uncaught ReferenceError` - Missing variable/function
- `Uncaught TypeError` - Type mismatch
- `Failed to load resource` - Missing file
- `CORS error` - Cross-origin issue

**✅ Expected Messages:**
- "Block image loaded successfully"
- "Application initialized successfully"
- Various log messages (not errors)

---

## Known Issues / Expected Warnings

These are NOT errors (they're informational):

1. **"The debounce function is already defined"**
   - Expected: The inline code has its own debounce
   - Impact: None - both versions work

2. **"Excel library loaded"**
   - Expected: XLSX library initialization
   - Impact: None - normal operation

3. **Console.log messages**
   - Expected: Development logging
   - Impact: None - can be ignored

---

## Regression Test (Quick)

If you're short on time, run this quick 5-minute test:

1. ✅ Open page - no errors in console
2. ✅ Select Absen product
3. ✅ Set 10x5 tiles
4. ✅ Check Ground Support with Single Base
5. ✅ Verify canvas shows 50 tiles
6. ✅ Verify equipment table has items
7. ✅ Click "Export to SL+" - Excel downloads
8. ✅ Click "Email" - screenshot works

---

## Reporting Issues

If you find a bug, document:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Console errors** (copy/paste from console)
5. **Browser and version**
6. **Screenshot** (if visual bug)

---

## Test Results Template

```markdown
## Test Results - [Date]

**Browser:** Chrome 120 / Firefox 121 / Safari 17
**Date:** YYYY-MM-DD
**Tester:** [Your Name]

### Summary
- Total Tests: 16
- Passed: XX
- Failed: XX
- Skipped: XX

### Failures
1. [Test Name]
   - Issue: [Description]
   - Console Error: [Error message]
   - Severity: High/Medium/Low

### Notes
[Any additional observations]
```

---

## Success Criteria

The refactoring is successful if:

✅ **ALL** of these are true:
- Page loads without errors
- All 16 test categories pass
- No breaking changes from original
- Excel export works
- Email/screenshot works
- Calculations are correct
- UI is responsive

---

## Next Steps After Testing

1. **If all tests pass:**
   - Refactoring is successful ✅
   - Ready for Phase 2
   - Can deploy to staging

2. **If some tests fail:**
   - Document failures
   - Roll back if critical
   - Fix issues
   - Re-test

3. **If minor issues found:**
   - Document as known issues
   - Prioritize for Phase 2
   - Proceed with caution

---

**Good luck with testing! 🧪**
