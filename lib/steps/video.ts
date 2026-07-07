// Video CDN — the vanilla project hosted step videos on Cloudinary. Same URLs.

const CDN = 'https://res.cloudinary.com/dzx4efbjn/video/upload/';

const VIDEO_IDS: Record<number, string> = {
  1: 'step1_tdmfvp',
  2: 'step2_twcggj',
  3: 'step3_gryveo',
  4: 'step4_t1birk',
  5: 'step5_atyve4',
  6: 'step6_devkw4',
  7: 'step7_gs3rdt',
};

export function getStepVideoSrc(stepNum: number): string | null {
  const id = VIDEO_IDS[stepNum];
  return id ? CDN + id + '.mp4' : null;
}

// "Moms asked about this" per-step percentages (badge on step page).
export const MOMS_AGREE_PCT: number[] = [65, 76, 72, 53, 78, 62, 68];
