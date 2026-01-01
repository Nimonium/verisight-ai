# VERISIGHT-AI Architecture

## Overview

VERISIGHT-AI is an offline-first, on-device deepfake detection application built with React Native and Expo. The system implements a multi-agent agentic architecture for autonomous deepfake detection without cloud dependency.

---

## Agentic Architecture

The application is built around three cooperating agents that work together to analyze media and provide authenticity verification:

### 1. Detection Agent

**Responsibility**: Extract features from media and run on-device inference

The Detection Agent handles the raw analysis of video and audio content:

- **Video Processing**: Extracts frames from video files, samples frames at regular intervals, and runs inference on each frame using a compressed TensorFlow Lite model (e.g., EfficientNet-Lite or Xception)
- **Audio Processing**: Extracts MFCC (Mel-Frequency Cepstral Coefficient) features from audio and runs inference using a CNN-based audio deepfake detector
- **Feature Detection**: Identifies potential deepfake indicators including lip-sync mismatches, GAN artifacts, compression anomalies, and frequency anomalies
- **Temporal Consistency**: Checks for inconsistencies across frames that suggest manipulation

**Key Methods**:
- `process()`: Main entry point that routes to video or audio processing
- `extractFrames()`: Extracts frames from video at regular intervals
- `extractMFCCFeatures()`: Extracts audio features for analysis
- `runVideoInference()`: Executes model inference on video frames
- `runAudioInference()`: Executes model inference on audio features
- `detectLipSyncMismatch()`: Analyzes audio-visual synchronization
- `detectGANArtifacts()`: Identifies characteristic GAN generation artifacts
- `detectCompressionAnomalies()`: Detects unusual compression patterns
- `detectFrequencyAnomalies()`: Identifies synthetic speech characteristics

### 2. Decision Agent

**Responsibility**: Aggregate detection results and make authenticity classification

The Decision Agent takes raw detection results and produces a final authenticity assessment:

- **Score Aggregation**: Combines raw model scores using weighted averaging, prioritizing later frames/samples
- **Feature Weighting**: Applies multiplicative weights based on detected artifacts (e.g., lip-sync mismatch increases weight by 1.3x)
- **Authenticity Scoring**: Converts weighted scores to a 0-100% authenticity scale
- **Classification**: Produces one of three classifications: REAL, FAKE, or UNCERTAIN
- **Risk Assessment**: Determines risk level (LOW, MEDIUM, HIGH) based on deepfake probability and artifact count
- **Confidence Calculation**: Computes confidence score based on score consistency and distance from decision boundary

**Key Methods**:
- `process()`: Main entry point that orchestrates the decision pipeline
- `aggregateScores()`: Combines raw model scores with temporal weighting
- `calculateFeatureWeight()`: Computes weight multiplier based on detected artifacts
- `computeAuthenticity()`: Produces final authenticity percentage
- `classify()`: Determines REAL/FAKE/UNCERTAIN classification
- `determineRiskLevel()`: Assesses risk based on probability and indicators
- `calculateConfidence()`: Computes confidence in the decision

### 3. Cognitive Assistance Agent

**Responsibility**: Generate human-readable explanations of analysis results

The Cognitive Assistance Agent provides transparent, explainable feedback:

- **Summary Generation**: Creates a concise summary of the analysis result
- **Key Findings Extraction**: Identifies and lists the most important findings
- **Artifact Description**: Provides human-readable descriptions of detected artifacts
- **Recommendation Generation**: Suggests next steps based on the classification

**Key Methods**:
- `process()`: Main entry point that generates complete explanation
- `generateSummary()`: Creates summary statement based on classification
- `extractKeyFindings()`: Identifies key metrics and findings
- `describeArtifacts()`: Provides human-readable artifact descriptions
- `generateRecommendations()`: Suggests appropriate actions based on result

### Analysis Orchestrator

The **AnalysisOrchestrator** coordinates all three agents and manages the complete analysis pipeline:

```
Input Media
    ↓
Detection Agent (extract features, run inference)
    ↓
Decision Agent (aggregate results, classify)
    ↓
Cognitive Assistance Agent (generate explanation)
    ↓
AnalysisResult (complete analysis with all metadata)
```

---

## Data Flow

### Analysis Result Structure

```typescript
interface AnalysisResult {
  id: string;                    // Unique analysis ID
  timestamp: number;             // When analysis was performed
  mediaType: 'video' | 'audio';  // Type of media analyzed
  fileName: string;              // Original filename
  fileSizeBytes: number;         // File size in bytes
  
  detection: DetectionResult;    // Raw detection output
  decision: DecisionResult;      // Aggregated decision
  explanation: CognitiveExplanation; // Human-readable explanation
}
```

### Detection Result

```typescript
interface DetectionResult {
  mediaType: 'video' | 'audio';
  frameCount?: number;           // For video
  audioSampleCount?: number;     // For audio
  inferenceTimeMs: number;       // Processing time
  rawScores: number[];           // Model output scores (0-1)
  features: {
    lipSyncMismatch?: boolean;
    ganArtifacts?: boolean;
    compressionAnomalies?: boolean;
    frequencyAnomalies?: boolean;
  };
}
```

### Decision Result

```typescript
interface DecisionResult {
  authenticity: number;          // 0-100%
  classification: 'REAL' | 'FAKE' | 'UNCERTAIN';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;            // 0-100%
  deepfakeProbability: number;   // 0-100%
  processingTimeMs: number;
}
```

---

## State Management

### Authentication Context (`lib/auth-context.tsx`)

Manages user authentication with PIN and biometric support:

