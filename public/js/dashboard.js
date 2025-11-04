/**
 * Dashboard Client-Side JavaScript
 * Handles WebSocket communication and UI updates
 */

class DashboardClient {
    constructor() {
        this.ws = null;
        this.tradingMode = 'simulated';
        this.connected = false;
        this.init();
    }

    init() {
        this.connectWebSocket();
        this.setupEventListeners();
        this.fetchOBSUrl();
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.ws = new WebSocket(`${protocol}//${window.location.host}`);

        this.ws.onopen = () => {
            this.connected = true;
            this.updateConnectionStatus(true);
            console.log('WebSocket connected');
        };

        this.ws.onclose = () => {
            this.connected = false;
            this.updateConnectionStatus(false);
            console.log('WebSocket disconnected');
            // Attempt reconnection
            setTimeout(() => this.connectWebSocket(), 5000);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleUpdate(data);
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    updateConnectionStatus(connected) {
        const indicator = document.getElementById('connectionStatus');
        const text = document.getElementById('statusText');
        
        if (connected) {
            indicator.style.color = '#00ff00';
            text.textContent = 'Connected';
        } else {
            indicator.style.color = '#ff0000';
            text.textContent = 'Disconnected';
        }
    }

    handleUpdate(data) {
        // Update countdown
        if (data.countdown) {
            this.updateCountdown(data.countdown);
        }

        // Update beat sync
        if (data.beatSync) {
            this.updateBeatSync(data.beatSync);
        }

        // Update bounce detector
        if (data.bounceDetector) {
            this.updateBounceDetector(data.bounceDetector);
        }

        // Update ML filter
        if (data.mlFilter) {
            this.updateMLFilter(data.mlFilter);
        }

        // Update trading performance
        if (data.simulator) {
            this.updatePerformance(data.simulator);
        }

        // Update bot panel
        if (data.botPanel) {
            this.updateBotPanel(data.botPanel);
        }

        // Update backtesting results
        if (data.backtester && data.backtester !== null) {
            this.updateBacktestResults(data.backtester);
        }

        // Handle beat pulse
        if (data.beat) {
            this.pulseBeat();
        }
    }

    updateCountdown(time) {
        document.getElementById('days').textContent = String(time.days).padStart(2, '0');
        document.getElementById('hours').textContent = String(time.hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(time.minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(time.seconds).padStart(2, '0');
    }

    updateBeatSync(beatData) {
        document.getElementById('bpmDisplay').textContent = beatData.bpm || 120;
        document.getElementById('beatCount').textContent = beatData.currentBeat || 0;
    }

    pulseBeat() {
        const indicator = document.getElementById('beatIndicator');
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
    }

    updateBounceDetector(stats) {
        document.getElementById('totalSignals').textContent = stats.totalSignals || 0;
        document.getElementById('avgStrength').textContent = 
            stats.avgStrength ? stats.avgStrength.toFixed(2) : '0';
    }

    updateMLFilter(metrics) {
        if (!metrics) {
            document.getElementById('mlPredictions').textContent = '0';
            document.getElementById('mlConfidence').textContent = '0%';
            document.getElementById('mlFilterRate').textContent = '0%';
            return;
        }

        document.getElementById('mlPredictions').textContent = metrics.totalPredictions || 0;
        document.getElementById('mlConfidence').textContent = 
            (parseFloat(metrics.avgConfidence || 0) * 100).toFixed(1) + '%';
        document.getElementById('mlFilterRate').textContent = metrics.filterRate || '0%';
    }

    updatePerformance(perf) {
        const balance = document.getElementById('balance');
        const pnl = document.getElementById('pnl');
        const returnEl = document.getElementById('return');

        balance.textContent = parseFloat(perf.currentEquity || 10000).toFixed(2);
        
        const pnlValue = parseFloat(perf.totalPnL || 0);
        pnl.textContent = (pnlValue >= 0 ? '+' : '') + pnlValue.toFixed(2);
        pnl.style.color = pnlValue >= 0 ? '#00ff88' : '#ff4444';

        returnEl.textContent = perf.returnPercent || '0%';
        returnEl.style.color = parseFloat(perf.returnPercent) >= 0 ? '#00ff88' : '#ff4444';
    }

    updateBotPanel(stats) {
        document.getElementById('totalBots').textContent = stats.totalBots || 0;
        document.getElementById('runningBots').textContent = stats.runningBots || 0;
        document.getElementById('botTrades').textContent = stats.totalTrades || 0;
    }

    updateBacktestResults(results) {
        const container = document.getElementById('backtestResults');
        
        if (!results) {
            container.innerHTML = '<p>No results yet</p>';
            return;
        }

        container.innerHTML = `
            <p><strong>Return:</strong> ${results.returnPercent}</p>
            <p><strong>Win Rate:</strong> ${results.winRate}</p>
            <p><strong>Trades:</strong> ${results.completedTrades}</p>
            <p><strong>Max Drawdown:</strong> ${results.maxDrawdown}</p>
            <p><strong>Profit Factor:</strong> ${results.profitFactor}</p>
        `;
    }

    setupEventListeners() {
        // Trading mode selector
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.tradingMode = e.target.dataset.mode;
            });
        });

        // Buy button
        document.getElementById('buyBtn').addEventListener('click', () => {
            this.executeTrade('buy');
        });

        // Sell button
        document.getElementById('sellBtn').addEventListener('click', () => {
            this.executeTrade('sell');
        });

        // BPM slider
        document.getElementById('bpmSlider').addEventListener('input', (e) => {
            document.getElementById('bpmDisplay').textContent = e.target.value;
        });

        // Bot controls
        document.getElementById('createBotBtn').addEventListener('click', () => {
            this.createBot();
        });

        document.getElementById('startAllBots').addEventListener('click', () => {
            this.controlAllBots('start');
        });

        document.getElementById('stopAllBots').addEventListener('click', () => {
            this.controlAllBots('stop');
        });

        // Backtest
        document.getElementById('runBacktestBtn').addEventListener('click', () => {
            this.runBacktest();
        });

        // OBS URL copy
        document.getElementById('copyObsUrl').addEventListener('click', () => {
            const urlInput = document.getElementById('obsUrl');
            urlInput.select();
            document.execCommand('copy');
            alert('OBS URL copied to clipboard!');
        });

        // Overlay presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                console.log(`Applying preset: ${preset}`);
            });
        });
    }

    async executeTrade(side) {
        const symbol = document.getElementById('tradeSymbol').value;
        const quantity = parseInt(document.getElementById('tradeQuantity').value);

        try {
            const response = await fetch('/api/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol,
                    quantity,
                    side,
                    mode: this.tradingMode
                })
            });

            const result = await response.json();
            console.log('Trade result:', result);

            if (result.success) {
                alert(`${side.toUpperCase()} order executed successfully!`);
            } else {
                alert(`Trade failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Trade error:', error);
            alert('Trade failed: ' + error.message);
        }
    }

    async createBot() {
        const name = prompt('Enter bot name:');
        if (!name) return;

        try {
            const response = await fetch('/api/bot/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    strategy: 'bounce',
                    config: { maxConcurrentTrades: 3 }
                })
            });

            const bot = await response.json();
            console.log('Bot created:', bot);
            alert(`Bot "${name}" created successfully!`);
        } catch (error) {
            console.error('Create bot error:', error);
            alert('Failed to create bot: ' + error.message);
        }
    }

    async controlAllBots(action) {
        console.log(`${action} all bots`);
        // This would typically call an API endpoint
        alert(`All bots ${action}ed`);
    }

    async runBacktest() {
        // Generate sample historical data
        const historicalData = [];
        let price = 1.0;
        
        for (let i = 0; i < 100; i++) {
            price += (Math.random() - 0.5) * 0.1;
            historicalData.push({
                timestamp: Date.now() - (100 - i) * 3600000,
                prices: { MEME: Math.max(0.1, price) }
            });
        }

        try {
            const response = await fetch('/api/backtest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    strategy: {
                        evaluate: (data, positions) => {
                            // Simple strategy
                            return Math.random() > 0.8 ? { action: 'BUY', symbol: 'MEME' } : null;
                        }
                    },
                    historicalData
                })
            });

            const results = await response.json();
            console.log('Backtest results:', results);
            this.updateBacktestResults(results);
        } catch (error) {
            console.error('Backtest error:', error);
            alert('Backtest failed: ' + error.message);
        }
    }

    async fetchOBSUrl() {
        try {
            const response = await fetch('/api/obs-overlay-url');
            const data = await response.json();
            document.getElementById('obsUrl').value = data.url;
        } catch (error) {
            console.error('Failed to fetch OBS URL:', error);
        }
    }

    sendMessage(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DashboardClient();
    });
} else {
    new DashboardClient();
}
