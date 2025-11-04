/**
 * Server Module
 * Express server with WebSocket support for real-time updates
 */

import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Dashboard from './modules/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Initialize dashboard
const dashboard = new Dashboard({
  launchDate: Date.now() + 3600000, // 1 hour from now
  bpm: 128,
  robinhood: { mode: 'paper' }
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json(dashboard.getState());
});

app.get('/api/modules', (req, res) => {
  const modules = dashboard.getModules();
  res.json({
    countdown: { isRunning: true },
    beatSync: { bpm: modules.beatSync.bpm },
    bounceDetector: modules.bounceDetector.getStats(),
    mlFilter: modules.mlFilter.getMetrics(),
    simulator: modules.simulator.getPerformance(),
    botPanel: modules.botPanel.getStats()
  });
});

app.post('/api/trade', async (req, res) => {
  const { symbol, quantity, side, mode } = req.body;
  
  try {
    let result;
    if (mode === 'simulated') {
      result = side === 'buy'
        ? dashboard.simulator.buy(symbol, quantity, 1.0)
        : dashboard.simulator.sell(symbol, quantity, 1.0);
    } else {
      result = await dashboard.robinhood.placeOrder(symbol, quantity, side);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bot/create', (req, res) => {
  const { name, strategy, config } = req.body;
  const bot = dashboard.botPanel.createBot(name, strategy, config);
  res.json(bot);
});

app.post('/api/bot/:id/start', (req, res) => {
  const result = dashboard.botPanel.startBot(req.params.id);
  res.json(result);
});

app.post('/api/bot/:id/stop', (req, res) => {
  const result = dashboard.botPanel.stopBot(req.params.id);
  res.json(result);
});

app.get('/api/bots', (req, res) => {
  const bots = dashboard.botPanel.getAllBots();
  res.json(bots);
});

app.post('/api/backtest', async (req, res) => {
  const { strategy, historicalData } = req.body;
  
  try {
    const results = await dashboard.backtester.runBacktest(strategy, historicalData);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/obs-overlay-url', (req, res) => {
  const url = dashboard.obsOverlay.getBrowserSourceURL(`http://localhost:${PORT}`);
  res.json({ url });
});

// OBS Overlay Route
app.get('/obs-overlay', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OBS Overlay</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: 'Arial', sans-serif;
      color: white;
    }
    .overlay-container {
      width: ${req.query.width || 1920}px;
      height: ${req.query.height || 1080}px;
      position: relative;
    }
    .countdown {
      position: absolute;
      top: 50px;
      right: 50px;
      font-size: 48px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    }
    .ticker {
      position: absolute;
      bottom: 50px;
      left: 50px;
      font-size: 24px;
      background: rgba(0,0,0,0.6);
      padding: 10px 20px;
      border-radius: 5px;
    }
    .beat-indicator {
      position: absolute;
      top: 50px;
      left: 50px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #ff00ff;
      opacity: 0.5;
      transition: transform 0.1s;
    }
    .beat-indicator.pulse {
      transform: scale(1.2);
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="overlay-container">
    <div class="beat-indicator" id="beatIndicator"></div>
    <div class="countdown" id="countdown">--:--:--</div>
    <div class="ticker" id="ticker">Waiting for data...</div>
  </div>
  <script>
    const ws = new WebSocket('ws://localhost:${PORT}');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.countdown) {
        const time = data.countdown;
        document.getElementById('countdown').textContent = 
          \`\${String(time.hours).padStart(2, '0')}:\${String(time.minutes).padStart(2, '0')}:\${String(time.seconds).padStart(2, '0')}\`;
      }
      
      if (data.beat) {
        const indicator = document.getElementById('beatIndicator');
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
      }
      
      if (data.ticker) {
        document.getElementById('ticker').textContent = data.ticker;
      }
    };
  </script>
</body>
</html>
  `);
});

// Main dashboard route
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Meme Coin Dashboard Server running on http://localhost:${PORT}`);
  console.log(`📊 OBS Overlay: ${dashboard.obsOverlay.getBrowserSourceURL(`http://localhost:${PORT}`)}`);
  
  // Initialize dashboard
  await dashboard.initialize();
  console.log('✅ Dashboard initialized');
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  // Send initial state
  ws.send(JSON.stringify(dashboard.getState()));
  
  // Subscribe to updates
  const unsubscribe = dashboard.onUpdate((state) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(state));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    unsubscribe();
  });
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle price updates
      if (data.type === 'price') {
        dashboard.processPriceData(data.symbol, data.price, data.volume);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  dashboard.shutdown();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
