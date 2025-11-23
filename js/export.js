/**
 * Rentex LED Wall Calculator - Export Module
 * Handles Excel export, screenshot capture, and email functionality
 */

/**
 * ExportManager namespace for all export functions
 */
const ExportManager = {

  /**
   * Get equipment list for a specific screen configuration
   * Used in multi-screen mode to gather equipment for each screen
   * @param {Object} config - Screen configuration object
   * @returns {Array} Array of equipment items with ecode, name, and quantity
   */
  getEquipmentForScreen(config) {
    if (!config) return [];

    // Calculate totals for this screen
    const totalBlocks = config.blocksHor * config.blocksVer;
    const sparePercentage = config.productType === 'theatrixx' ? 10 : 8;
    const spareFactor = config.productType === 'theatrixx' ? 2 : 1.5;

    let totalSpares;
    if (typeof Calculator !== 'undefined' && Calculator.calculateSpares) {
      totalSpares = Calculator.calculateSpares(totalBlocks, sparePercentage, spareFactor);
    } else if (typeof calcSpares === 'function') {
      totalSpares = calcSpares(totalBlocks, sparePercentage, spareFactor);
    } else {
      // Fallback calculation
      const sparesPercent = Math.ceil(totalBlocks * (sparePercentage / 100));
      totalSpares = sparesPercent;
    }

    const totalBlocksWithSpares = totalSpares + totalBlocks;

    // Build request data for equipment calculation
    const requestData = {
      productType: config.productType,
      blocksHor: config.blocksHor,
      blocksVer: config.blocksVer,
      totalBlocks,
      totalSpares,
      totalBlocksWithSpares,
      groundSupport: (config.supportType === 'groundSupport'),
      groundSupportType: (config.supportType === 'groundSupport') ? config.supportOption : null,
      flownSupport: (config.supportType === 'flownSupport'),
      flownSupportType: (config.supportType === 'flownSupport') ? config.supportOption : null,
      voltage: (config.powerDistroType == '110') ? 110 : 208,
      wallType: config.wallType,
      powerDistro: config.powerDistroType
    };

    // Use equipment collector to gather items
    window.equipmentCollector = [];
    window.isCollectingEquipment = true;

    try {
      // Call displayEquipment to populate collector
      if (typeof displayEquipment === 'function') {
        displayEquipment(requestData);
      }
    } catch (error) {
      console.error('Error collecting equipment:', error);
      window.isCollectingEquipment = false;
      return [];
    }

    // Stop collecting
    window.isCollectingEquipment = false;

    // Process equipment to ensure numeric quantities
    const processedEquipment = window.equipmentCollector.map(item => {
      return {
        ...item,
        quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity)
      };
    }).filter(item => item.quantity > 0 && !isNaN(item.quantity));

    return processedEquipment;
  },

  /**
   * Export equipment table to Excel file
   * Handles both single-screen and multi-screen modes
   * Creates XLSX file with equipment list and combined totals
   */
  exportToExcel() {
    const table = document.getElementById('equipmentTable');
    if (!table) return;

    const wb = XLSX.utils.book_new();

    // Define headers
    const headers = ['Main', 'Product', 'Equipment', 'QtyOrdered', 'Description', 'SortOrder'];
    const data = [];
    data.push(headers);

    // Initialize sort order counter
    let sortOrder = 1;

    // Create order map for consistent equipment ordering
    const equipmentOrderMap = {};
    let orderIndex = 0;

    // Check if in multiple screen mode
    const multipleScreens = window.multiScreenInitialized &&
                            document.getElementById('multipleScreenManagementCheckbox')?.checked &&
                            window.screenConfigurations &&
                            window.screenConfigurations.length > 1;

    // Build order map from first screen
    if (multipleScreens && window.screenConfigurations.length > 0) {
      const firstScreenEquipment = this.getEquipmentForScreen(window.screenConfigurations[0]);
      firstScreenEquipment.forEach(item => {
        const key = `${item.ecode}|${item.name}`;
        if (!(key in equipmentOrderMap)) {
          equipmentOrderMap[key] = orderIndex++;
        }
      });
    }

    if (multipleScreens) {
      try {
        // Export equipment for each screen separately
        window.screenConfigurations.forEach((config, index) => {
          // Add header row for this screen
          data.push(['', '', '', '', `===== EQUIPMENT FOR SCREEN ${index + 1} =====`, sortOrder++]);

          // Get equipment for this screen
          const screenEquipment = this.getEquipmentForScreen(config);

          // Add each equipment item
          screenEquipment.forEach(item => {
            if (item.quantity > 0) {
              const ecodes = item.ecode || '';
              const equipmentName = item.name || '';
              const qtyOrdered = typeof item.quantity === 'number' ?
                                 item.quantity.toString() :
                                 Number(item.quantity).toString();

              data.push([ecodes, ecodes, ecodes, qtyOrdered, equipmentName, sortOrder++]);
            }
          });

          // Add spacing between screens
          if (index < window.screenConfigurations.length - 1) {
            data.push(['', '', '', '', '', sortOrder++]);
          }
        });

        // Add combined equipment totals section
        data.push(['', '', '', '', '', sortOrder++]); // Empty row
        data.push(['', '', '', '', '===== COMBINED EQUIPMENT TOTALS =====', sortOrder++]);

        // Create map to combine quantities
        const combinedEquipment = {};

        // Loop through all screens and combine equipment
        window.screenConfigurations.forEach(config => {
          const screenEquipment = this.getEquipmentForScreen(config);
          screenEquipment.forEach(item => {
            const qty = Number(item.quantity);
            if (qty > 0) {
              const key = `${item.ecode.trim()}|${item.name.trim()}`;
              if (!combinedEquipment[key]) {
                combinedEquipment[key] = {
                  ecode: item.ecode,
                  name: item.name,
                  quantity: 0,
                  order: key in equipmentOrderMap ? equipmentOrderMap[key] : 999999
                };
              }
              combinedEquipment[key].quantity = Number(combinedEquipment[key].quantity) + qty;
            }
          });
        });

        // Validate quantities are numbers
        Object.values(combinedEquipment).forEach(item => {
          if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
            console.warn(`Found non-numeric quantity for ${item.name}: ${item.quantity}`);
            item.quantity = 0;
          }
        });

        // Sort combined equipment by original order
        const consolidatedEquipment = Object.values(combinedEquipment);
        consolidatedEquipment.sort((a, b) => a.order - b.order);

        // Add combined equipment to data
        consolidatedEquipment.forEach(item => {
          const ecodes = item.ecode || '';
          const equipmentName = item.name || '';
          const qtyOrdered = typeof item.quantity === 'number' ?
                             item.quantity.toString() :
                             Number(item.quantity).toString();

          // Skip invalid quantities
          if (item.quantity <= 0 || isNaN(item.quantity)) {
            console.warn(`Skipping item with invalid quantity: ${equipmentName}, quantity: ${item.quantity}`);
            return;
          }

          data.push([ecodes, ecodes, ecodes, qtyOrdered, equipmentName, sortOrder++]);
        });

      } catch (error) {
        console.error('Error in multiple screen export:', error);
        alert('There was an error exporting multiple screen equipment. Falling back to single screen export.');

        // Fallback to single screen export
        this.exportSingleScreen(table, data, sortOrder);
      }
    } else {
      // Single screen mode - export current table
      this.exportSingleScreen(table, data, sortOrder);
    }

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Equipment');

    // Adjust column widths
    const range = XLSX.utils.decode_range(ws['!ref']);
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = ws[cellRef];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        }
      }
      colWidths.push({ wch: maxLength + 2 });
    }
    ws['!cols'] = colWidths;

    // Save file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    XLSX.writeFile(wb, `Equipment_Requirements_${timestamp}.xlsx`);

    // Open order system
    window.open('https://rentextest.east.rtprosl.com/order-header?toolMode=add&detailMode=full-screen', '_blank');
  },

  /**
   * Export single screen table to data array
   * Helper function for exportToExcel
   * @param {HTMLTableElement} table - Equipment table element
   * @param {Array} data - Data array to populate
   * @param {number} sortOrder - Starting sort order number
   */
  exportSingleScreen(table, data, sortOrder) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const ecodes = cells[0] ? cells[0].textContent.trim() : '';
      const equipmentName = cells[1] ? cells[1].textContent.trim() : '';
      const qtyOrdered = cells[2] ? cells[2].textContent.trim() : '';

      // Skip total weight rows
      if (equipmentName.toLowerCase().includes('total weight')) {
        return;
      }

      data.push([ecodes, ecodes, ecodes, qtyOrdered, equipmentName, sortOrder++]);
    });
  },

  /**
   * Capture screenshot of entire page and prepare for email
   * Uses html2canvas to capture page, copies to clipboard (or downloads on iOS),
   * and opens email client with pre-filled LED quote information
   */
  async captureEntireScreen() {
    /**
     * Detect iOS devices (iPhone/iPod only)
     * @returns {boolean} True if iOS device
     */
    function isIOS() {
      return /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * Fallback download function for devices that don't support clipboard
     * @param {Blob} blob - Image blob to download
     */
    function fallbackDownload(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screenshot.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Scroll to top for consistent capture
    window.scrollTo(0, 0);

    // Create a temporary container with only the elements we want to capture
    const captureContainer = document.createElement('div');
    captureContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 2400px;
      background: #ffffff;
      padding: 30px;
      font-family: Arial, Helvetica, sans-serif;
      box-sizing: border-box;
      z-index: 999999;
      overflow: visible;
    `;

    // Create custom header with logo and order info
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-bottom: 2px solid #dc2626;
      text-align: center;
    `;

    // Add logo at top center
    const header = document.querySelector('header');
    if (header) {
      const logo = header.querySelector('img');
      if (logo) {
        const logoClone = logo.cloneNode(true);
        logoClone.style.cssText = `
          display: inline-block;
          margin: 0 auto 20px auto;
          max-height: 80px;
          height: auto;
          width: auto;
        `;
        headerContainer.appendChild(logoClone);
      }
    }

    // Add order information as formatted text
    const orderNumber = document.getElementById('orderNumber')?.value || 'N/A';
    const orderDate = document.getElementById('orderDate')?.value || 'N/A';
    const location = document.getElementById('location')?.value || 'N/A';

    const orderInfo = document.createElement('div');
    orderInfo.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 40px;
      font-size: 16px;
      font-family: Arial, Helvetica, sans-serif;
      color: #2d3748;
    `;

    orderInfo.innerHTML = `
      <div><strong>Order #:</strong> ${orderNumber}</div>
      <div><strong>Date:</strong> ${orderDate}</div>
      <div><strong>Location:</strong> ${location}</div>
    `;

    headerContainer.appendChild(orderInfo);
    captureContainer.appendChild(headerContainer);

    // Create side-by-side layout container
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = `
      display: flex;
      gap: 40px;
      align-items: flex-start;
      justify-content: flex-start;
    `;

    // Clone Equipment Requirements (#controls)
    const controls = document.getElementById('controls');
    if (controls) {
      const controlsClone = controls.cloneNode(true);
      controlsClone.style.cssText = `
        position: relative;
        flex: 0 0 auto;
        width: 1000px;
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
        background: white;
        overflow: visible;
      `;

      // Style the heading
      const heading = controlsClone.querySelector('h2');
      if (heading) {
        heading.style.cssText = `
          margin: 0 0 20px 0;
          font-size: 20px;
          color: #2d3748;
          white-space: normal;
          overflow: visible;
          text-align: left;
        `;
      }

      // Force table to render with proper spacing
      const table = controlsClone.querySelector('table');
      if (table) {
        table.style.cssText = `
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 16px;
          font-family: Arial, Helvetica, sans-serif;
        `;

        // Fix header cells
        const ths = controlsClone.querySelectorAll('th');
        ths.forEach((th, index) => {
          th.style.cssText = `
            padding: 12px 10px;
            border: 1px solid #ddd;
            text-align: left;
            background: #dc2626;
            color: white;
            font-weight: bold;
            white-space: nowrap;
            overflow: visible;
          `;
          // Set explicit widths for columns
          if (index === 0) th.style.width = '120px'; // ECODE
          if (index === 1) th.style.width = '400px'; // EQUIPMENT NAME
          if (index === 2) th.style.width = '100px'; // QUANTITY
          if (index === 3) th.style.width = '120px'; // WEIGHT
        });

        // Fix data cells
        const tds = controlsClone.querySelectorAll('td');
        tds.forEach((td, index) => {
          td.style.cssText = `
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
            white-space: normal;
            word-wrap: break-word;
            overflow: visible;
            background: white;
          `;
          const colIndex = index % 4;
          if (colIndex === 0) td.style.width = '120px'; // ECODE
          if (colIndex === 1) td.style.width = '400px'; // EQUIPMENT NAME
          if (colIndex === 2) td.style.width = '100px'; // QUANTITY
          if (colIndex === 3) td.style.width = '120px'; // WEIGHT
        });
      }

      contentWrapper.appendChild(controlsClone);
    }

    // Clone Canvas Container
    const canvasContainer = document.getElementById('canvasContainer');
    if (canvasContainer) {
      const canvasClone = canvasContainer.cloneNode(true);
      canvasClone.style.cssText = `
        position: relative;
        flex: 0 0 auto;
        width: 1200px;
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
        background: white;
        overflow: visible;
      `;

      // Copy canvas content
      const originalCanvas = canvasContainer.querySelector('canvas');
      const clonedCanvas = canvasClone.querySelector('canvas');
      if (originalCanvas && clonedCanvas) {
        clonedCanvas.width = originalCanvas.width;
        clonedCanvas.height = originalCanvas.height;
        const ctx = clonedCanvas.getContext('2d');
        ctx.drawImage(originalCanvas, 0, 0);
      }

      // Fix text elements in canvas container
      const textElements = canvasClone.querySelectorAll('div');
      textElements.forEach(el => {
        el.style.lineHeight = '1.5';
        el.style.marginBottom = '10px';
      });

      contentWrapper.appendChild(canvasClone);
    }

    captureContainer.appendChild(contentWrapper);

    // Append to body temporarily
    document.body.appendChild(captureContainer);

    // Wait for fonts and images to load
    setTimeout(() => {
      // Capture the container using html2canvas with higher quality settings
      html2canvas(captureContainer, {
        scale: 2,
        allowTaint: true,
        useCORS: true,
        logging: true,
        imageTimeout: 0,
        removeContainer: false,
        backgroundColor: '#ffffff',
        width: 2400,
        height: captureContainer.scrollHeight,
        windowWidth: 2400,
        windowHeight: captureContainer.scrollHeight
      })
      .then((canvas) => {
        // Remove temporary container
        document.body.removeChild(captureContainer);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert('Failed to create image blob.');
            return;
          }

          // For iOS: download, for others: copy to clipboard
          if (isIOS()) {
            fallbackDownload(blob);
          } else {
            try {
              const clipboardItem = new ClipboardItem({ [blob.type]: blob });
              await navigator.clipboard.write([clipboardItem]);
              alert('Screenshot Captured, please paste in email');
            } catch (clipboardError) {
              console.error('Clipboard copy error:', clipboardError);
              fallbackDownload(blob);
            }
          }

          // Prepare email with quote information
          const blocksHor = parseInt(document.getElementById('blocksHor')?.value || 0, 10);
          const blocksVer = parseInt(document.getElementById('blocksVer')?.value || 0, 10);
          const totalTiles = blocksHor * blocksVer;
          const orderNumber = document.getElementById('orderNumber')?.value || 'Unknown';
          const location = document.getElementById('location')?.value || 'Not provided';
          const orderDate = document.getElementById('orderDate')?.value || 'Not provided';
          const productTypeSelect = document.getElementById('productType');
          const productTypeName = productTypeSelect ?
                                  productTypeSelect.options[productTypeSelect.selectedIndex].text :
                                  'Unknown';

          const emailSubject = `LED Quote Approval - Order# ${orderNumber}`;
          const emailBody = encodeURIComponent(
            'Dates: ' + orderDate + '\n\n' +
            'Location: ' + location + '\n\n' +
            'LED Walls\n\n' +
            'Make/Model: ' + productTypeName + '\n\n' +
            'Can they use any other make/model: \n\n' +
            '# tiles: ' + totalTiles + '\n\n' +
            'x tiles wide: ' + blocksHor + '\n\n' +
            'y tiles tall: ' + blocksVer
          );

          // Open email client
          window.location.href = `mailto:LEDPanel@rentex.com?subject=${emailSubject}&body=${emailBody}`;
        });
      })
      .catch((error) => {
        // Remove temporary container on error
        if (document.body.contains(captureContainer)) {
          document.body.removeChild(captureContainer);
        }
        console.error('Canvas capture error:', error);
        alert('Screenshot capture failed. Check console for details.');
      });
    }, 500); // Wait 500ms for everything to render
  }
};

// Make functions globally available for backward compatibility
if (typeof window !== 'undefined') {
  window.ExportManager = ExportManager;
  window.exportToExcel = () => ExportManager.exportToExcel();
  window.captureEntireScreen = () => ExportManager.captureEntireScreen();
  window.getEquipmentForScreen = (config) => ExportManager.getEquipmentForScreen(config);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExportManager };
}
