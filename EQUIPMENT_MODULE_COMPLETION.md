# Equipment Module - Completion Guide

## Current Status: 60% Complete

### ✅ What's Done (484 lines):
- Core calculation functions
- Processor calculations
- Power calculations
- Sandbag calculations
- Cable calculations
- Excel variable renaming (25+ variables)
- Full JSDoc documentation

### ⏳ What Remains (320 lines):

## Product-Specific Equipment Functions

### 1. Absen Equipment Function (~70 lines)

**Function to create:**
```javascript
/**
 * Add Absen-specific equipment to table
 * @param {Object} config - Equipment configuration
 * @param {HTMLElement} tbody - Table body element
 */
function addAbsenEquipment(config, tbody) {
  const {
    totalTiles,
    totalSpareTiles,
    casesNeeded,
    processors,
    cables,
    sandbags,
    // Support structures
    singleBases,
    doubleBases,
    singleHeaders,
    doubleHeaders,
    // Ground support specific
    outriggers,
    ladders,
    clamps,
    supportBeams50mm,
    supportBeams1000mm,
    beamConnectors,
    platforms,
    // Power distribution
    powerDistro
  } = config;

  // Add all equipment rows
  addEquipmentRow('8PPL25', 'Absen PL2.5 8x tile package', 0, casesNeeded, tbody);
  addEquipmentRow('PL25', 'Absen PL2.5 tile', 20.61, totalTiles, tbody);
  addEquipmentRow('PL25', 'Absen PL2.5 ** Spare Tiles **', 20.61, totalSpareTiles, tbody);
  addEquipmentRow('PL25CASE', 'Case, Absen PL2.5, 8x', 161.12, casesNeeded, tbody);

  // Processors
  if (processors.SX40 > 0) {
    addEquipmentRow('SX40', 'Brompton Tessera SX40 **Kit includes an XD10**', 17, processors.SX40, tbody);
  }
  if (processors.XD10 > 0) {
    addEquipmentRow('XD10', 'Brompton Tessera XD 10G data distribution unit', 8.16, processors.XD10, tbody);
  }
  if (processors.S8 > 0) {
    addEquipmentRow('S8', 'Brompton Tessera S8', 17, processors.S8, tbody);
  }

  // Support structures (bases)
  if (singleBases > 0) {
    addEquipmentRow('PL25BB1', 'Absen PL2.5 base bar, 1W, 0.5m', 16, singleBases, tbody);
  }
  if (doubleBases > 0) {
    addEquipmentRow('PL25BB2', 'Absen PL2.5 base bar, 2W, 1m', 37, doubleBases, tbody);
  }

  // Ground support equipment
  if (outriggers > 0) {
    addEquipmentRow('PL25OUT', 'Absen PL2.5 outrigger', 17, outriggers, tbody);
  }
  if (ladders > 0) {
    addEquipmentRow('PL25LAD1M', 'Absen PL2.5 ladder 1m', 9, ladders, tbody);
  }
  if (clamps > 0) {
    addEquipmentRow('PL25CLAMP', 'Absen PL2.5 clamp', 3.2, clamps, tbody);
  }
  if (supportBeams50mm > 0) {
    addEquipmentRow('PL25BEAM50', 'Absen PL2.5 support beam, 500 mm', 4, supportBeams50mm, tbody);
  }
  if (supportBeams1000mm > 0) {
    addEquipmentRow('PL25BEAM1K', 'Absen PL2.5 support beam, 1000 mm', 6, supportBeams1000mm, tbody);
  }
  if (beamConnectors > 0) {
    addEquipmentRow('PL25BEAMAD', 'Absen PL2.5 support beam conn, adjustable', 7, beamConnectors, tbody);
  }
  if (platforms > 0) {
    addEquipmentRow('PL25PLAT', 'Absen PL2.5 platform', 10, platforms, tbody);
  }

  // Sandbags
  if (sandbags > 0) {
    addEquipmentRow('SANDBAG25', 'Sand Bag 25 lbs.', 25, sandbags, tbody);
  }

  // Headers (flown support)
  if (singleHeaders > 0) {
    addEquipmentRow('PL25HEAD1', 'Absen PL2.5 header, 1W, 0.5m', 12, singleHeaders, tbody);
  }
  if (doubleHeaders > 0) {
    addEquipmentRow('PL25HEAD2', 'Absen PL2.5 header, 2W, 1m', 19, doubleHeaders, tbody);
  }

  // Cables (add all cable types)
  // ... cable equipment rows ...

  // Power distribution
  // ... power distro equipment rows ...

  // Calculate and display shipping weight
  let caseWeight = totalWeight;
  caseWeight += 18.92 * totalSpareTiles;
  caseWeight += 161.12 * casesNeeded;
  // ... add other case weights ...

  if (typeof displayEstShippingWeight === 'function') {
    displayEstShippingWeight(caseWeight);
  }
}
```

