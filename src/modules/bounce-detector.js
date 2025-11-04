/**
 * Bounce Signal Detection Module
 * Detects price bounce signals for meme coin trading
 */

export class BounceDetector {
  constructor(config = {}) {
    this.config = {
      minBouncePercent: config.minBouncePercent || 5,
      timeWindow: config.timeWindow || 300000, // 5 minutes
      volumeThreshold: config.volumeThreshold || 1.5,
      ...config
    };
    this.priceHistory = [];
    this.signals = [];
  }

  /**
   * Add price data point
   */
  addPricePoint(price, volume, timestamp = Date.now()) {
    const point = { price, volume, timestamp };
    this.priceHistory.push(point);

    // Keep only relevant history
    const cutoff = timestamp - this.config.timeWindow;
    this.priceHistory = this.priceHistory.filter(p => p.timestamp > cutoff);

    return this.detectBounce(point);
  }

  /**
   * Detect bounce signal
   */
  detectBounce(currentPoint) {
    if (this.priceHistory.length < 3) {
      return null;
    }

    const recentPoints = this.priceHistory.slice(-10);
    const prices = recentPoints.map(p => p.price);
    const low = Math.min(...prices);
    const current = currentPoint.price;

    // Calculate bounce percentage
    const bouncePercent = ((current - low) / low) * 100;

    // Check volume spike
    const avgVolume = recentPoints.reduce((sum, p) => sum + p.volume, 0) / recentPoints.length;
    const volumeRatio = currentPoint.volume / avgVolume;

    // Detect bounce conditions
    if (bouncePercent >= this.config.minBouncePercent && 
        volumeRatio >= this.config.volumeThreshold) {
      
      const signal = {
        type: 'BOUNCE',
        timestamp: currentPoint.timestamp,
        price: currentPoint.price,
        low: low,
        bouncePercent: bouncePercent.toFixed(2),
        volumeRatio: volumeRatio.toFixed(2),
        strength: this.calculateStrength(bouncePercent, volumeRatio)
      };

      this.signals.push(signal);
      return signal;
    }

    return null;
  }

  /**
   * Calculate signal strength (0-100)
   */
  calculateStrength(bouncePercent, volumeRatio) {
    const bounceScore = Math.min(bouncePercent / this.config.minBouncePercent * 50, 50);
    const volumeScore = Math.min(volumeRatio / this.config.volumeThreshold * 50, 50);
    return Math.round(bounceScore + volumeScore);
  }

  /**
   * Get recent signals
   */
  getRecentSignals(count = 10) {
    return this.signals.slice(-count);
  }

  /**
   * Clear old signals
   */
  clearOldSignals(maxAge = 3600000) { // 1 hour
    const cutoff = Date.now() - maxAge;
    this.signals = this.signals.filter(s => s.timestamp > cutoff);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalSignals: this.signals.length,
      dataPoints: this.priceHistory.length,
      avgStrength: this.signals.length > 0
        ? this.signals.reduce((sum, s) => sum + s.strength, 0) / this.signals.length
        : 0
    };
  }
}

export default BounceDetector;
