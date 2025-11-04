/**
 * ML-Powered Filtering Module
 * Uses machine learning algorithms to filter and classify trading signals
 */

export class MLFilter {
  constructor(config = {}) {
    this.config = {
      confidenceThreshold: config.confidenceThreshold || 0.7,
      learningRate: config.learningRate || 0.01,
      ...config
    };
    this.model = {
      weights: {},
      bias: 0,
      trainingData: []
    };
    this.predictions = [];
  }

  /**
   * Extract features from signal data
   */
  extractFeatures(signal) {
    return {
      bouncePercent: parseFloat(signal.bouncePercent) || 0,
      volumeRatio: parseFloat(signal.volumeRatio) || 0,
      strength: signal.strength || 0,
      priceChange: signal.priceChange || 0,
      momentum: signal.momentum || 0
    };
  }

  /**
   * Simple logistic regression prediction
   */
  predict(signal) {
    const features = this.extractFeatures(signal);
    let score = this.model.bias;

    for (const [key, value] of Object.entries(features)) {
      const weight = this.model.weights[key] || 0;
      score += weight * value;
    }

    // Sigmoid activation
    const probability = 1 / (1 + Math.exp(-score));
    
    const prediction = {
      signal,
      probability,
      confidence: probability,
      shouldTrade: probability >= this.config.confidenceThreshold,
      timestamp: Date.now()
    };

    this.predictions.push(prediction);
    return prediction;
  }

  /**
   * Train the model with labeled data
   */
  train(signals, labels) {
    if (signals.length !== labels.length) {
      throw new Error('Signals and labels must have the same length');
    }

    this.model.trainingData.push(...signals.map((signal, i) => ({
      signal,
      label: labels[i]
    })));

    // Simple gradient descent
    for (let i = 0; i < signals.length; i++) {
      const features = this.extractFeatures(signals[i]);
      
      // Calculate prediction without side effects
      let score = this.model.bias;
      for (const [key, value] of Object.entries(features)) {
        const weight = this.model.weights[key] || 0;
        score += weight * value;
      }
      const probability = 1 / (1 + Math.exp(-score));
      
      const error = labels[i] - probability;

      // Update weights
      for (const [key, value] of Object.entries(features)) {
        if (!this.model.weights[key]) {
          this.model.weights[key] = Math.random() * 0.1 - 0.05;
        }
        this.model.weights[key] += this.config.learningRate * error * value;
      }

      // Update bias
      this.model.bias += this.config.learningRate * error;
    }
  }

  /**
   * Filter signals based on ML prediction
   */
  filterSignals(signals) {
    return signals
      .map(signal => this.predict(signal))
      .filter(pred => pred.shouldTrade)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get model performance metrics
   */
  getMetrics() {
    if (this.predictions.length === 0) {
      return null;
    }

    const avgConfidence = this.predictions.reduce((sum, p) => sum + p.confidence, 0) / this.predictions.length;
    const tradedCount = this.predictions.filter(p => p.shouldTrade).length;

    return {
      totalPredictions: this.predictions.length,
      avgConfidence: avgConfidence.toFixed(3),
      tradedSignals: tradedCount,
      filterRate: ((1 - tradedCount / this.predictions.length) * 100).toFixed(2) + '%'
    };
  }

  /**
   * Reset model
   */
  reset() {
    this.model = {
      weights: {},
      bias: 0,
      trainingData: []
    };
    this.predictions = [];
  }
}

export default MLFilter;
