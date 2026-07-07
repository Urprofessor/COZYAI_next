# CozyAI (Next.js)

Next.js 15 (App Router) + TypeScript + Tailwind + Vercel AI SDK refactor of the
vanilla `AI-Setup2.0_Deepseek` project. Same functionality, saner architecture.

## What's here vs. what's TODO

**Migrated end-to-end**
- Foundation (Next.js config, TS strict, Tailwind with brand tokens)
- `/api/chat` — smart provider routing (Claude Haiku 4.5 for images, DeepSeek for text) via Vercel AI SDK
- `/api/history` — Upstash Redis persistence
- CozyAI Welcome page (`/cozy/welcome`)
- CozyAI Chat (`/cozy/chat`) with:
  - Streaming replies via SDK's data-stream format
  - Textarea auto-grow to 5 lines
  - Image upload (up to 4, ≤5MB each), base64 in session only
  - Fullscreen lightbox (backdrop / Esc close)
  - Multi-state handoff card (idle → connecting → queuing → assigning → joined)
  - Sarah persona swap + typing indicator before her intro
  - Freeze QA AI while queued so messages become Sarah context
  - Reference footer on QA replies
  - Rotating GPT-thinking style loading text
- **Setup flow** — `/setup/1` through `/setup/7`
  - Shared `StepHeader` with CozyAI glass-pill entry
  - 7-segment progress bar
  - Video player (tap-to-toggle, progress overlay) fetching from same Cloudinary CDN
  - "% of Moms Asked About This" badge per step
  - Tip accordion with 3 body types (image / text / carousel)
  - Fixed Back / Next footer
- **Tips flow** — `/tips` + `/tips/1` through `/tips/7`
  - Tips index: 7 topic cards + bottom-anchored floating CozyAI pill (with fade mask)
  - Tips detail: same layout as Setup but back → /tips, no Next button

**TODO (deferred until you need them)**
- Welcome / Complete / Control / Settings pages (marketing + device pairing UI)
- Full-screen video player mode with scrubber and controls (vanilla project had this — kept simple here)
- History pagination + "swipe up to view history" hint pill on CozyAI Welcome
- Tier-3 typography usage for date dividers between old messages
- Multi-open accordion (currently single-open) if you prefer that UX
- Handoff card centering polish (currently uses simple flex)

## Prerequisites

- Node 20+ (Vercel default)
- An Upstash Redis instance (Marketplace or direct)
- A DeepSeek API key
- An Anthropic API key (for vision replies)

## Environment variables

Create `.env.local` for local dev:

```
DEEPSEEK_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Either the direct Upstash names…
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxx
# …or Vercel Marketplace names (auto-injected when you connect on Vercel):
# KV_REST_API_URL=…
# KV_REST_API_TOKEN=…
```

On Vercel: **Settings → Environment Variables** → add all of the above for
Production / Preview / Development.

## Static assets to copy

The `public/` folder is empty. Copy these directories from
`AI-Setup2.0_Deepseek/` into `public/`:

```
images/     → public/images/
icon/       → public/icon/
fonts/      → public/fonts/
videos/     → public/videos/   (only if migrating setup pages)
```

Windows PowerShell one-liner (adjust path if needed):

```powershell
$src = 'C:\Users\user\Documents\GitHub\AI-Setup2.0_Deepseek'
$dst = 'C:\Users\user\Documents\GitHub\COZYAI_next\public'
'images','icon','fonts','videos' | ForEach-Object {
  if (Test-Path "$src\$_") { Copy-Item -Recurse "$src\$_" -Destination "$dst\" }
}
```

## Install & run

