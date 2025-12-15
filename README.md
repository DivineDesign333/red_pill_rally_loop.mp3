# 🌌 Mastery Evolution Tree — TradingView Strategy  
**“Signals of mastery. Alerts of discipline. Risk managed with clarity.”**

---

## 📌 Repository Description
**Mastery Evolution Tree — TradingView Strategy**  
A modular Pine Script strategy for TradingView that integrates W/M pattern detection, Woodpecker signals, TPS (Take Profit / Stop Loss) modules, and the new **Cash X risk‑liquidity safeguard**. Designed for clarity, discipline, and empowerment, this strategy helps traders visualize mastery, manage risk consistently, and automate alerts for key market signals.

---

## 🚀 Features

- **📊 Modular Signal Detection**  
  - W Pattern Renewal (double bottom → bullish entry)  
  - M Pattern Convergence (double top → bearish exit)  
  - Woodpecker Tap (support/resistance tests → breakout watch)  

- **🔔 Customizable Alerts**  
  - Integrated TradingView alertconditions for all signals  
  - Configurable frequency (once per bar / bar close)  
  - Multiple notification types (popup, email, webhook, app push)  

- **⚖️ Risk‑Adjusted Position Sizing**  
  - Auto‑calculates lot size based on account balance × risk % ÷ stop‑loss distance  
  - Keeps risk consistent across trades  
  - Protects capital while scaling with account growth  

- **🎯 Take Profit / Stop Loss Modules**  
  - Configurable TP and SL percentages  
  - Balanced, conservative, and aggressive ratio presets  
  - Seamless integration with alerts for disciplined exits  

- **💵 Cash X Module**  
  - Tracks cash vs. exposure balance  
  - Ensures liquidity buffer (default: 20%)  
  - Caps maximum exposure (default: 80%)  
  - Alerts when thresholds are breached  

- **📑 Built‑In Documentation**  
  - Risk Management guide embedded in Pine Script comments  
  - Parameter summary block at the top of the script  
  - Quick Reference Card (visual cheat sheet) included in README  

- **🌌 Cinematic Branding**  
  - Mastery Evolution Tree theme with cosmic and ritualized visualization layers  
  - Banner graphics and reference cards for GitHub + TradingView  

---

## 🏁 Getting Started

### 1. Install the Strategy
- Open **TradingView → Pine Editor**.  
- Copy & paste the full script code from this repository.  
- Click **Add to Chart**.  
- Save the script to your TradingView account.

### 2. Configure Parameters
- Adjust inputs:  
  - **Risk % per Trade** (default: 1%)  
  - **Take Profit %** (default: 5%)  
  - **Stop Loss %** (default: 2%)  
  - **Cash Reserve %** (default: 20%)  
  - **Max Exposure %** (default: 80%)  

### 3. Set Up Alerts
- Go to **TradingView → Create Alert**.  
- Select `Mastery Evolution Tree` in the condition dropdown.  
- Choose from: W Pattern Renewal, M Pattern Convergence, Woodpecker Tap, Take Profit Trigger, Stop Loss Trigger, Cash X Overexposed, Cash X Low Reserve.  

### 4. Test & Validate
- Run in backtest mode to confirm signals and risk logic.  
- Adjust parameters to fit your trading style.  
- Use alerts in live mode for automated notifications.

---

## 📦 Cash X Module (Code Snippet)

```pinescript
//@version=5
strategy("Mastery Evolution Tree + Cash X", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity)

// Inputs
cashReservePct = input.float(20.0, "Cash Reserve %", minval=0, maxval=100)
maxExposurePct = input.float(80.0, "Max Exposure %", minval=0, maxval=100)

// Example calculation (pseudo-code for demonstration)
currentExposure = (strategy.openprofit + strategy.opentrades) / strategy.equity * 100

// Alerts
alertcondition(currentExposure > maxExposurePct, title="Cash X Overexposed", message="Exposure exceeds max threshold")
alertcondition((100 - currentExposure) < cashReservePct, title="Cash X Low Reserve", message="Cash reserve below minimum threshold")