### 2. ROE Equipment Function (~80 lines)

Similar structure to Absen, but with:
- ROE-specific product codes (BP2B1, BP2B2, BP2V2)
- Dummy tile calculations
- Universal base truss
- Rear truss and bridge clamps
- 5-degree brackets for curved walls
- M10 bolts

**Key differences:**
- Different spare tile percentages
- Dummy tiles for case filling
- ROE-specific support structures
- Different sandbag calculations

### 3. Theatrixx Equipment Function (~90 lines)

Similar structure, but with:
- Novastar MX40 PRO processors (not Brompton)
- Ski frames and stacking extensions
- Ladder frames
- Vertical supports
- Different cable configurations
- XVT power connectors

**Key differences:**
- MX40 PRO instead of Brompton
- Theatrixx-specific support system
- Different power cable types
- Pixel-based processor calculations

### 4. Power Distribution Equipment (~40 lines)

**Function to create:**
```javascript
/**
 * Calculate power distribution equipment
 * @param {Object} config - Configuration
 * @returns {Object} Power distribution equipment
 */
function calculatePowerDistribution(config) {
  const {
    productType,
    totalTiles,
    totalTilesWithSpares,
    voltage,
    selectedDistroType,
    companyLabel
  } = config;

  let CUBEDIST = 0, TP1 = 0, L2130T1FB = 0, SOCA6XTRU1 = 0;

  // Complex power distribution logic
  // Based on voltage, tile count, and selected type

  // Auto-select between CUBEDIST and TP1
  if (selectedDistroType === 'Auto') {
    // Calculate which is needed based on power requirements
    // ...
  } else if (selectedDistroType === 'CUBEDIST') {
    CUBEDIST = /* calculation */;
  } else if (selectedDistroType === 'TP1') {
    TP1 = /* calculation */;
  }

  // Floor boxes and adapters
  if (selectedDistroType === 'CUBEDIST') {
    L2130T1FB = Math.ceil((totalTiles / 16) / 3);
  } else if (selectedDistroType === 'TP1') {
    SOCA6XTRU1 = Math.ceil((totalTiles / 16) / 6);
  }

  return {
    CUBEDIST,
    TP1,
    L2130T1FB,
    SOCA6XTRU1
  };
}
```

### 5. Support Structure Calculations (~40 lines)

**Functions needed:**
```javascript
/**
 * Calculate support structure equipment
 * @param {Object} config - Configuration
 * @returns {Object} Support structure quantities
 */
function calculateSupportStructures(config) {
  const {
    horizontalBlocks,
    verticalBlocks,
    wallType,
    supportType,
    groundSupportType,
    flownSupportType,
    heightWarning
  } = config;

  let singleBases = 0, doubleBases = 0;
  let singleHeaders = 0, doubleHeaders = 0;
  let outriggers = 0, ladders = 0, clamps = 0;
  // ... more structure variables

  // Ground support logic
  if (supportType === 'Ground') {
    if (groundSupportType === 'Double Base' && wallType === 'Flat') {
      doubleBases = Math.floor(horizontalBlocks / 2);
      singleBases = horizontalBlocks % 2;
    } else {
      singleBases = horizontalBlocks;
    }

    // Outriggers, ladders, clamps calculations
    outriggers = Math.ceil(horizontalBlocks / 1.9);
    clamps = Math.floor(verticalBlocks / 2) * outriggers;
    ladders = clamps; // Same quantity
  }

  // Flown support logic
  if (supportType === 'Flyware') {
    if (flownSupportType === 'Double Header' && wallType === 'Flat') {
      doubleHeaders = Math.floor(horizontalBlocks / 2);
      singleHeaders = horizontalBlocks % 2;
    } else {
      singleHeaders = horizontalBlocks;
    }
  }

  return {
    singleBases,
    doubleBases,
    singleHeaders,
    doubleHeaders,
    outriggers,
    ladders,
    clamps,
    // ... more structures
  };
}
```

## Updated displayEquipment Function

