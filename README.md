# 📖 StoryTime AI

An interactive AI-powered children's storybook that generates illustrations, reads stories aloud, and lets kids ask questions about the story — all in real time.

**[Live Demo →](#)** <!-- Vercel URL -->

![StoryTime AI Screenshot](#) <!-- screenshot -->

---

## What It Does

StoryTime AI combines four AI-powered features into a seamless reading experience for children:

- **AI Illustrations** — Generates a unique image for each story page using Google's Imagen 4 model, loaded lazily as the reader turns pages
- **Read Aloud** — Converts story text to natural speech using Gemini's TTS model, decoded and played through the Web Audio API
- **Voice Recording** — Parents or kids can record their own narration for each page, replacing the AI voice with a personal one
- **Ask Sparky** — A friendly AI chatbot companion (powered by Gemini 2.5 Flash) that answers questions about the story in a fun, child-appropriate way

---

## Tech Stack

- **React + TypeScript** with Vite
- **Google Gemini 2.5 Flash** — chat and TTS (text-to-speech)
- **Google Imagen 4** — per-page illustration generation
- **Web Audio API** — manual PCM audio decoding and playback
- **MediaRecorder API** — in-browser voice recording with memory management

---

## Technical Highlights

**Raw audio decoding** — Gemini's TTS returns base64-encoded PCM audio. Rather than using a simple `<audio>` tag, the app manually decodes the bytes into an `AudioBuffer` and plays it through the Web Audio API, giving precise control over playback.

**Lazy image generation** — Images are only generated when a page is visited, avoiding unnecessary API calls and keeping the initial load fast.

**Memory-safe recording** — Voice recordings use `URL.createObjectURL` for playback and properly call `URL.revokeObjectURL` when recordings are deleted or replaced, preventing memory leaks.

**Multi-state UI controls** — The recording button cycles through three contextual states (Record → Stop → Re-record) and conflicting actions (e.g. reading aloud while recording) are disabled at the component level.

---

## Getting Started

**Prerequisites:** Node.js and a [Google Gemini API key](https://aistudio.google.com/app/apikey) (free)

```bash
# 1. Clone the repo
git clone https://github.com/ManchDi/storytime-ai.git
cd storytime-ai

# 2. Install dependencies
npm install

# 3. Add your API key
echo "API_KEY=your_gemini_api_key_here" > .env.local

# 4. Run locally
npm run dev
```

---

## Roadmap

- [ ] Custom story generation — let users enter a theme and generate a brand new story
- [ ] Multiple story selection
- [ ] Save and share favourite stories

---

## What I Learned

This project pushed me into APIs I hadn't used before — particularly the Web Audio API for raw PCM playback and the MediaRecorder API for in-browser audio capture. Getting the audio pipeline right (base64 → Uint8Array → Int16Array → AudioBuffer) required digging into how audio data is structured at a low level, which was genuinely challenging and rewarding.
