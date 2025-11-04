/**
 * Beat Sync Module
 * Synchronizes visual elements with audio beats for stream overlays
 */

export class BeatSync {
  constructor(bpm = 120) {
    this.bpm = bpm;
    this.isRunning = false;
    this.beatCallbacks = [];
    this.interval = null;
    this.beatCount = 0;
    this.startTime = null;
  }

  /**
   * Calculate beat interval in milliseconds
   */
  getBeatInterval() {
    return (60 / this.bpm) * 1000;
  }

  /**
   * Start beat synchronization
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.beatCount = 0;
    this.startTime = Date.now();
    
    const beatInterval = this.getBeatInterval();

    this.interval = setInterval(() => {
      this.beatCount++;
      const timing = {
        beat: this.beatCount,
        timestamp: Date.now(),
        elapsed: Date.now() - this.startTime,
        bpm: this.bpm
      };

      this.beatCallbacks.forEach(callback => callback(timing));
    }, beatInterval);
  }

  /**
   * Stop beat synchronization
   */
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Register callback for beat events
   */
  onBeat(callback) {
    this.beatCallbacks.push(callback);
    return () => {
      this.beatCallbacks = this.beatCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Update BPM dynamically
   */
  setBPM(newBpm) {
    const wasRunning = this.isRunning;
    if (wasRunning) {
      this.stop();
    }
    this.bpm = newBpm;
    if (wasRunning) {
      this.start();
    }
  }

  /**
   * Get current beat position
   */
  getCurrentBeat() {
    if (!this.isRunning) return 0;
    const elapsed = Date.now() - this.startTime;
    const beatInterval = this.getBeatInterval();
    return Math.floor(elapsed / beatInterval);
  }

  /**
   * Detect beat from audio analysis (simplified)
   */
  static detectBeatFromAmplitude(amplitude, threshold = 0.8) {
    return amplitude > threshold;
  }
}

export default BeatSync;