```javascript
function displayEquipment(data) {
  try {
    const tbody = document.querySelector('#equipmentTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (typeof totalWeight !== 'undefined') totalWeight = 0;

    // Extract and rename variables
    const config = {
      productType: data.productType,
      totalTiles: data.totalBlocks,
      totalSpareTiles: data.totalSpares,
      totalTilesWithSpares: data.totalBlocksWithSpares,
      horizontalBlocks: data.blocksHor,
      verticalBlocks: data.blocksVer,
      voltage: data.voltage,
      powerDistroType: data.powerDistro,
      supportType: data.groundSupport ? "Ground" : "Flyware",
      wallType: data.wallType,
      groundSupportType: data.groundSupportType,
      flownSupportType: data.flownSupportType,
      heightWarning: document.getElementById('blockVerticalWarning')?.textContent || '',
      sourceSignalCount: parseInt(document.getElementById('sourceSignals')?.value || 1, 10),
      redundancyType: document.getElementById('redundancy')?.value || 'None',
      selectedDistroType: document.getElementById('powerDistroType')?.value || 'Auto'
    };

    // Check for height limit
    if (config.heightWarning === "***EXCEEDS LIMIT, MUST FLY***") {
      if (typeof addEquipmentRow === 'function') {
        addEquipmentRow('', '***EXCEEDS LIMIT, MUST FLY***', 0, 1, tbody);
      }
      return;
    }

    // Calculate all equipment needs
    const processors = EquipmentCalculator.calculateProcessors(config);
    const power = EquipmentCalculator.calculatePower(config.productType, config.totalTiles, config.voltage);
    const cables = EquipmentCalculator.calculateCables(config);
    const supportStructures = calculateSupportStructures(config);
    const powerDistro = calculatePowerDistribution(config);

    const doubles = Math.floor(config.horizontalBlocks / 2);
    const singles = Math.ceil(config.horizontalBlocks - (doubles * 2));
    const sandbags = EquipmentCalculator.calculateSandbags(
      config.productType,
      config.verticalBlocks,
      doubles + singles
    );

    // Display power
    if (typeof displayTotalPower === 'function') {
      displayTotalPower(config.voltage, power.amps, power.watts);
    }

    // Build complete equipment config
    const equipmentConfig = {
      ...config,
      processors,
      cables,
      sandbags,
      powerDistro,
      ...supportStructures,
      casesNeeded: Math.ceil(config.totalTilesWithSpares / 8)
    };

    // Call product-specific function
    switch (config.productType) {
      case 'absen':
        addAbsenEquipment(equipmentConfig, tbody);
        break;

      case 'BP2B1':
      case 'BP2B2':
      case 'BP2V2':
        addROEEquipment(equipmentConfig, tbody);
        break;

      case 'theatrixx':
        addTheatrixxEquipment(equipmentConfig, tbody);
        break;

      default:
        console.warn('Unknown product type:', config.productType);
    }

  } catch (error) {
    console.error('Error in displayEquipment:', error);
    if (typeof showError === 'function') {
      showError('Failed to calculate equipment: ' + error.message);
    }
  }
}
```

## Completion Steps

### Step 1: Add Support Structure Calculator
- Extract structure calculation logic from inline code
- Create `calculateSupportStructures()` function
- ~40 lines

### Step 2: Add Power Distribution Calculator
- Extract power distro logic
- Create `calculatePowerDistribution()` function
- ~40 lines

### Step 3: Add Absen Equipment Function
- Create `addAbsenEquipment()` function
- Move all addEquipmentRow calls for Absen
- ~70 lines

### Step 4: Add ROE Equipment Function
- Create `addROEEquipment()` function
- Handle BP2B1, BP2B2, BP2V2 variants
- Move all addEquipmentRow calls for ROE
- ~80 lines

### Step 5: Add Theatrixx Equipment Function
- Create `addTheatrixxEquipment()` function
- Move all addEquipmentRow calls for Theatrixx
- Handle MX40 PRO processors
- ~90 lines

### Step 6: Update displayEquipment
- Simplify to orchestration function
- Call product-specific functions
- ~50 lines final size (down from 804!)

### Step 7: Test
- Test each product type
- Verify calculations
- Check equipment tables

## Total Addition: ~370 lines

## Final File Size: ~740 lines (vs original 804 inline)

## Benefits:
- 100% modular
- All Excel variables renamed
- Fully documented
- Testable functions
- Product-specific logic isolated
- Easy to maintain/extend

## Next Session Recommendation:

Since this is substantial work (~2-3 hours), you have options:

**Option 1: Complete in next session**
- Continue when you have 2-3 focused hours
- Complete all product functions
- Full testing

**Option 2: Commit current progress**
- Current state is valuable (60% done)
- Core calculations extracted
- Can resume anytime

**Option 3: Simplified approach**
- Just extract one product (Absen) as example
- Leave others inline for now
- ~1 hour of work

**Recommended: Option 2** - Commit what we have. It's already a huge improvement!
