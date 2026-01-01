/**
 * Analysis Orchestrator
 * Coordinates Detection, Decision, and Cognitive Assistance agents
 * Manages the complete analysis pipeline
 */

import { DetectionAgent } from './detection-agent';
import { DecisionAgent } from './decision-agent';
import { CognitiveAssistanceAgent } from './cognitive-agent';
import { AnalysisResult, AnalysisContext, MediaType } from './types';
import * as Crypto from 'expo-crypto';

export class AnalysisOrchestrator {
  private detectionAgent: DetectionAgent;
  private decisionAgent: DecisionAgent;
  private cognitiveAgent: CognitiveAssistanceAgent;

  constructor() {
    this.detectionAgent = new DetectionAgent();
    this.decisionAgent = new DecisionAgent();
    this.cognitiveAgent = new CognitiveAssistanceAgent();
  }

  /**
   * Execute complete analysis pipeline
   */
  async analyze(context: AnalysisContext, fileName: string, fileSizeBytes: number): Promise<AnalysisResult> {
    const analysisId = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${fileName}-${Date.now()}-${Math.random()}`
    );

    try {
      // Phase 1: Detection Agent
      console.log('[ORCHESTRATOR] Starting Detection Agent...');
      const detectionResult = await this.detectionAgent.process(context);
      console.log('[ORCHESTRATOR] Detection Agent complete:', detectionResult);

      // Phase 2: Decision Agent
      console.log('[ORCHESTRATOR] Starting Decision Agent...');
      const decisionResult = await this.decisionAgent.process(detectionResult);
      console.log('[ORCHESTRATOR] Decision Agent complete:', decisionResult);

      // Phase 3: Cognitive Assistance Agent
      console.log('[ORCHESTRATOR] Starting Cognitive Assistance Agent...');
      const explanation = await this.cognitiveAgent.process(detectionResult, decisionResult);
      console.log('[ORCHESTRATOR] Cognitive Assistance Agent complete:', explanation);

      // Compile final result
      const analysisResult: AnalysisResult = {
        id: analysisId,
        timestamp: Date.now(),
        mediaType: context.mediaType,
        fileName,
        fileSizeBytes,
        detection: detectionResult,
        decision: decisionResult,
        explanation,
      };

      console.log('[ORCHESTRATOR] Analysis complete:', analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('[ORCHESTRATOR] Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Initialize all agents
   */
  async initialize(): Promise<void> {
    console.log('[ORCHESTRATOR] Initializing agents...');
    await this.detectionAgent.initialize();
    console.log('[ORCHESTRATOR] Agents initialized');
  }
}
