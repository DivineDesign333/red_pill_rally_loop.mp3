# 🚀 Meme Coin Launch Dashboard

A comprehensive, modular dashboard for meme coin launch streams with countdown timer, beat sync, and OBS overlay integration. Built with a clean, maintainable architecture designed for live streaming and automated trading.

## ✨ Features

### Core Modules

- **⏰ Countdown Timer** - Launch countdown with real-time updates
- **🎵 Beat Sync** - Synchronize visual elements with audio beats (configurable BPM)
- **🎥 OBS Overlay Integration** - Browser source overlays for streaming software
- **📊 Bounce Signal Detection** - Detect price bounce patterns with configurable thresholds
- **🧠 ML-Powered Filtering** - Machine learning signal filtering and classification
- **🛒 Robinhood Integration** - Trading API integration (simulated mode included)
- **🧪 Simulated Trading Mode** - Paper trading environment for strategy testing
- **🤖 Bot Control Panel** - Manage automated trading bots
- **📈 Backtesting Engine** - Test strategies against historical data

### Key Capabilities

- Real-time WebSocket communication
- Modular, extensible architecture
- RESTful API for all operations
- Responsive web interface
- OBS streaming integration
- Performance metrics and analytics

## 🏗️ Architecture

```
src/
├── modules/           # Core modules
│   ├── countdown-timer.js
│   ├── beat-sync.js
│   ├── obs-overlay.js
│   ├── bounce-detector.js
│   ├── ml-filter.js
│   ├── robinhood-integration.js
│   ├── simulated-trading.js
│   ├── bot-control-panel.js
│   ├── backtesting-engine.js
│   └── dashboard.js   # Main integration
├── server.js          # Express + WebSocket server
public/
├── index.html         # Dashboard UI
├── css/
│   └── dashboard.css
└── js/
    └── dashboard.js   # Client-side logic
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (with ES modules support)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DivineDesign333/red_pill_rally_loop.mp3.git
cd red_pill_rally_loop.mp3
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser:
```
http://localhost:3000
```

### Development Mode

Run with auto-restart on file changes:
```bash
npm run dev
```

## 📚 Module Documentation

### Countdown Timer

```javascript
import CountdownTimer from './modules/countdown-timer.js';

const timer = new CountdownTimer('2024-12-31T23:59:59');
timer.start((time) => {
  console.log(`${time.hours}:${time.minutes}:${time.seconds}`);
});
```

### Beat Sync

```javascript
import BeatSync from './modules/beat-sync.js';

const beatSync = new BeatSync(128); // 128 BPM
beatSync.start();
beatSync.onBeat((timing) => {
  console.log(`Beat ${timing.beat}`);
});
```

### Bounce Detector

```javascript
import BounceDetector from './modules/bounce-detector.js';

const detector = new BounceDetector({
  minBouncePercent: 5,
  volumeThreshold: 1.5
});

const signal = detector.addPricePoint(1.25, 1000000);
if (signal) {
  console.log('Bounce detected!', signal);
}
```

### ML Filter

```javascript
import MLFilter from './modules/ml-filter.js';

const filter = new MLFilter({ confidenceThreshold: 0.7 });
const prediction = filter.predict(signal);

if (prediction.shouldTrade) {
  console.log('Trade recommended:', prediction.confidence);
}
```

### Simulated Trading

```javascript
import SimulatedTrading from './modules/simulated-trading.js';

const sim = new SimulatedTrading({ initialBalance: 10000 });
const result = sim.buy('MEME', 100, 1.50);
console.log('Position opened:', result);
```

### Bot Control Panel

```javascript
import BotControlPanel from './modules/bot-control-panel.js';

const panel = new BotControlPanel();
const bot = panel.createBot('ScalpBot', 'momentum');
panel.startBot(bot.id);
```

### Backtesting Engine

```javascript
import BacktestEngine from './modules/backtesting-engine.js';

const engine = new BacktestEngine({ initialCapital: 10000 });
const results = await engine.runBacktest(strategy, historicalData);
console.log('Returns:', results.returnPercent);
```

## 🎥 OBS Integration

### Setting Up OBS Browser Source

1. Get the overlay URL from the dashboard or API:
```
GET /api/obs-overlay-url
```

2. In OBS Studio:
   - Add new **Browser** source
   - Paste the overlay URL
   - Set dimensions (default: 1920x1080)
   - Enable "Shutdown source when not visible"

### Available Overlays

- **Minimal**: Countdown + Ticker
- **Full**: All elements enabled
- **Stream Focus**: Optimized for streaming

## 🔧 API Reference

### REST Endpoints

#### Get Status
```http
GET /api/status
```

#### Execute Trade
```http
POST /api/trade
Content-Type: application/json

{
  "symbol": "MEME",
  "quantity": 100,
  "side": "buy",
  "mode": "simulated"
}
```

#### Create Bot
```http
POST /api/bot/create
Content-Type: application/json

{
  "name": "Bot1",
  "strategy": "bounce",
  "config": { "maxConcurrentTrades": 3 }
}
```

#### Run Backtest
```http
POST /api/backtest
Content-Type: application/json

{
  "strategy": { ... },
  "historicalData": [ ... ]
}
```

### WebSocket Events

Connect to `ws://localhost:3000` for real-time updates.

**Server → Client:**
- Dashboard state updates
- Beat sync events
- Signal notifications
- Trade confirmations

**Client → Server:**
```json
{
  "type": "price",
  "symbol": "MEME",
  "price": 1.25,
  "volume": 1000000
}
```

## ⚙️ Configuration

Create a `config.json` file:

```json
{
  "launchDate": "2024-12-31T23:59:59",
  "bpm": 128,
  "robinhood": {
    "mode": "paper",
    "apiKey": "your-api-key"
  },
  "bounceDetector": {
    "minBouncePercent": 5,
    "volumeThreshold": 1.5
  },
  "mlFilter": {
    "confidenceThreshold": 0.7
  },
  "simulator": {
    "initialBalance": 10000
  }
}
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📊 Performance Metrics

The dashboard tracks:
- Signal detection accuracy
- ML filter performance
- Trading win rates
- Bot profitability
- Backtest results
- System uptime

## 🛡️ Security Notes

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use simulated mode for testing

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

Apache License 2.0 - See LICENSE file for details

## 🔗 Resources

- [OBS Studio](https://obsproject.com/)
- [WebSocket Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Express.js](https://expressjs.com/)

## 💬 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review module examples

## 🎯 Roadmap

- [ ] Advanced ML models
- [ ] More trading integrations
- [ ] Mobile app
- [ ] Discord/Telegram bots
- [ ] Advanced charting
- [ ] Historical data import
- [ ] Cloud deployment guides

---

Built with ❤️ for the meme coin community