```bash
cd C:\Users\user\Documents\GitHub\COZYAI_next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **Open CozyAI** to
land on the Welcome page.

## Deploy to Vercel

1. Push this folder to a new GitHub repo
2. Import into Vercel — it will auto-detect Next.js
3. Add the env vars above
4. First deploy takes ~90s; subsequent ones are faster

## Project structure

```
app/
├── layout.tsx              root shell (font, safe-area, theme color)
├── page.tsx                / — landing
├── globals.css             Tailwind entry + font-face + tier-3 utility
├── cozy/
│   ├── welcome/page.tsx    /cozy/welcome
│   └── chat/page.tsx       /cozy/chat?q=optional seed
├── setup/[step]/page.tsx   /setup/1..7 (stub)
├── tips/page.tsx           /tips (stub)
└── api/
    ├── chat/route.ts       POST — streams reply via AI SDK
    └── history/route.ts    GET/POST — Upstash-backed history

components/cozy/
├── Welcome.tsx             Client component for the greeting/pills UI
├── Chat.tsx                Orchestrates messages + input + handoff
├── Bubble.tsx              User/assistant/system message rendering
├── InputBar.tsx            Textarea + upload + send/stop
├── ImageGrid.tsx           1-4 image grid inside user bubble
├── Lightbox.tsx            Fullscreen image viewer
├── LoadingIndicator.tsx    Rotating "thinking..." text
└── HandoffCard.tsx         idle/connecting/queuing/assigning states

components/step/
├── StepHeader.tsx          Shared top bar (back + title + CozyAI pill)
├── CozyEntryPill.tsx       Glass-effect 96×44 entry button
├── FloatingCozyBtn.tsx     Bottom-anchored pill (Tips index)
├── ProgressBar.tsx         7-segment clickable progress
├── VideoPlayer.tsx         Inline video with tap-to-toggle
├── StepPage.tsx            Setup step assembled component
├── TipAccordion.tsx        Expandable list of tips
├── TipCarousel.tsx         Swipe carousel for step sequences
└── TipMedia.tsx            Image + text body renderer (used by accordion)

components/tips/
├── TipsIndex.tsx           7 topic cards + bottom floating button
└── TipStepPage.tsx         Individual tip detail (uses step components)

hooks/
├── useCozyChat.ts          Central chat state + streaming + handoff flow
└── useDeviceId.ts          Stable localStorage id for history keying

lib/
├── utils.ts                cn(), randInt()
├── redis.ts                Upstash REST client (dual-env support)
└── cozy/
    ├── constants.ts        timings, thinking text pools, page size
    ├── prompts.ts          QA & Support system prompts, tag constants
    ├── keywords.ts         Handoff trigger keyword list
    ├── support-avatars.ts  Sarah avatar pool
    └── types.ts            CozyMessage, Persona, HandoffState
```

## Vanilla → Next.js diff highlights

| Concern | Vanilla | Next.js |
|---|---|---|
| Streaming SSE parsing | ~90 lines hand-rolled | Vercel AI SDK internals; ~20 lines of data-stream parsing |
| Message state | Global mutable array + save timer | `useState` in `useCozyChat`, auto-persist via effect |
| Handoff state machine | Inline `let cozyHandoffTimers` and DOM `innerHTML` swaps | React state + `useEffect` timer chain in `HandoffCard.tsx` |
| Image upload | Manual FileReader + `renderCozyAttachmentStrip` | Same underlying idea, but state is React-owned so the strip re-renders itself |
| Persona routing | Nested if/else in `sendCozyMessage` | Server owns provider choice; client sends persona + images and gets a normalized stream |
| CSS | Global 2500-line `<style>` | Tailwind utilities + component-scoped classes, ~150 lines of custom CSS total |

## What deliberately isn't Vercel AI SDK's `useChat`

The AI SDK's `useChat` hook is great for stock chat UIs, but it doesn't natively
know about:
- Persona (QA vs support)
- Client-side keyword handoff routing
- Image attachments with base64 data URLs (only newer AI SDK versions support
  `experimental_attachments`, and we want tight control over persistence)
- Post-stream tag stripping (`[[HANDOFF]]` / `[[EXIT_HANDOFF]]`) + reference
  footer injection

So `useCozyChat` is a hand-rolled equivalent that reads the SDK's data-stream
format directly. If you later drop the persona/handoff complexity, swap it for
`useChat` and delete ~200 lines.
