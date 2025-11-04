/**
 * Simulated Trading Mode Module
 * Paper trading environment for testing strategies
 */

export class SimulatedTrading {
  constructor(config = {}) {
    this.config = {
      initialBalance: config.initialBalance || 10000,
      commissionRate: config.commissionRate || 0.001, // 0.1%
      slippage: config.slippage || 0.002, // 0.2%
      ...config
    };
    this.balance = this.config.initialBalance;
    this.positions = [];
    this.trades = [];
    this.equity = [];
  }

  /**
   * Get current account state
   */
  getAccount() {
    const positionValue = this.calculatePositionValue();
    return {
      balance: this.balance,
      positionValue,
      totalEquity: this.balance + positionValue,
      positions: this.positions.length,
      trades: this.trades.length
    };
  }

  /**
   * Execute buy order
   */
  buy(symbol, quantity, price) {
    const cost = quantity * price;
    const commission = cost * this.config.commissionRate;
    const slippage = cost * this.config.slippage;
    const totalCost = cost + commission + slippage;

    if (totalCost > this.balance) {
      return {
        success: false,
        error: 'Insufficient balance'
      };
    }

    this.balance -= totalCost;
    
    const trade = {
      id: `TRADE_${Date.now()}`,
      type: 'BUY',
      symbol,
      quantity,
      price,
      commission,
      slippage,
      totalCost,
      timestamp: Date.now()
    };

    this.trades.push(trade);
    
    // Add or update position
    const existingPos = this.positions.find(p => p.symbol === symbol);
    if (existingPos) {
      const totalQuantity = existingPos.quantity + quantity;
      existingPos.averagePrice = 
        (existingPos.averagePrice * existingPos.quantity + price * quantity) / totalQuantity;
      existingPos.quantity = totalQuantity;
    } else {
      this.positions.push({
        symbol,
        quantity,
        averagePrice: price,
        entryTime: Date.now()
      });
    }

    this.recordEquity();

    return {
      success: true,
      trade
    };
  }

  /**
   * Execute sell order
   */
  sell(symbol, quantity, price) {
    const position = this.positions.find(p => p.symbol === symbol);
    
    if (!position || position.quantity < quantity) {
      return {
        success: false,
        error: 'Insufficient position'
      };
    }

    const revenue = quantity * price;
    const commission = revenue * this.config.commissionRate;
    const slippage = revenue * this.config.slippage;
    const netRevenue = revenue - commission - slippage;

    this.balance += netRevenue;

    const pnl = (price - position.averagePrice) * quantity - commission - slippage;

    const trade = {
      id: `TRADE_${Date.now()}`,
      type: 'SELL',
      symbol,
      quantity,
      price,
      commission,
      slippage,
      netRevenue,
      pnl,
      pnlPercent: (pnl / (position.averagePrice * quantity) * 100).toFixed(2),
      timestamp: Date.now()
    };

    this.trades.push(trade);

    // Update position
    if (position.quantity === quantity) {
      this.positions = this.positions.filter(p => p.symbol !== symbol);
    } else {
      position.quantity -= quantity;
    }

    this.recordEquity();

    return {
      success: true,
      trade
    };
  }

  /**
   * Calculate current position value
   */
  calculatePositionValue(prices = {}) {
    return this.positions.reduce((total, pos) => {
      const currentPrice = prices[pos.symbol] || pos.averagePrice;
      return total + (pos.quantity * currentPrice);
    }, 0);
  }

  /**
   * Record equity snapshot
   */
  recordEquity() {
    const account = this.getAccount();
    this.equity.push({
      timestamp: Date.now(),
      equity: account.totalEquity
    });
  }

  /**
   * Get performance metrics
   */
  getPerformance() {
    const account = this.getAccount();
    const totalPnL = account.totalEquity - this.config.initialBalance;
    const returnPercent = (totalPnL / this.config.initialBalance * 100).toFixed(2);

    const winningTrades = this.trades.filter(t => t.type === 'SELL' && t.pnl > 0).length;
    const losingTrades = this.trades.filter(t => t.type === 'SELL' && t.pnl < 0).length;
    const winRate = winningTrades + losingTrades > 0
      ? (winningTrades / (winningTrades + losingTrades) * 100).toFixed(2)
      : 0;

    return {
      initialBalance: this.config.initialBalance,
      currentEquity: account.totalEquity,
      totalPnL,
      returnPercent: returnPercent + '%',
      totalTrades: this.trades.length,
      winningTrades,
      losingTrades,
      winRate: winRate + '%'
    };
  }

  /**
   * Reset simulation
   */
  reset() {
    this.balance = this.config.initialBalance;
    this.positions = [];
    this.trades = [];
    this.equity = [];
  }
}

export default SimulatedTrading;
