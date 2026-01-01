# VERISIGHT-AI: On-Device Deepfake Detection

**VERISIGHT-AI** is an offline-first, field-operative deepfake detection application for national security and digital integrity. It runs entirely on-device using edge AI, with no cloud dependency or external data transmission.

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

```bash
cd verisight-ai
pnpm install
pnpm dev
```

### First Use

1. **Launch App**: Open the app on your device or simulator
2. **Set PIN**: Enter a 6-digit PIN on the authentication screen
3. **Access Dashboard**: After authentication, you'll see the Mission Dashboard
4. **Capture Media**: Tap "INITIALIZE SCAN" to upload video or audio
5. **View Results**: Analysis results display authenticity score and explanation

---

## Features

### Core Capabilities

**On-Device Inference**: All deepfake detection runs locally without cloud transmission

**Multi-Agent Architecture**: Detection, Decision, and Cognitive Assistance agents work together for transparent analysis

**Offline-First Operation**: Complete functionality without internet connection

**Tactical UI**: High-contrast, minimalist interface optimized for field use and one-handed operation

**Secure Authentication**: PIN-based access with optional biometric unlock

**Analysis History**: Local storage of all past analyses for audit trail

### Supported Media

- **Video**: MP4, MOV, WebM formats
- **Audio**: MP3, WAV, M4A formats

---

## Architecture Overview

### Three-Agent System

**Detection Agent**: Extracts features from media and runs on-device inference
- Samples video frames at regular intervals
- Extracts MFCC features from audio
- Detects artifacts: lip-sync mismatches, GAN artifacts, compression anomalies, frequency anomalies

**Decision Agent**: Aggregates detection results and produces authenticity classification
- Combines raw model scores with temporal weighting
- Applies feature-based weight adjustments
- Classifies as REAL, FAKE, or UNCERTAIN
- Determines risk level (LOW, MEDIUM, HIGH)

**Cognitive Assistance Agent**: Generates human-readable explanations
- Summarizes analysis results
- Lists key findings
- Describes detected artifacts
- Provides recommendations

### Data Flow

```
Media Upload
    ↓
Detection Agent (extract features, run inference)
    ↓
Decision Agent (aggregate, classify, assess risk)
    ↓
Cognitive Assistance Agent (explain, recommend)
    ↓
Result Display (score, classification, explanation)
    ↓
Local Storage (audit trail)
```

---

## User Interface

### Authentication Screen

Secure PIN entry with numeric keypad. Supports biometric unlock on compatible devices.

**Default PIN for Demo**: Set during first launch

### Mission Dashboard

Main interface showing system status and quick actions:
- System status indicator (SYSTEM ACTIVE)
- Quick action buttons (INITIALIZE SCAN, FOOTAGE, AUDIO)
- Recent analysis history with color-coded results
- Settings access

### Capture Screen

Upload or capture media for analysis:
- File picker for video or audio
- Selected file information
- Offline mode indicator
- Proceed to analysis

### Result Screen

Comprehensive analysis display:
- **Authenticity Score**: Large circular indicator (0-100%)
- **Classification**: VERIFIED REAL (green), VERIFIED FAKE (red), or UNCERTAIN (yellow)
- **Detection Summary**: Deepfake probability, confidence, risk level
- **Key Findings**: Bullet-point summary of analysis
- **Detected Artifacts**: Specific indicators found
- **Explanation**: Human-readable summary
- **Recommendations**: Suggested next steps
- **File Information**: Metadata about analyzed file

---

## Security & Privacy

### Authentication

- **PIN-Based**: 6-digit PIN stored securely
- **Biometric**: Optional Face ID / Fingerprint unlock
- **Secure Storage**: Uses platform-provided secure storage (Keychain on iOS, Keystore on Android)

### Data Storage

- **Local-Only**: All analysis results stored on device
- **No Cloud Transmission**: Complete offline operation
- **AsyncStorage**: Encrypted local storage for analysis history
- **Audit Trail**: Signed verification logs for tamper-proof verification

### No External Dependencies

- No API keys required
- No cloud services
- No user tracking
- No data collection

---

## Analysis Results

### Authenticity Score (0-100%)

- **75-100%**: REAL - Content appears authentic
- **50-74%**: UNCERTAIN - Inconclusive analysis
- **0-49%**: FAKE - Content shows manipulation signs

### Risk Levels

- **LOW**: Authenticity score high, no strong indicators
- **MEDIUM**: Mixed indicators or moderate deepfake probability
- **HIGH**: Multiple strong indicators or high deepfake probability

### Confidence Score

Indicates how confident the system is in its decision:
- **90-100%**: Very High
- **75-89%**: High
- **50-74%**: Medium
- **25-49%**: Low
- **0-24%**: Very Low

---

## Detected Artifacts

### Video Artifacts

- **Lip-Sync Mismatch**: Audio and visual don't align
- **GAN Artifacts**: Characteristic patterns from generative models
- **Compression Anomalies**: Unusual re-encoding patterns
- **Temporal Inconsistency**: Frame-to-frame variations suggesting manipulation

### Audio Artifacts

- **Frequency Anomalies**: Synthetic speech characteristics
- **Spectral Anomalies**: Unusual frequency distributions

---

