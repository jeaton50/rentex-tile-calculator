# Phase 2 Refactoring Plan - Business Logic Extraction

## Overview
Extract remaining ~5,000 lines of inline JavaScript into modular, maintainable files.

## Goals
1. Extract business logic into separate modules
2. Rename Excel-style variables (B5, I13, etc.) to descriptive names
3. Add JSDoc comments to all functions
4. Reduce inline code by 80%
5. Maintain 100% backward compatibility

---

## Module Breakdown

### 1. js/calculator.js (Priority: HIGH)
**Purpose:** Core calculation logic

**Functions to Extract:**
- `calculateBlocks()` - Convert dimensions to blocks
- `updateDimensionsFromBlocks()` - Convert blocks to dimensions
- `calcSpares()` - Calculate spare tiles
- `calculatePower()` - Power calculations
- `calculateDistribution()` - Power distribution logic

**Variables to Rename:**
- `B5` → `totalTiles`
- `I13` → `totalTiles` (duplicate usage)
- `I15` → `totalSpareTiles`
- `D11` → `horizontalBlocks`
- `G11` → `verticalBlocks`
- `E26` → `voltage`
- `G26` → `powerDistroType`

**Size:** ~800 lines

---

### 2. js/canvas.js (Priority: HIGH)
**Purpose:** Wall visualization and rendering

**Functions to Extract:**
- `drawWall()` - Main canvas drawing
- `drawSupports()` - Draw flown headers
- `drawBases()` - Draw ground bases
- `displayWallDimensions()` - Show wall size
- `zoomIn()`, `zoomOut()`, `resetScreen()` - Zoom controls

**Variables to Rename:**
- `zoomLevel` → already descriptive
- `showNumbers` → already descriptive
- `blockImage` → already descriptive
- `baseBlockPx` → `baseBlockPixels`

**Size:** ~400 lines

---

### 3. js/equipment.js (Priority: HIGH)
**Purpose:** Equipment table generation and management

**Functions to Extract:**
- `displayEquipment()` - Main equipment calculation (HUGE - 800+ lines)
- `addEquipmentRow()` - Add row to table
- `updateTableRowColor()` - Dynamic table styling
- `displayTotalPower()` - Power display
- `displayEstShippingWeight()` - Weight display

**Variables to Rename (Critical - Most Excel-style vars here):**
- `B$6` → `redundancyType`
- `E19` → `supportType`
- `E20` → `wallType`
- `C76` → `selectedDistroType`
- `B3` → `sourceSignalCount`
- `SX40`, `XD10`, `S8` → Keep (product codes)
- `CUBEDIST`, `TP1` → Keep (product codes)

**Size:** ~1200 lines (the big one!)

---

### 4. js/ui.js (Priority: MEDIUM)
**Purpose:** User interface event handlers

**Functions to Extract:**
- `toggleInputType()` - Switch between tile/dimension input
- `handleWallConfigChange()` - Wall config changes
- `handleAspectRatioChange()` - Aspect ratio selection
- `toggleGroundSupportOptions()` - Ground support UI
- `toggleFlownSupportOptions()` - Flown support UI
- `updateWarning()` - Validation warnings
- All `addEventListener` setup

**Size:** ~600 lines

---

### 5. js/export.js (Priority: MEDIUM)
**Purpose:** Export functionality

**Functions to Extract:**
- `exportToExcel()` - Excel generation
- `captureEntireScreen()` - Screenshot/email
- `getEquipmentForScreen()` - Multi-screen export

**Size:** ~400 lines

---

### 6. js/multiscreen.js (Priority: LOW)
**Purpose:** Multiple screen management

**Functions to Extract:**
- `toggleMultiScreenManagement()`
- `addScreen()`, `removeScreen()`, `switchScreen()`
- `updateCombinedEquipment()`
- `showCombineDistroDialog()`
- `showCombineProcessingDialog()`

**Size:** ~600 lines

---

## Variable Renaming Map

### Critical Renames (Most Confusing):

```javascript
// Before (Excel-style) → After (Descriptive)

// Basic dimensions
B5 → totalTiles
I13 → totalTiles (consolidate usage)
I15 → totalSpareTiles
D11 → horizontalBlocks
G11 → verticalBlocks
E26 → voltage
G26 → powerDistroType

// Support types
E19 → supportType ('Ground' or 'Flyware')
E20 → wallType ('Flat', 'Concave', 'Convex')
E25Label → companyLabel

// Processing
B13 → maxDataCascade
B26 → maxPanelsPerS8
B27 → maxPanelsPerSX40
B28 → pixelsHeight
B29 → pixelsWidth

// Power distribution
C76 → selectedDistroType
B$6 → redundancyType
B3 → sourceSignalCount

// Calculations
B4 → sandbagTableIndex
B6 → sandbagsRequired
B3_ → totalBases
O13 → halfHorizontal
O14 → remainingHorizontal
```

---

## Extraction Strategy

### Phase 2A: Canvas Module (Week 2, Days 1-2)
1. Create `js/canvas.js`
2. Extract drawing functions
3. Maintain global scope compatibility
4. Test rendering

### Phase 2B: Equipment Module (Week 2, Days 3-4)
1. Create `js/equipment.js`
2. Extract `displayEquipment()` function
3. Rename variables inside this function
4. Test equipment calculations

### Phase 2C: Calculator Module (Week 2, Days 5)
1. Create `js/calculator.js`
2. Extract calculation functions
3. Rename calculation variables
4. Test calculations

### Phase 2D: UI & Export Modules (Week 2, Days 6-7)
1. Create `js/ui.js` and `js/export.js`
2. Extract remaining functions
3. Final integration
4. Full regression testing

---

## Success Criteria

- ✅ index.html reduced from 5,020 lines to <2,000 lines
- ✅ All business logic in separate modules
- ✅ No Excel-style variables in extracted code
- ✅ All functions have JSDoc comments
- ✅ 100% functionality maintained
- ✅ No console errors
- ✅ All tests pass

---

## Risk Mitigation

1. **Incremental Approach:** Extract one module at a time
2. **Testing:** Test after each extraction
3. **Backups:** Commit after each successful extraction
4. **Compatibility:** Keep functions in global scope initially
5. **Rollback Plan:** Git history allows easy rollback

---

## Estimated Impact

| Metric | Before Phase 2 | After Phase 2 | Improvement |
|--------|----------------|---------------|-------------|
| index.html size | 5,020 lines | ~1,800 lines | 64% reduction |
| Excel-style vars | 50+ | 0 | 100% renamed |
| Undocumented functions | ~95% | 0% | Full documentation |
| Modularity score | 20% | 90% | 70% improvement |
| Maintainability | Low | High | Significant |

---

## Timeline

- **Day 1:** Canvas extraction
- **Day 2:** Equipment extraction (Part 1)
- **Day 3:** Equipment extraction (Part 2)
- **Day 4:** Calculator extraction
- **Day 5:** UI extraction
- **Day 6:** Export & Multi-screen extraction
- **Day 7:** Testing & Documentation

**Total:** 1 week intensive work

---

**Ready to begin!**
