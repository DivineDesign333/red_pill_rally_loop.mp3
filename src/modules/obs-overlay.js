/**
 * OBS Overlay Integration Module
 * Manages OBS Browser Source overlays and WebSocket communication
 */

export class OBSOverlay {
  constructor(config = {}) {
    this.config = {
      width: config.width || 1920,
      height: config.height || 1080,
      refreshInterval: config.refreshInterval || 100,
      ...config
    };
    this.overlayData = {};
    this.updateCallbacks = [];
  }

  /**
   * Generate OBS Browser Source URL
   */
  getBrowserSourceURL(baseUrl = 'http://localhost:3000') {
    return `${baseUrl}/obs-overlay?width=${this.config.width}&height=${this.config.height}`;
  }

  /**
   * Update overlay data
   */
  updateOverlay(data) {
    this.overlayData = {
      ...this.overlayData,
      ...data,
      timestamp: Date.now()
    };

    this.notifyUpdate();
  }

  /**
   * Set specific overlay element
   */
  setElement(key, value) {
    this.overlayData[key] = value;
    this.notifyUpdate();
  }

  /**
   * Get current overlay data
   */
  getData() {
    return { ...this.overlayData };
  }

  /**
   * Register callback for overlay updates
   */
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all callbacks of update
   */
  notifyUpdate() {
    const data = this.getData();
    this.updateCallbacks.forEach(callback => callback(data));
  }

  /**
   * Create preset overlay configurations
   */
  static getPresets() {
    return {
      minimal: {
        countdown: true,
        ticker: true,
        volume: false,
        chat: false
      },
      full: {
        countdown: true,
        ticker: true,
        volume: true,
        chat: true,
        alerts: true
      },
      streamFocus: {
        countdown: true,
        ticker: true,
        volume: true,
        chat: false,
        alerts: true
      }
    };
  }

  /**
   * Apply preset configuration
   */
  applyPreset(presetName) {
    const presets = OBSOverlay.getPresets();
    const preset = presets[presetName];
    
    if (preset) {
      this.updateOverlay({ preset: presetName, elements: preset });
      return true;
    }
    return false;
  }
}

export default OBSOverlay;
