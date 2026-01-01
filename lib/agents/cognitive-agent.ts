/**
 * Cognitive Assistance Agent
 * Explains why content was flagged
 * Provides human-readable reasoning
 */

import { DetectionResult, DecisionResult, CognitiveExplanation, ResultClassification } from './types';

export class CognitiveAssistanceAgent {
  name = 'Cognitive Assistance Agent';

  /**
   * Generate human-readable explanation
   */
  async process(
    detectionResult: DetectionResult,
    decisionResult: DecisionResult
  ): Promise<CognitiveExplanation> {
    const summary = this.generateSummary(decisionResult);
    const keyFindings = this.extractKeyFindings(detectionResult, decisionResult);
    const artifacts = this.describeArtifacts(detectionResult);
    const recommendations = this.generateRecommendations(decisionResult);

    return {
      summary,
      keyFindings,
      artifacts,
      recommendations,
    };
  }

  /**
   * Generate summary statement
   */
  private generateSummary(decisionResult: DecisionResult): string {
    const { classification, authenticity, confidence } = decisionResult;

    switch (classification) {
      case 'REAL':
        return `Content appears to be authentic with ${authenticity.toFixed(0)}% confidence. No significant deepfake indicators detected.`;

      case 'FAKE':
        return `Content shows strong signs of manipulation. Deepfake probability: ${(100 - authenticity).toFixed(0)}%. Recommend further verification.`;

      case 'UNCERTAIN':
        return `Analysis is inconclusive. Authenticity score: ${authenticity.toFixed(0)}%. Additional context or expert review recommended.`;

      default:
        return 'Analysis complete. See details below.';
    }
  }

  /**
   * Extract key findings from analysis
   */
  private extractKeyFindings(
    detectionResult: DetectionResult,
    decisionResult: DecisionResult
  ): string[] {
    const findings: string[] = [];

    // Processing metrics
    if (detectionResult.mediaType === 'video' && detectionResult.frameCount) {
      findings.push(`Analyzed ${detectionResult.frameCount} video frames in ${detectionResult.inferenceTimeMs}ms`);
    } else if (detectionResult.mediaType === 'audio' && detectionResult.audioSampleCount) {
      findings.push(`Analyzed ${detectionResult.audioSampleCount} audio samples in ${detectionResult.inferenceTimeMs}ms`);
    }

    // Authenticity score
    findings.push(`Authenticity score: ${decisionResult.authenticity.toFixed(1)}%`);

    // Confidence level
    const confidenceLevel = this.getConfidenceLevel(decisionResult.confidence);
    findings.push(`Detection confidence: ${confidenceLevel} (${decisionResult.confidence.toFixed(0)}%)`);

    // Risk assessment
    findings.push(`Risk level: ${decisionResult.riskLevel}`);

    return findings;
  }

  /**
   * Describe detected artifacts
   */
  private describeArtifacts(detectionResult: DetectionResult): string[] {
    const artifacts: string[] = [];

    if (detectionResult.mediaType === 'video') {
      if (detectionResult.features.lipSyncMismatch) {
        artifacts.push('Lip-sync mismatch detected between audio and visual');
      }

      if (detectionResult.features.ganArtifacts) {
        artifacts.push('GAN-generated artifacts detected (eye blinking, texture anomalies)');
      }

      if (detectionResult.features.compressionAnomalies) {
        artifacts.push('Unusual compression patterns detected (possible re-encoding)');
      }
    }

    if (detectionResult.mediaType === 'audio') {
      if (detectionResult.features.frequencyAnomalies) {
        artifacts.push('Frequency anomalies detected (synthetic speech characteristics)');
      }
    }

    if (artifacts.length === 0) {
      artifacts.push('No significant artifacts detected');
    }

    return artifacts;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(decisionResult: DecisionResult): string[] {
    const recommendations: string[] = [];

    switch (decisionResult.classification) {
      case 'REAL':
        recommendations.push('Content appears authentic. Safe to use.');
        recommendations.push('Archive this verification for audit trail.');
        break;

      case 'FAKE':
        recommendations.push('Content is likely manipulated. Do not use or distribute.');
        recommendations.push('Consider reporting to relevant authorities.');
        recommendations.push('Flag for further forensic analysis if needed.');
        break;

      case 'UNCERTAIN':
        recommendations.push('Seek additional verification through alternative methods.');
        recommendations.push('Consider expert review or manual inspection.');
        recommendations.push('Use with caution pending further analysis.');
        break;
    }

    return recommendations;
  }

  /**
   * Convert confidence percentage to human-readable level
   */
  private getConfidenceLevel(confidence: number): string {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 50) return 'Medium';
    if (confidence >= 25) return 'Low';
    return 'Very Low';
  }
}
