#!/usr/bin/env node

/**
 * Demo Script - Generates sample data and demonstrates dashboard features
 * Run this while the server is running to see live updates
 */

import WebSocket from 'ws';

const WS_URL = 'ws://localhost:3000';
const DEMO_DURATION = 60000; // 60 seconds

console.log('🎬 Starting Dashboard Demo...\n');

// Connect to WebSocket
const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected to dashboard\n');
  runDemo();
});

ws.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.log('\n💡 Make sure the server is running: npm start');
  process.exit(1);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    if (message.latestSignal) {
      console.log('🎯 Signal detected:', {
        type: message.latestSignal.type,
        price: message.latestSignal.price,
        strength: message.latestSignal.strength
      });
    }
  } catch (error) {
    // Ignore parse errors
  }
});

function runDemo() {
  console.log('📊 Generating sample price data...');
  console.log('🔄 Watch the dashboard update in real-time!\n');
  
  let price = 1.0;
  let count = 0;
  const maxCount = DEMO_DURATION / 2000; // 2 second intervals
  
  const interval = setInterval(() => {
    count++;
    
    // Simulate price movement with occasional bounces
    const change = (Math.random() - 0.5) * 0.1;
    price = Math.max(0.5, Math.min(2.0, price + change));
    
    // Random volume spike
    const baseVolume = 1000000;
    const volumeMultiplier = Math.random() > 0.8 ? 2.5 : 1.0;
    const volume = baseVolume * volumeMultiplier;
    
    // Send price update
    const priceData = {
      type: 'price',
      symbol: 'MEME',
      price: parseFloat(price.toFixed(4)),
      volume: Math.floor(volume)
    };
    
    ws.send(JSON.stringify(priceData));
    
    console.log(`📈 Tick ${count}/${maxCount}: Price=$${priceData.price.toFixed(4)}, Volume=${(priceData.volume / 1000000).toFixed(2)}M`);
    
    if (count >= maxCount) {
      clearInterval(interval);
      console.log('\n✅ Demo complete!');
      console.log('📊 Check the dashboard for accumulated signals and metrics\n');
      
      setTimeout(() => {
        ws.close();
        process.exit(0);
      }, 2000);
    }
  }, 2000);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Demo stopped by user');
  ws.close();
  process.exit(0);
});
