/**
 * Dashboard Module
 * Main integration point for all modules
 */

import CountdownTimer from './countdown-timer.js';
import BeatSync from './beat-sync.js';
import OBSOverlay from './obs-overlay.js';
import BounceDetector from './bounce-detector.js';
import MLFilter from './ml-filter.js';
import RobinhoodIntegration from './robinhood-integration.js';
import SimulatedTrading from './simulated-trading.js';
import BotControlPanel from './bot-control-panel.js';
import BacktestEngine from './backtesting-engine.js';

export class Dashboard {
  constructor(config = {}) {
    this.config = config;
    
    // Initialize modules
    this.countdown = new CountdownTimer(config.launchDate || Date.now() + 3600000);
    this.beatSync = new BeatSync(config.bpm || 120);
    this.obsOverlay = new OBSOverlay(config.overlay || {});
    this.bounceDetector = new BounceDetector(config.bounceDetector || {});
    this.mlFilter = new MLFilter(config.mlFilter || {});
    this.robinhood = new RobinhoodIntegration(config.robinhood || {});
    this.simulator = new SimulatedTrading(config.simulator || {});
    this.botPanel = new BotControlPanel(config.botPanel || {});
    this.backtester = new BacktestEngine(config.backtester || {});
    
    this.updateCallbacks = [];
    this.state = {
      initialized: true,
      timestamp: Date.now()
    };
  }

  /**
   * Initialize all modules
   */
  async initialize() {
    try {
      // Connect to Robinhood if configured
      if (this.config.robinhood?.apiKey) {
        await this.robinhood.connect();
      }

      // Start beat sync
      this.beatSync.start();

      // Start countdown
      this.countdown.start((time) => {
        this.updateState({ countdown: time });
      });

      // Set up beat sync overlay updates
      this.beatSync.onBeat((timing) => {
        this.obsOverlay.setElement('beat', timing);
      });

      this.state.initialized = true;
      this.notifyUpdate();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update dashboard state
   */
  updateState(updates) {
    this.state = {
      ...this.state,
      ...updates,
      timestamp: Date.now()
    };
    this.notifyUpdate();
  }

  /**
   * Get current dashboard state
   */
  getState() {
    return {
      ...this.state,
      countdown: this.countdown.getTimeRemaining(),
      beatSync: {
        isRunning: this.beatSync.isRunning,
        bpm: this.beatSync.bpm,
        currentBeat: this.beatSync.getCurrentBeat()
      },
      bounceDetector: this.bounceDetector.getStats(),
      mlFilter: this.mlFilter.getMetrics(),
      robinhood: this.robinhood.getStats(),
      simulator: this.simulator.getPerformance(),
      botPanel: this.botPanel.getStats(),
      backtester: this.backtester.getResults()
    };
  }

  /**
   * Process incoming price data
   */
  processPriceData(symbol, price, volume) {
    // Detect bounce signals
    const signal = this.bounceDetector.addPricePoint(price, volume);
    
    if (signal) {
      // Filter with ML
      const prediction = this.mlFilter.predict(signal);
      
      if (prediction.shouldTrade) {
        this.updateState({
          latestSignal: {
            ...signal,
            prediction
          }
        });

        // Notify for potential trade
        this.notifyUpdate();
      }
    }
  }

  /**
   * Execute trade based on signal
   */
  async executeTrade(signal, mode = 'simulated') {
    try {
      if (mode === 'simulated') {
        const result = this.simulator.buy(
          signal.signal.symbol || 'MEME',
          10,
          signal.signal.price
        );
        return result;
      } else if (mode === 'live') {
        const order = await this.robinhood.placeOrder(
          signal.signal.symbol || 'MEME',
          10,
          'buy'
        );
        return { success: true, order };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Register callback for updates
   */
  onUpdate(callback) {
    this.updateCallbacks.push(callback);
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all callbacks
   */
  notifyUpdate() {
    const state = this.getState();
    this.updateCallbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Update callback error:', error);
      }
    });
  }

  /**
   * Shutdown dashboard
   */
  shutdown() {
    this.countdown.stop();
    this.beatSync.stop();
    this.botPanel.stopAll();
    this.robinhood.disconnect();
  }

  /**
   * Get all modules for direct access
   */
  getModules() {
    return {
      countdown: this.countdown,
      beatSync: this.beatSync,
      obsOverlay: this.obsOverlay,
      bounceDetector: this.bounceDetector,
      mlFilter: this.mlFilter,
      robinhood: this.robinhood,
      simulator: this.simulator,
      botPanel: this.botPanel,
      backtester: this.backtester
    };
  }
}

export default Dashboard;
