/**
 * VERISIGHT-AI Agent Architecture Types
 * Defines the core interfaces for Detection, Decision, and Cognitive Assistance agents
 */

export type MediaType = 'video' | 'audio';
export type ResultClassification = 'REAL' | 'FAKE' | 'UNCERTAIN';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Raw detection results from the Detection Agent
 */
export interface DetectionResult {
  mediaType: MediaType;
  frameCount?: number;
  audioSampleCount?: number;
  inferenceTimeMs: number;
  rawScores: number[]; // Raw model output scores
  features: {
    lipSyncMismatch?: boolean;
    ganArtifacts?: boolean;
    compressionAnomalies?: boolean;
    frequencyAnomalies?: boolean;
  };
}

/**
 * Aggregated decision from the Decision Agent
 */
export interface DecisionResult {
  authenticity: number; // 0-100%
  classification: ResultClassification;
  riskLevel: RiskLevel;
  confidence: number; // 0-100%
  deepfakeProbability: number; // 0-100%
  processingTimeMs: number;
}

/**
 * Human-readable explanation from the Cognitive Assistance Agent
 */
export interface CognitiveExplanation {
  summary: string;
  keyFindings: string[];
  artifacts: string[];
  recommendations: string[];
}

/**
 * Complete analysis result combining all agents
 */
export interface AnalysisResult {
  id: string;
  timestamp: number;
  mediaType: MediaType;
  fileName: string;
  fileSizeBytes: number;
  detection: DetectionResult;
  decision: DecisionResult;
  explanation: CognitiveExplanation;
}

/**
 * Agent interface for extensibility
 */
export interface Agent {
  name: string;
  process(input: any): Promise<any>;
}

/**
 * Analysis context passed between agents
 */
export interface AnalysisContext {
  mediaType: MediaType;
  mediaUri: string;
  mediaData?: Uint8Array;
  detectionResult?: DetectionResult;
  decisionResult?: DecisionResult;
}
