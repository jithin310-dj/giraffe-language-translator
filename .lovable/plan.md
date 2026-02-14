

# LinguaLite — Complete Implementation Plan

## Overview
A warm, offline-first multilingual comprehension app for rural and low-connectivity regions. Built as a **Native Android App** (via Capacitor) with all features from day one.

---

## Architecture & Translation Strategy

**Hybrid Approach:**
- **Online:** Use Lovable AI (Gemini) for high-quality, context-aware semantic translation — not word-by-word
- **Offline:** All past translations are cached locally. A built-in common phrases dictionary (greetings, healthcare terms, government notice phrases) provides basic offline translation
- **Smart sync:** When connectivity returns, quietly sync pending translations and update phrase packs

**Backend:** Lovable Cloud with edge functions for AI translation, OCR processing, and voice-to-text

---

## Pages & Screens

### 1. Welcome Screen
- App name "LinguaLite" with friendly tagline: *"Understand anything, in your language"*
- Warm illustration/icon, soft gradient background
- Single "Get Started" button

### 2. Language Selection Screen
- Large, friendly cards for each language: English, Hindi, Telugu, Tamil, Kannada, Malayalam
- Each card shows the language name in its own script
- Choice saved locally, remembered forever
- Can be changed later in Settings

### 3. Home Dashboard
- Clean grid with 4 large icon buttons:
  - 📝 **Translate Text**
  - 📷 **Scan Image**
  - 🎤 **Speak & Translate**
  - 📚 **Saved Translations**
- Connection status indicator (online/offline — subtle, non-intrusive)
- Settings gear icon in top corner

### 4. Text Translation Page
- Large text input area for typing/pasting
- Source language auto-detect or manual select
- Target language (user's preferred, changeable)
- Translate button
- Results show: original text + translated text side-by-side
- "Listen" button (text-to-speech) on the translation
- Save button to bookmark
- Adjustable text size

### 5. Image Scan Translation Page
- Camera viewfinder to capture printed text (notices, posters, documents)
- OCR extracts text from image (via Lovable AI when online)
- Extracted text shown for review, then translated
- Same output format as text translation
- Gallery option to pick existing photo

### 6. Voice Translation Page
- Large microphone button (tap to speak)
- Speech-to-text converts voice to text
- Recognized text displayed, then translated
- Listen button for the translation
- Works with natural speech in supported languages

### 7. Saved History Page
- List of all past translations, organized by date
- Search/filter capability
- Each entry shows: original snippet → translated snippet
- Tap to view full translation
- Works completely offline (stored locally)
- Delete/clear options

### 8. Settings Page
- Change preferred language
- Adjust text size (small / medium / large / extra large)
- Offline data management (clear cache, storage used)
- About section with app version

---

## Design & UX Principles

- **Soft, warm color palette** — gentle blues, warm whites, soft greens
- **Large touch targets** — minimum 48px buttons, big icons
- **Simple labels** — plain language, no jargon
- **High contrast text** — readable in bright sunlight
- **No login required** — all data on device
- **Offline-first indicators** — subtle badge showing connection status, never blocking the user

---

## Technical Highlights

- **Capacitor** for native Android packaging
- **Local storage** (localStorage/IndexedDB) for all cached translations and preferences
- **Lovable Cloud** edge functions for AI translation, OCR, and speech processing
- **Text-to-speech** using browser's built-in SpeechSynthesis API (works offline)
- **Speech-to-text** using Web Speech API (requires connectivity)
- **Minimal bundle size** — optimized for low-cost devices

