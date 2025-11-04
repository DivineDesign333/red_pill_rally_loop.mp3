# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The dashboard will be available at: `http://localhost:3000`

### 3. Access the Dashboard

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the modular dashboard with all 8 modules:
- ⏰ Launch Countdown
- 🎵 Beat Sync
- 📊 Bounce Signals
- 🧠 ML Filter
- 🛒 Trading Panel
- 🤖 Bot Control
- 📈 Backtesting
- 🎥 OBS Overlay

### 4. Test Features

#### Countdown Timer
The countdown automatically starts and displays time remaining until the configured launch date.

#### Beat Sync
- Adjust BPM with the slider
- Watch the beat indicator pulse in real-time

#### Simulated Trading
1. Select "🧪 Simulated" mode
2. Enter a symbol (e.g., "MEME")
3. Enter quantity (e.g., "10")
4. Click "Buy" or "Sell"
5. Watch your P&L update

#### Create a Bot
1. Click "Create Bot" in the Bot Control section
2. Enter a bot name
3. Bot appears in the list
4. Use "Start All" to activate all bots

#### Run Backtest
1. Click "Run Backtest" in the Backtesting section
2. View results including return %, win rate, and drawdown

### 5. OBS Integration

#### Setup OBS Browser Source:
1. Copy the OBS URL from the dashboard (bottom right module)
2. In OBS Studio:
   - Add new **Browser** source
   - Paste the URL
   - Set width: 1920, height: 1080
   - Click OK

Your stream overlay will now show:
- Live countdown timer
- Beat sync indicators
- Price tickers

## 📱 API Usage

### Get Dashboard Status
```bash
curl http://localhost:3000/api/status
```

### Get Module Information
```bash
curl http://localhost:3000/api/modules
```

### Execute a Trade
```bash
curl -X POST http://localhost:3000/api/trade \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "MEME",
    "quantity": 10,
    "side": "buy",
    "mode": "simulated"
  }'
```

### Create a Bot
```bash
curl -X POST http://localhost:3000/api/bot/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyBot",
    "strategy": "bounce",
    "config": {"maxConcurrentTrades": 3}
  }'
```

## 🧪 Development Mode

Start server with auto-restart on file changes:
```bash
npm run dev
```

## 🧰 Configuration

Copy the example config:
```bash
cp config.example.json config.json
```

Edit `config.json` to customize:
- Launch date/time
- BPM settings
- Trading parameters
- ML filter thresholds
- Bot configurations

## 🎯 Next Steps

1. **Customize Countdown**: Edit launch date in config.json
2. **Adjust Beat Sync**: Change BPM via slider or config
3. **Configure ML Filter**: Tune confidence thresholds
4. **Set Trading Limits**: Define position sizes and risk
5. **Create Bots**: Add automated trading bots
6. **Run Backtests**: Test strategies with historical data

## 🛟 Troubleshooting

### Port Already in Use
If port 3000 is taken, set a different port:
```bash
PORT=8080 npm start
```

### WebSocket Connection Issues
- Check firewall settings
- Ensure server is running
- Check browser console for errors

### Module Not Loading
- Verify all dependencies installed: `npm install`
- Check Node.js version: `node --version` (need 18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📚 Documentation

See the main README.md for:
- Detailed API reference
- Module documentation
- Architecture overview
- Advanced configuration

## 💡 Tips

- Use simulated mode for testing before live trading
- Adjust BPM to match your stream music
- Create multiple bots with different strategies
- Backtest strategies before deploying bots
- Monitor ML filter metrics to tune confidence
- Use OBS overlay presets for different stream layouts

## 🎉 You're Ready!

Your modular dashboard is now running. Explore all the features and customize it for your meme coin launch stream!
