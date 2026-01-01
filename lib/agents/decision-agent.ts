/**
 * Decision Agent
 * Aggregates detection results and computes authenticity score
 * Classifies output: REAL / FAKE / UNCERTAIN
 */

import { DetectionResult, DecisionResult, ResultClassification, RiskLevel } from './types';

export class DecisionAgent {
  name = 'Decision Agent';

  /**
   * Main decision pipeline
   */
  async process(detectionResult: DetectionResult): Promise<DecisionResult> {
    const startTime = Date.now();

    // Step 1: Aggregate raw scores
    const aggregatedScore = this.aggregateScores(detectionResult.rawScores);

    // Step 2: Apply feature weights
    const featureWeight = this.calculateFeatureWeight(detectionResult.features);

    // Step 3: Compute final authenticity score
    const authenticity = this.computeAuthenticity(aggregatedScore, featureWeight);

    // Step 4: Calculate deepfake probability
    const deepfakeProbability = 100 - authenticity;

    // Step 5: Classify result
    const classification = this.classify(authenticity, deepfakeProbability);

    // Step 6: Determine risk level
    const riskLevel = this.determineRiskLevel(deepfakeProbability, detectionResult.features);

    // Step 7: Calculate confidence
    const confidence = this.calculateConfidence(aggregatedScore, detectionResult.rawScores);

    const processingTimeMs = Date.now() - startTime;

    return {
      authenticity,
      classification,
      riskLevel,
      confidence,
      deepfakeProbability,
      processingTimeMs,
    };
  }

  /**
   * Aggregate raw model scores
   */
  private aggregateScores(scores: number[]): number {
    if (scores.length === 0) return 0.5;

    // Use weighted average (prioritize later frames/samples)
    const weighted = scores.map((score, i) => {
      const weight = 1 + (i / scores.length) * 0.5; // Later scores weighted higher
      return score * weight;
    });

    const sum = weighted.reduce((a, b) => a + b, 0);
    const totalWeight = scores.length * 1.25; // Average weight

    return sum / totalWeight;
  }

  /**
   * Calculate feature-based weight adjustments
   */
  private calculateFeatureWeight(features: any): number {
    let weight = 1.0;

    // Strong indicators of deepfake
    if (features.lipSyncMismatch) weight *= 1.3;
    if (features.ganArtifacts) weight *= 1.25;
    if (features.compressionAnomalies) weight *= 1.15;
    if (features.frequencyAnomalies) weight *= 1.2;

    return Math.min(weight, 2.0); // Cap at 2x
  }

  /**
   * Compute final authenticity score (0-100%)
   */
  private computeAuthenticity(aggregatedScore: number, featureWeight: number): number {
    // Lower raw scores = more likely real
    // Apply feature weight to adjust confidence
    const adjustedScore = aggregatedScore * featureWeight;

    // Convert to authenticity (inverse of deepfake probability)
    const authenticity = (1 - adjustedScore) * 100;

    return Math.max(0, Math.min(100, authenticity));
  }

  /**
   * Classify result as REAL / FAKE / UNCERTAIN
   */
  private classify(authenticity: number, deepfakeProbability: number): ResultClassification {
    // High authenticity = REAL
    if (authenticity >= 75) {
      return 'REAL';
    }

    // High deepfake probability = FAKE
    if (deepfakeProbability >= 75) {
      return 'FAKE';
    }

    // Otherwise = UNCERTAIN
    return 'UNCERTAIN';
  }

  /**
   * Determine risk level based on deepfake probability and features
   */
  private determineRiskLevel(deepfakeProbability: number, features: any): RiskLevel {
    // Multiple strong indicators = HIGH risk
    const strongIndicators = [
      features.lipSyncMismatch,
      features.ganArtifacts,
      features.compressionAnomalies,
      features.frequencyAnomalies,
    ].filter(Boolean).length;

    if (deepfakeProbability >= 60 && strongIndicators >= 2) {
      return 'HIGH';
    }

    if (deepfakeProbability >= 40 || strongIndicators >= 1) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  /**
   * Calculate confidence in the decision
   */
  private calculateConfidence(aggregatedScore: number, scores: number[]): number {
    if (scores.length === 0) return 0;

    // Confidence based on:
    // 1. Consistency of scores (low variance = high confidence)
    // 2. Distance from decision boundary (50%)

    const mean = aggregatedScore;
    const variance = scores.reduce((sum, score) => {
      return sum + Math.pow(score - mean, 2);
    }, 0) / scores.length;

    const consistency = Math.max(0, 1 - variance);
    const distanceFromBoundary = Math.abs(mean - 0.5) * 2; // 0-1 scale

    const confidence = (consistency * 0.5 + distanceFromBoundary * 0.5) * 100;

    return Math.max(0, Math.min(100, confidence));
  }
}
