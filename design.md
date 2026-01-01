# VERISIGHT-AI Mobile App Design

## Overview
VERISIGHT-AI is a tactical, field-operative deepfake detection app for national security and digital integrity. The interface follows **iOS Human Interface Guidelines** with high-contrast, minimal design optimized for **mobile portrait (9:16)** and **one-handed usage**.

---

## Screen List

### 1. **Launch / Authentication Screen**
- PIN entry (6-digit code)
- Biometric unlock option (Face ID / Fingerprint)
- "AUTHENTICATE" button
- Minimal branding with VERISIGHT-AI logo

### 2. **Home / Mission Dashboard**
- Mission status indicator
- Quick action buttons:
  - "INITIALIZE SCAN" (green)
  - "ANALYZE FOOTAGE" (green)
  - "ANALYZE AUDIO" (green)
- Recent analysis history (compact list)
- Settings icon (top-right)

### 3. **Capture / Upload Screen**
- Large circular record/capture button (red for video, blue for audio)
- File upload option
- Camera preview area
- "CANCEL" and "PROCEED" buttons
- Status indicator: "SECURE CAPTURE ACTIVE"

### 4. **Analysis Processing Screen**
- Large progress indicator (circular, animated)
- Processing status text (e.g., "INGESTING MEDIA", "DETECTION AGENT", "DECISION AGENT")
- Real-time metrics display:
  - Frame count
  - Audio samples analyzed
  - Inference time
- "ABORT ANALYSIS" button (red)

### 5. **Result Screen**
- Large circular authenticity score (0–100%)
- Color-coded result:
  - **Green circle** = VERIFIED REAL
  - **Red circle** = VERIFIED FAKE
  - **Yellow circle** = UNCERTAIN
- Detection summary:
  - Deepfake probability
  - Risk level (Low / Medium / High)
  - Confidence score
- "DETECTION SUMMARY" section with key findings
- "ARCHIVE LOG" button (green)
- "NEW SCAN" button

### 6. **Verification Log Screen**
- List of past analyses
- Each entry shows:
  - Timestamp
  - Result (REAL / FAKE / UNCERTAIN)
  - Confidence score
  - File type (Video / Audio)
- Tap to view detailed report
- Export/share options

### 7. **Settings Screen**
- Account section
- Operational settings:
  - Detection sensitivity (slider)
  - Offline mode toggle
  - Data storage options
- Security section:
  - Privacy & Security
  - Biometric settings
  - Signed mode toggle
- About section

---

## Primary Content and Functionality

### Authentication Flow
- **Entry**: PIN + biometric unlock
- **Security**: Role-Based Access Control (RBAC) for operator roles
- **Persistence**: Secure local storage with encrypted credentials

### Detection Flow
1. **Capture/Upload**: User selects video or audio
2. **Ingestion**: App extracts frames (video) or MFCC features (audio)
3. **Detection Agent**: Runs on-device TFLite inference
4. **Decision Agent**: Aggregates results, computes authenticity score
5. **Cognitive Assistance Agent**: Generates human-readable explanations
6. **Result Display**: Shows score, risk level, and reasoning

### Result Display
- **Authenticity Score**: 0–100% (circular progress indicator)
- **Classification**: REAL / FAKE / UNCERTAIN
- **Risk Level**: Low / Medium / High (color-coded)
- **Explanation**: Text summary of detected artifacts (e.g., "Lip-sync mismatch detected", "GAN compression artifacts identified")

### Local Storage
- Secure storage of analysis results
- Signed verification logs
- Optional encrypted export

---

## Key User Flows

### Flow 1: Authenticate & Access Dashboard
1. User launches app
2. Enters 6-digit PIN
3. Confirms biometric (Face ID / Fingerprint)
4. Dashboard loads with mission status

### Flow 2: Capture Video and Analyze
1. User taps "INITIALIZE SCAN"
2. Selects video capture or file upload
3. Records/uploads video
4. Taps "PROCEED"
5. App processes (shows progress)
6. Result screen displays authenticity score
7. User taps "ARCHIVE LOG" to save

### Flow 3: Upload Audio and Analyze
1. User taps "ANALYZE AUDIO"
2. Selects audio file or records
3. Taps "PROCEED"
4. App extracts MFCC features and runs inference
5. Result screen shows audio deepfake probability
6. User reviews explanation

### Flow 4: View Verification Log
1. User navigates to Verification Log
2. Scrolls through past analyses
3. Taps entry to view detailed report
4. Optionally exports or shares report

### Flow 5: Adjust Settings
1. User taps Settings icon
2. Adjusts detection sensitivity
3. Toggles offline mode
4. Enables/disables biometric
5. Returns to dashboard

---

## Color Choices

### Brand Palette (Tactical / Security Theme)
- **Primary Green**: `#00FF00` (high contrast, field visibility)
- **Background Dark**: `#0D1117` (dark mode, low power)
- **Surface Dark**: `#1C2128` (card backgrounds)
- **Text Light**: `#E8EAED` (high contrast on dark)
- **Accent Red**: `#FF4444` (alerts, FAKE results)
- **Accent Yellow**: `#FFD700` (warnings, UNCERTAIN results)
- **Success Green**: `#00FF00` (REAL results)
- **Border**: `#30363D` (subtle dividers)

### Usage
- **Primary Green**: Buttons, active states, REAL indicators
- **Accent Red**: Alerts, FAKE indicators, abort buttons
- **Accent Yellow**: Warnings, UNCERTAIN indicators
- **Dark Background**: Full-screen backgrounds
- **Surface Dark**: Cards, modal backgrounds
- **Text Light**: All text for high contrast

---

## Interaction Patterns

### Buttons
- **Primary (Green)**: Large, high-contrast, haptic feedback on press
- **Secondary (Red)**: Destructive actions, abort, cancel
- **Tertiary**: Settings, navigation

### Indicators
- **Circular Progress**: Authenticity score, processing status
- **Status Text**: Real-time feedback (e.g., "DETECTION AGENT ACTIVE")
- **Color Coding**: Green (REAL), Red (FAKE), Yellow (UNCERTAIN)

### Haptics
- Light impact on button tap
- Success notification on analysis complete
- Error notification on failure

---

## Accessibility & Field Use
- **Large touch targets**: Minimum 44pt for buttons
- **High contrast**: Dark background + bright text/buttons
- **No small text**: Minimum 16pt for body text
- **One-handed layout**: Critical controls in lower half of screen
- **Minimal animations**: Tactical, no distracting effects
