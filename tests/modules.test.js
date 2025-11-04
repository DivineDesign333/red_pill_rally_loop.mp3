/**
 * Basic module tests
 */

import assert from 'assert';
import { CountdownTimer } from '../src/modules/countdown-timer.js';
import { BeatSync } from '../src/modules/beat-sync.js';
import { BounceDetector } from '../src/modules/bounce-detector.js';
import { MLFilter } from '../src/modules/ml-filter.js';
import { SimulatedTrading } from '../src/modules/simulated-trading.js';
import { BotControlPanel } from '../src/modules/bot-control-panel.js';
import { BacktestEngine } from '../src/modules/backtesting-engine.js';

// Test Countdown Timer
console.log('Testing CountdownTimer...');
const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
const timer = new CountdownTimer(futureDate);
const timeRemaining = timer.getTimeRemaining();
assert(timeRemaining.total > 0, 'Time remaining should be positive');
assert(!timeRemaining.isExpired, 'Timer should not be expired');
console.log('✓ CountdownTimer works');

// Test Beat Sync
console.log('Testing BeatSync...');
const beatSync = new BeatSync(120);
assert(beatSync.getBeatInterval() === 500, 'Beat interval should be 500ms for 120 BPM');
console.log('✓ BeatSync works');

// Test Bounce Detector
console.log('Testing BounceDetector...');
const detector = new BounceDetector();
detector.addPricePoint(1.0, 1000);
detector.addPricePoint(0.9, 1000);
detector.addPricePoint(1.1, 2000);
const stats = detector.getStats();
assert(stats.dataPoints === 3, 'Should have 3 data points');
console.log('✓ BounceDetector works');

// Test ML Filter
console.log('Testing MLFilter...');
const mlFilter = new MLFilter();
const signal = { bouncePercent: '10', volumeRatio: '2', strength: 80 };
const prediction = mlFilter.predict(signal);
assert(prediction.probability !== undefined, 'Should return probability');
console.log('✓ MLFilter works');

// Test Simulated Trading
console.log('Testing SimulatedTrading...');
const simulator = new SimulatedTrading({ initialBalance: 10000 });
const buyResult = simulator.buy('MEME', 10, 1.0);
assert(buyResult.success, 'Buy should succeed');
const account = simulator.getAccount();
assert(account.balance < 10000, 'Balance should decrease after buy');
console.log('✓ SimulatedTrading works');

// Test Bot Control Panel
console.log('Testing BotControlPanel...');
const botPanel = new BotControlPanel();
const bot = botPanel.createBot('TestBot', 'simple');
assert(bot.name === 'TestBot', 'Bot should be created with correct name');
const stats2 = botPanel.getStats();
assert(stats2.totalBots === 1, 'Should have 1 bot');
console.log('✓ BotControlPanel works');

// Test Backtesting Engine
console.log('Testing BacktestEngine...');
const engine = new BacktestEngine({ initialCapital: 10000 });
assert(engine.config.initialCapital === 10000, 'Initial capital should be set');
console.log('✓ BacktestEngine works');

console.log('\n✅ All module tests passed!');