## Current Limitations

**PoC Implementation**: Current version uses simulated inference for demonstration

**Mock Models**: Production deployment requires integration of actual TensorFlow Lite models

**No Real-Time Processing**: Analysis requires complete file upload

**Simplified Feature Detection**: Artifact detection is illustrative

---

## Future Enhancements

**Production Models**: Integration of state-of-the-art deepfake detection models

**Real-Time Streaming**: Support for live video/audio analysis

**Multi-Model Ensemble**: Combine multiple detection approaches

**Cloud Sync (Optional)**: Optional encrypted cloud backup

**Advanced Explainability**: Detailed artifact visualization

**Batch Processing**: Analyze multiple files sequentially

**GPU Acceleration**: Leverage device GPU for faster inference

**Model Updates**: Over-the-air model updates with signature verification

---

## Development

### Project Structure

```
verisight-ai/
├── app/                          # App screens and routing
│   ├── _layout.tsx              # Root layout with providers
│   ├── auth.tsx                 # Authentication screen
│   ├── capture.tsx              # Media capture/upload
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation
│   │   └── index.tsx            # Home/Dashboard screen
│   └── result/
│       └── [id].tsx             # Result detail screen
├── lib/
│   ├── agents/                  # Agentic architecture
│   │   ├── types.ts             # Type definitions
│   │   ├── detection-agent.ts   # Detection agent
│   │   ├── decision-agent.ts    # Decision agent
│   │   ├── cognitive-agent.ts   # Cognitive assistance agent
│   │   └── analysis-orchestrator.ts # Orchestrator
│   ├── auth-context.tsx         # Authentication context
│   ├── analysis-context.tsx     # Analysis state management
│   └── utils.ts                 # Utility functions
├── components/                  # Reusable components
├── assets/                      # App icons and images
├── design.md                    # UI/UX design document
├── ARCHITECTURE.md              # Detailed architecture
└── README_VERISIGHT.md          # This file
```

### Key Files

- **Agent System**: `lib/agents/` - Core agentic architecture
- **UI Screens**: `app/` - All user-facing screens
- **State Management**: `lib/*-context.tsx` - Authentication and analysis state
- **Design**: `design.md` - UI/UX specifications

### Running Locally

```bash
# Start development server
pnpm dev

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web (development only)
pnpm dev:metro

# Type checking
pnpm check

# Linting
pnpm lint

# Testing
pnpm test
```

---

## Testing

### Manual Testing Checklist

- [ ] Authentication flow (PIN entry and biometric)
- [ ] Dashboard display and navigation
- [ ] File upload and selection
- [ ] Analysis processing and progress
- [ ] Result display and formatting
- [ ] Analysis history persistence
- [ ] Logout and re-authentication
- [ ] Offline functionality

### Test Data

Sample test files can be created using:
- **Video**: Any MP4/MOV file (short clips recommended for faster processing)
- **Audio**: Any MP3/WAV file (speech samples recommended)

---

## Deployment

### Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build
```

### Platform Requirements

- **iOS**: 13.4+ (iPhone 6s and later)
- **Android**: 8.0+ (API level 26)
- **Minimum**: 200MB free storage for models and app

---

## Troubleshooting

### App Won't Start

- Clear Expo cache: `expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node.js version: `node --version` (should be 18+)

### Analysis Fails

- Ensure file is in supported format (MP4, MOV, MP3, WAV, M4A)
- Check file size (recommend < 100MB for optimal performance)
- Verify device has sufficient free storage

### Biometric Not Working

- Ensure device has biometric capability enabled
- Grant app permission to use Face ID / Fingerprint
- Try PIN authentication as fallback

### Performance Issues

- Reduce video resolution or file size
- Close other apps to free memory
- Restart device if needed

---

## Support & Feedback

For issues, feature requests, or feedback:

1. Check ARCHITECTURE.md for technical details
2. Review design.md for UI/UX specifications
3. Consult troubleshooting section above

---

## License & Attribution

VERISIGHT-AI is developed for demonstration and educational purposes.

### Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: React Native development platform
- **TypeScript**: Type-safe JavaScript
- **TensorFlow Lite**: Edge AI inference (production)
- **NativeWind**: Tailwind CSS for React Native

---

## Disclaimer

**Accuracy Limitations**: This is a proof-of-concept system. Current implementation uses simulated inference. Production deployment requires rigorous validation with real deepfake detection models.

**No 100% Accuracy**: Deepfake detection is an ongoing research challenge. No system can guarantee 100% accuracy. Always use in conjunction with other verification methods.

**Responsible Use**: This tool is designed for legitimate security and verification purposes. Use responsibly and in accordance with applicable laws and regulations.

---

## Next Steps

1. **Set Up Development Environment**: Follow Quick Start section
2. **Explore Architecture**: Read ARCHITECTURE.md for technical details
3. **Review Design**: Check design.md for UI/UX specifications
4. **Test Flows**: Manually test all user flows
5. **Integrate Real Models**: Replace mock inference with production TensorFlow Lite models
6. **Deploy**: Build and deploy to iOS/Android using Expo

---

**Version**: 1.0.0 (PoC)  
**Last Updated**: January 2026  
**Status**: Proof of Concept - Ready for Hackathon/Demo
