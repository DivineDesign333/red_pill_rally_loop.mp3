/**
 * Backtesting Engine Module
 * Tests trading strategies against historical data
 */

export class BacktestEngine {
  constructor(config = {}) {
    this.config = {
      initialCapital: config.initialCapital || 10000,
      commission: config.commission || 0.001,
      slippage: config.slippage || 0.002,
      ...config
    };
    this.results = null;
    this.trades = [];
  }

  /**
   * Run backtest on historical data
   */
  async runBacktest(strategy, historicalData, config = {}) {
    const startTime = Date.now();
    this.trades = [];

    let capital = this.config.initialCapital;
    let positions = {};
    let equity = [{ timestamp: historicalData[0]?.timestamp, value: capital }];

    for (let i = 0; i < historicalData.length; i++) {
      const dataPoint = historicalData[i];
      const signal = strategy.evaluate(dataPoint, positions);

      if (signal && signal.action) {
        const trade = this.executeBacktestTrade(
          signal,
          dataPoint,
          capital,
          positions
        );

        if (trade.success) {
          if (signal.action === 'BUY') {
            capital -= trade.cost;
            positions[signal.symbol] = {
              quantity: trade.quantity,
              entryPrice: trade.price,
              entryTime: dataPoint.timestamp
            };
          } else if (signal.action === 'SELL' && positions[signal.symbol]) {
            capital += trade.revenue;
            delete positions[signal.symbol];
          }

          this.trades.push(trade);
        }
      }

      // Calculate current equity
      const positionValue = this.calculatePositionValue(positions, dataPoint.prices);
      equity.push({
        timestamp: dataPoint.timestamp,
        value: capital + positionValue
      });
    }

    this.results = this.calculateMetrics(equity, this.trades);
    this.results.executionTime = Date.now() - startTime;

    return this.results;
  }

  /**
   * Execute a simulated trade during backtest
   */
  executeBacktestTrade(signal, dataPoint, capital, positions) {
    const price = dataPoint.prices[signal.symbol] || signal.price;
    const quantity = signal.quantity || this.calculatePositionSize(capital, price);

    if (signal.action === 'BUY') {
      const cost = quantity * price;
      const totalCost = cost * (1 + this.config.commission + this.config.slippage);

      if (totalCost > capital) {
        return { success: false, error: 'Insufficient capital' };
      }

      return {
        success: true,
        action: 'BUY',
        symbol: signal.symbol,
        quantity,
        price,
        cost: totalCost,
        timestamp: dataPoint.timestamp
      };
    } else if (signal.action === 'SELL') {
      const position = positions[signal.symbol];
      if (!position) {
        return { success: false, error: 'No position to sell' };
      }

      // Use position quantity if not specified in signal
      const sellQuantity = signal.quantity || position.quantity;
      const revenue = sellQuantity * price;
      const netRevenue = revenue * (1 - this.config.commission - this.config.slippage);
      const profit = netRevenue - (position.entryPrice * sellQuantity);
      const profitPercent = (profit / (position.entryPrice * sellQuantity)) * 100;

      return {
        success: true,
        action: 'SELL',
        symbol: signal.symbol,
        quantity: sellQuantity,
        price,
        revenue: netRevenue,
        profit,
        profitPercent: profitPercent.toFixed(2),
        holdTime: dataPoint.timestamp - position.entryTime,
        timestamp: dataPoint.timestamp
      };
    }

    return { success: false, error: 'Invalid action' };
  }

  /**
   * Calculate position size based on capital
   */
  calculatePositionSize(capital, price) {
    const maxInvestment = capital * 0.1; // 10% per trade
    return Math.floor(maxInvestment / price);
  }

  /**
   * Calculate position value
   */
  calculatePositionValue(positions, currentPrices) {
    return Object.entries(positions).reduce((total, [symbol, position]) => {
      const currentPrice = currentPrices[symbol] || position.entryPrice;
      return total + (position.quantity * currentPrice);
    }, 0);
  }

  /**
   * Calculate performance metrics
   */
  calculateMetrics(equity, trades) {
    const initialEquity = equity[0].value;
    const finalEquity = equity[equity.length - 1].value;
    const totalReturn = finalEquity - initialEquity;
    const returnPercent = (totalReturn / initialEquity) * 100;

    const completedTrades = trades.filter(t => t.action === 'SELL');
    const winningTrades = completedTrades.filter(t => t.profit > 0);
    const losingTrades = completedTrades.filter(t => t.profit < 0);

    const winRate = completedTrades.length > 0
      ? (winningTrades.length / completedTrades.length) * 100
      : 0;

    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + t.profit, 0) / winningTrades.length
      : 0;

    const avgLoss = losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + t.profit, 0) / losingTrades.length
      : 0;

    const profitFactor = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

    // Calculate max drawdown
    let peak = equity[0].value;
    let maxDrawdown = 0;

    for (const point of equity) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = ((peak - point.value) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return {
      initialCapital: initialEquity,
      finalEquity: finalEquity.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      returnPercent: returnPercent.toFixed(2) + '%',
      totalTrades: trades.length,
      completedTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: winRate.toFixed(2) + '%',
      avgWin: avgWin.toFixed(2),
      avgLoss: avgLoss.toFixed(2),
      profitFactor: profitFactor.toFixed(2),
      maxDrawdown: maxDrawdown.toFixed(2) + '%',
      equityCurve: equity
    };
  }

  /**
   * Get backtest results
   */
  getResults() {
    return this.results;
  }

  /**
   * Get trade history
   */
  getTradeHistory() {
    return [...this.trades];
  }

  /**
   * Export results to JSON
   */
  exportResults() {
    return {
      results: this.results,
      trades: this.trades,
      config: this.config
    };
  }
}

export default BacktestEngine;
