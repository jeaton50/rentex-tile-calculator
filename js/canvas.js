/**
 * Rentex LED Wall Calculator - Canvas Rendering Module
 * Handles all wall visualization and canvas drawing operations
 */

/**
 * Canvas configuration and state
 */
const CanvasRenderer = {
  // Image assets
  images: {
    singleHeader: null,
    doubleHeader: null,
    singleBase: null,
    doubleBase: null,
    block: null
  },

  // Configuration
  config: {
    baseBlockPixels: 200,
    screenSpacing: 20,
    headerOffsetMultiplier: 13,
    baseOffsetMultiplier: 11
  },

  /**
   * Initialize canvas renderer and preload images
   */
  init() {
    this.loadImages();
  },

  /**
   * Preload all required images
   */
  loadImages() {
    // Single header image
    this.images.singleHeader = new Image();
    this.images.singleHeader.src = 'static/images/single_header.png';
    this.images.singleHeader.onload = () => console.log('Single header image loaded');
    this.images.singleHeader.onerror = () => console.error('Error loading single header image');

    // Double header image
    this.images.doubleHeader = new Image();
    this.images.doubleHeader.src = 'static/images/double_header.png';
    this.images.doubleHeader.onload = () => console.log('Double header image loaded');
    this.images.doubleHeader.onerror = () => console.error('Error loading double header image');

    // Single base image
    this.images.singleBase = new Image();
    this.images.singleBase.src = 'static/images/single_base.png';
    this.images.singleBase.onload = () => console.log('Single base image loaded');
    this.images.singleBase.onerror = () => console.error('Error loading single base image');

    // Double base image
    this.images.doubleBase = new Image();
    this.images.doubleBase.src = 'static/images/double_base.png';
    this.images.doubleBase.onload = () => console.log('Double base image loaded');
    this.images.doubleBase.onerror = () => console.error('Error loading double base image');
  },

  /**
   * Draw the complete LED wall with all screens
   * @param {Object} wallData - Wall configuration data
   * @param {number} wallData.blocksHor - Horizontal tile count
   * @param {number} wallData.blocksVer - Vertical tile count
   * @param {boolean} wallData.flownSupport - Whether flown support is used
   * @param {boolean} wallData.groundSupport - Whether ground support is used
   * @param {number} zoomLevel - Current zoom level
   * @param {boolean} showNumbers - Whether to show tile numbers
   * @param {HTMLImageElement} blockImage - Tile image to render
   */
  drawWall(wallData, zoomLevel = 4, showNumbers = false, blockImage = null) {
    const canvas = document.getElementById('wallCanvas2D');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    // Use provided blockImage or fall back to loaded image or create fallback
    const tileImage = blockImage || this.images.block;

    const blockSize = (this.config.baseBlockPixels / 4) * zoomLevel;

    // Get number of screens (default to 1)
    const numScreens = parseInt(document.getElementById('numScreens')?.value || "1", 10);

    // Calculate support heights
    const supportHeight = blockSize / 4;
    const extraHeightTop = wallData.flownSupport ? supportHeight * 2 : 0;
    const extraHeightBottom = wallData.groundSupport ? supportHeight * 2 : 0;

    // Calculate canvas dimensions
    const singleScreenWidth = wallData.blocksHor * blockSize;
    canvas.width = (singleScreenWidth * numScreens) + (this.config.screenSpacing * (numScreens - 1));
    canvas.height = wallData.blocksVer * blockSize + extraHeightTop + extraHeightBottom;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each screen
    let tileNumber = 1;
    for (let screenIndex = 0; screenIndex < numScreens; screenIndex++) {
      const xOffset = screenIndex * (singleScreenWidth + this.config.screenSpacing);

      // Create clipping region for this screen
      ctx.save();
      ctx.beginPath();
      ctx.rect(xOffset, 0, singleScreenWidth, canvas.height);
      ctx.clip();

      // Draw tiles
      for (let row = 0; row < wallData.blocksVer; row++) {
        for (let col = 0; col < wallData.blocksHor; col++) {
          const posX = xOffset + col * blockSize;
          const posY = extraHeightTop + row * blockSize;

          // Draw tile image or fallback rectangle
          if (tileImage && tileImage.complete && tileImage.naturalHeight !== 0) {
            ctx.drawImage(tileImage, posX, posY, blockSize, blockSize);
          } else {
            // Fallback: draw colored rectangle
            ctx.fillStyle = '#444';
            ctx.fillRect(posX, posY, blockSize, blockSize);
            ctx.strokeStyle = '#666';
            ctx.strokeRect(posX, posY, blockSize, blockSize);
          }

          // Draw tile number if enabled
          if (showNumbers) {
            ctx.fillStyle = 'black';
            ctx.font = `${Math.max(12, blockSize / 4)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(tileNumber, posX + blockSize / 2, posY + blockSize / 2);
          }

          tileNumber++;
        }
      }

      // Draw support structures
      if (wallData.flownSupport) {
        this.drawFlownSupports(ctx, wallData.blocksHor, blockSize, xOffset, supportHeight, zoomLevel);
      }

      if (wallData.groundSupport) {
        this.drawGroundBases(ctx, wallData.blocksHor, wallData.blocksVer, blockSize, xOffset, supportHeight, zoomLevel);
      }

      // Restore context
      ctx.restore();
    }

    console.log('Wall drawing completed');
  },

  /**
   * Draw flown support headers
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} horizontalBlocks - Number of horizontal blocks
   * @param {number} blockSize - Size of each block in pixels
   * @param {number} xOffset - Horizontal offset for multi-screen
   * @param {number} supportHeight - Height of support structure
   * @param {number} zoomLevel - Current zoom level
   */
  drawFlownSupports(ctx, horizontalBlocks, blockSize, xOffset, supportHeight, zoomLevel) {
    const headerOffset = this.config.headerOffsetMultiplier * zoomLevel;
    const flownSupportType = document.getElementById('flownSupportType')?.value || 'Single Header';

    for (let i = 0; i <= horizontalBlocks; i++) {
      let posX, posY, headerImage, imageWidth;

      if (flownSupportType === 'Double Header') {
        // Double headers: every other position
        if (i % 2 !== 0) continue;
        posX = i * blockSize;
        posY = headerOffset;
        imageWidth = 2 * blockSize;
        headerImage = this.images.doubleHeader;
      } else {
        // Single headers: every position
        posX = i * blockSize;
        posY = headerOffset;
        imageWidth = blockSize;
        headerImage = this.images.singleHeader;
      }

      // Add screen offset
      posX += xOffset;
      const imageHeight = supportHeight;

      // Draw header image or fallback rectangle
      if (headerImage && headerImage.complete && headerImage.naturalHeight !== 0) {
        ctx.drawImage(headerImage, posX, posY, imageWidth, imageHeight);
      } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(posX, posY, imageWidth, imageHeight);
      }
    }
  },

  /**
   * Draw ground support bases
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} horizontalBlocks - Number of horizontal blocks
   * @param {number} verticalBlocks - Number of vertical blocks
   * @param {number} blockSize - Size of each block in pixels
   * @param {number} xOffset - Horizontal offset for multi-screen
   * @param {number} supportHeight - Height of support structure
   * @param {number} zoomLevel - Current zoom level
   */
  drawGroundBases(ctx, horizontalBlocks, verticalBlocks, blockSize, xOffset, supportHeight, zoomLevel) {
    const baseOffset = this.config.baseOffsetMultiplier * zoomLevel;
    const groundSupportType = document.getElementById('groundSupportType')?.value || 'Single Base';

    for (let i = 0; i <= horizontalBlocks; i++) {
      let posX, posY, baseImage, imageWidth;

      if (groundSupportType === 'Double Base') {
        // Double bases: every other position
        if (i % 2 !== 0) continue;
        posX = i * blockSize;
        posY = (verticalBlocks * blockSize) - supportHeight + baseOffset;
        imageWidth = 2 * blockSize;
        baseImage = this.images.doubleBase;
      } else {
        // Single bases: every position
        posX = i * blockSize;
        posY = (verticalBlocks * blockSize) - supportHeight + baseOffset;
        imageWidth = blockSize;
        baseImage = this.images.singleBase;
      }

      // Add screen offset
      posX += xOffset;
      const imageHeight = supportHeight;

      // Draw base image or fallback rectangle
      if (baseImage && baseImage.complete && baseImage.naturalHeight !== 0) {
        ctx.drawImage(baseImage, posX, posY, imageWidth, imageHeight);
      } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(posX, posY, imageWidth, imageHeight);
      }
    }
  },

  /**
   * Display wall dimensions in the UI
   * @param {string} productType - Type of LED product
   */
  displayWallDimensions(productType) {
    const dimensionsDiv = document.getElementById('wallDimensions');
    if (!dimensionsDiv) return;

    // Get configuration values
    const horizontalBlocks = parseInt(document.getElementById('blocksHor')?.value || 1, 10);
    const verticalBlocks = parseInt(document.getElementById('blocksVer')?.value || 1, 10);
    const numScreens = parseInt(document.getElementById('numScreens')?.value || 1, 10);

    // Get product-specific pixel size
    let pixelsPerTile;
    let depth;

    switch (productType) {
      case 'BP2B1':
      case 'BP2B2':
      case 'BP2V2':
        pixelsPerTile = 176;
        depth = '44"';
        break;
      case 'theatrixx':
        pixelsPerTile = 192;
        depth = '47"';
        break;
      case 'absen':
      default:
        pixelsPerTile = 200;
        depth = '35"';
        break;
    }

    // Calculate dimensions
    const totalWidthPixels = (horizontalBlocks * pixelsPerTile * numScreens) + (this.config.screenSpacing * (numScreens - 1));
    const totalHeightPixels = verticalBlocks * pixelsPerTile;
    const totalPixels = (totalWidthPixels * totalHeightPixels).toLocaleString();

    const totalWidthFeet = (horizontalBlocks * 1.64 * numScreens).toFixed(2);
    const totalHeightFeet = (verticalBlocks * 1.64).toFixed(2);

    const totalTiles = horizontalBlocks * verticalBlocks * numScreens;

    // Update display
    dimensionsDiv.innerHTML = `
      <div style="text-align: center;">
        <strong>Wall Dimensions:</strong><br>
        ${totalWidthPixels} px (W) x ${totalHeightPixels} px (H)<br>
        ${totalWidthFeet}' (W) x ${totalHeightFeet}' (H) x ${depth} (D)<br>
        Total Tiles: ${totalTiles}
      </div>
    `;
  }
};

// Backward compatibility - expose functions globally
if (typeof window !== 'undefined') {
  window.CanvasRenderer = CanvasRenderer;

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CanvasRenderer.init());
  } else {
    CanvasRenderer.init();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanvasRenderer;
}
