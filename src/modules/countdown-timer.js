/**
 * Countdown Timer Module
 * Handles countdown functionality for meme coin launch streams
 */

export class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate);
    this.intervals = [];
    this.callbacks = [];
  }

  /**
   * Calculate time remaining until target date
   */
  getTimeRemaining() {
    const now = new Date();
    const total = this.targetDate - now;

    if (total <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    };
  }

  /**
   * Start the countdown timer
   */
  start(callback, intervalMs = 1000) {
    const interval = setInterval(() => {
      const timeRemaining = this.getTimeRemaining();
      callback(timeRemaining);

      if (timeRemaining.isExpired) {
        this.stop();
      }
    }, intervalMs);

    this.intervals.push(interval);
    this.callbacks.push(callback);

    // Immediate callback
    callback(this.getTimeRemaining());

    return interval;
  }

  /**
   * Stop all countdown timers
   */
  stop() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  /**
   * Reset countdown to new target date
   */
  reset(targetDate) {
    this.stop();
    this.targetDate = new Date(targetDate);
  }

  /**
   * Format time for display
   */
  static formatTime(time) {
    const pad = (num) => String(num).padStart(2, '0');
    
    if (time.days > 0) {
      return `${time.days}d ${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
    }
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  }
}

export default CountdownTimer;