- **PIN Storage**: Securely stores 6-digit PIN using `expo-secure-store`
- **Biometric Support**: Enables Face ID / Fingerprint unlock on supported devices
- **Session Management**: Tracks authentication state across app lifecycle

### Analysis Context (`lib/analysis-context.tsx`)

Manages analysis state and history:

- **Current Analysis**: Stores the most recent analysis result
- **Analysis History**: Maintains list of past analyses (persisted to AsyncStorage)
- **Progress Tracking**: Tracks analysis progress (0-100%) and status messages
- **History Persistence**: Automatically saves and loads analysis history

---

## UI Screens

### Authentication Screen (`app/auth.tsx`)

Tactical PIN entry interface with numeric keypad:

- 6-digit PIN entry with visual feedback
- Backspace and clear functionality
- Auto-submit on complete PIN entry
- High-contrast design (green on black)
- Haptic feedback on interactions

### Home / Mission Dashboard (`app/(tabs)/index.tsx`)

Main interface showing system status and quick actions:

- System status indicator
- Quick action buttons (Initialize Scan, Analyze Footage, Analyze Audio)
- Recent analysis history with color-coded results
- Logout functionality
- Empty state messaging

### Capture / Upload Screen (`app/capture.tsx`)

Media selection and upload interface:

- File picker for video or audio
- Selected file information display
- Offline mode indicator
- Analysis progress tracking
- Cancel and proceed buttons

### Result Screen (`app/result/[id].tsx`)

Comprehensive analysis result display:

- Large circular authenticity score indicator
- Color-coded classification badge
- Detection summary with metrics
- Key findings list
- Detected artifacts description
- Human-readable explanation
- Recommendations
- File information
- New scan and back buttons

---

## Security Implementation

### Authentication

- **PIN-Based Access**: 6-digit PIN stored securely in `expo-secure-store`
- **Biometric Support**: Optional Face ID / Fingerprint unlock
- **Session Management**: Automatic logout on app background (future enhancement)

### Data Storage

- **Local-Only Storage**: All analysis results stored locally using AsyncStorage
- **Encrypted Storage**: Sensitive data encrypted using platform-provided secure storage
- **No Cloud Transmission**: Complete offline-first operation, no external data transmission

### Signed Verification Logs

- **Analysis Logging**: Each analysis result includes unique ID and timestamp
- **Audit Trail**: Complete history of all analyses for verification purposes
- **Future Enhancement**: Signed logs for tamper-proof verification

---

## Model Integration (PoC)

### Current Implementation

The current implementation uses **mock models** for demonstration purposes. Production deployment would integrate:

### Video Deepfake Detection

- **Model**: EfficientNet-Lite or Xception (compressed for edge devices)
- **Input**: RGB video frames (640×480)
- **Output**: Binary classification (Real/Fake) with confidence score
- **Optimization**: Quantized to 8-bit for reduced memory footprint

### Audio Deepfake Detection

- **Model**: CNN-based audio classifier
- **Input**: MFCC features (13 coefficients, 100 time steps)
- **Output**: Binary classification with confidence score
- **Optimization**: Lightweight architecture for real-time processing

### Integration Points

- **Detection Agent**: `runVideoInference()` and `runAudioInference()` methods
- **TensorFlow Lite Runtime**: Integrated via Expo or native modules
- **Model Loading**: On-device model bundled with app

---

## Performance Considerations

### Optimization Strategies

- **Frame Sampling**: Analyzes every 5th frame to reduce computation
- **Model Quantization**: 8-bit quantized models for reduced memory
- **Batch Processing**: Future enhancement for GPU acceleration
- **Caching**: Model loaded once on app startup

### Resource Usage

- **Memory**: ~200-300MB for models + runtime
- **Processing Time**: 1-3 seconds for typical video clip (30 frames)
- **Battery Impact**: Minimal on modern devices with efficient models

---

## Limitations & Future Enhancements

### Current Limitations

- **Mock Models**: Current implementation uses simulated inference for PoC
- **Limited Artifact Detection**: Simplified feature extraction
- **No Real-Time Processing**: Analysis requires complete file upload
- **Single File Analysis**: Batch processing not yet implemented

### Future Enhancements

- **Real TensorFlow Lite Models**: Integrate production-grade deepfake detection models
- **Real-Time Streaming**: Support live video/audio analysis
- **Multi-Model Ensemble**: Combine multiple detection approaches for higher accuracy
- **Cloud Sync (Optional)**: Optional cloud backup with end-to-end encryption
- **Advanced Explainability**: More detailed artifact visualization
- **Batch Processing**: Analyze multiple files in sequence
- **GPU Acceleration**: Leverage device GPU for faster inference
- **Model Updates**: Over-the-air model updates with signature verification

---

## Testing Strategy

### Unit Tests

- Agent logic (Detection, Decision, Cognitive)
- Score aggregation and classification
- Explanation generation

### Integration Tests

- Complete analysis pipeline
- Context providers and state management
- Navigation flows

### UI Tests

- Screen rendering
- User interactions
- State updates

### Performance Tests

- Model inference time
- Memory usage
- Battery impact

---

## Deployment Notes

### Build Requirements

- Expo SDK 54+
- React Native 0.81+
- Node.js 18+
- pnpm package manager

### Platform Support

- **iOS**: 13.4+ (iPhone 6s and later)
- **Android**: 8.0+ (API level 26)
- **Web**: Modern browsers (development only)

### Build Commands

```bash
# Development
pnpm dev

# Production build
eas build --platform ios
eas build --platform android
```

---

## References

- **TensorFlow Lite**: https://www.tensorflow.org/lite
- **Expo Documentation**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **Deepfake Detection Research**: Academic literature on deepfake detection techniques
