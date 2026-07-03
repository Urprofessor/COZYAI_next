// Runtime constants shared across the CozyAI chat experience.

export const COZY_PAGE_SIZE = 20;              // 10 rounds = 20 msgs per pagination page
export const COZY_MAX_IMAGE_MB = 5;
export const COZY_MAX_IMAGES_PER_MSG = 4;

// QA thinking loading pool — rotates every 1s with a subtle opacity swap.
export const COZY_THINKING_TEXTS = [
  'Thinking...',
  'Checking guidelines...',
  'Looking that up...',
] as const;

// Support (Sarah) thinking pool.
export const COZY_SUPPORT_THINKING_TEXTS = [
  'typing...',
  'reviewing your case...',
] as const;

export const COZY_LOADING_ICON = '/images/system/loading.svg';

// Handoff queue simulation timing.
export const HANDOFF_CONNECTING_MS = 1500;
export const HANDOFF_QUEUE_MIN_MS = 10_000;
export const HANDOFF_QUEUE_MAX_MS = 20_000;
export const HANDOFF_ASSIGNING_MS = 2500;
export const HANDOFF_ASSIGNING_FADEOUT_MS = 300;
export const SARAH_INTRO_TYPING_MS = 2000;

// Sarah's hardcoded intro (doesn't go through the LLM).
export const SARAH_INTRO =
  "Hi! I'm Sarah from Momcozy Customer Care. I help with things CozyAI can't handle — damaged items, refunds, complaints, and anything else that needs a human touch. Let me take a quick look at your case and messages first — I'll be right back with you.";
