/**
 * Bot Control Panel Module
 * Manages automated trading bot operations
 */

export class BotControlPanel {
  constructor(config = {}) {
    this.config = {
      maxConcurrentTrades: config.maxConcurrentTrades || 3,
      autoTradeEnabled: config.autoTradeEnabled || false,
      riskPerTrade: config.riskPerTrade || 0.02, // 2% per trade
      ...config
    };
    this.bots = [];
    this.isRunning = false;
    this.logs = [];
  }

  /**
   * Create a new bot instance
   */
  createBot(name, strategy, config = {}) {
    const bot = {
      id: `BOT_${Date.now()}`,
      name,
      strategy,
      config: {
        ...this.config,
        ...config
      },
      status: 'idle',
      trades: [],
      performance: {
        totalTrades: 0,
        winRate: 0,
        profit: 0
      },
      createdAt: Date.now()
    };

    this.bots.push(bot);
    this.log('info', `Bot created: ${name}`);
    return bot;
  }

  /**
   * Start bot
   */
  startBot(botId) {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }

    bot.status = 'running';
    bot.startedAt = Date.now();
    this.log('info', `Bot started: ${bot.name}`);

    return { success: true, bot };
  }

  /**
   * Stop bot
   */
  stopBot(botId) {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }

    bot.status = 'stopped';
    bot.stoppedAt = Date.now();
    this.log('info', `Bot stopped: ${bot.name}`);

    return { success: true, bot };
  }

  /**
   * Delete bot
   */
  deleteBot(botId) {
    const index = this.bots.findIndex(b => b.id === botId);
    if (index === -1) {
      return { success: false, error: 'Bot not found' };
    }

    const bot = this.bots[index];
    this.bots.splice(index, 1);
    this.log('info', `Bot deleted: ${bot.name}`);

    return { success: true };
  }

  /**
   * Start all bots
   */
  startAll() {
    this.isRunning = true;
    this.bots.forEach(bot => {
      if (bot.status === 'idle' || bot.status === 'stopped') {
        this.startBot(bot.id);
      }
    });
    this.log('info', 'All bots started');
  }

  /**
   * Stop all bots
   */
  stopAll() {
    this.isRunning = false;
    this.bots.forEach(bot => {
      if (bot.status === 'running') {
        this.stopBot(bot.id);
      }
    });
    this.log('info', 'All bots stopped');
  }

  /**
   * Get bot status
   */
  getBotStatus(botId) {
    const bot = this.bots.find(b => b.id === botId);
    return bot || null;
  }

  /**
   * Get all bots
   */
  getAllBots() {
    return [...this.bots];
  }

  /**
   * Update bot configuration
   */
  updateBotConfig(botId, newConfig) {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) {
      return { success: false, error: 'Bot not found' };
    }

    bot.config = { ...bot.config, ...newConfig };
    this.log('info', `Bot config updated: ${bot.name}`);

    return { success: true, bot };
  }

  /**
   * Record bot trade
   */
  recordTrade(botId, trade) {
    const bot = this.bots.find(b => b.id === botId);
    if (!bot) return;

    bot.trades.push(trade);
    bot.performance.totalTrades++;

    // Update win rate and profit
    const completedTrades = bot.trades.filter(t => t.status === 'closed');
    if (completedTrades.length > 0) {
      const winningTrades = completedTrades.filter(t => t.profit > 0);
      bot.performance.winRate = (winningTrades.length / completedTrades.length * 100).toFixed(2);
      bot.performance.profit = completedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    }
  }

  /**
   * Log activity
   */
  log(level, message) {
    const logEntry = {
      level,
      message,
      timestamp: Date.now()
    };
    this.logs.push(logEntry);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  /**
   * Get logs
   */
  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }

  /**
   * Get overall statistics
   */
  getStats() {
    const runningBots = this.bots.filter(b => b.status === 'running').length;
    const totalTrades = this.bots.reduce((sum, b) => sum + b.performance.totalTrades, 0);
    const totalProfit = this.bots.reduce((sum, b) => sum + b.performance.profit, 0);

    return {
      totalBots: this.bots.length,
      runningBots,
      idleBots: this.bots.filter(b => b.status === 'idle').length,
      stoppedBots: this.bots.filter(b => b.status === 'stopped').length,
      totalTrades,
      totalProfit: totalProfit.toFixed(2),
      systemRunning: this.isRunning
    };
  }
}

export default BotControlPanel;
