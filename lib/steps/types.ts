// Shape of one step in the Air One setup flow. Same schema is reused by
// tipsStep (a "tip" is just a step viewed outside the sequential flow).

export type TipIcon = 'question' | 'alert';

export interface TipImage {
  type: 'image';
  icon: TipIcon;
  title: string;
  body: string;
  warning?: string;
  /** Single image */
  image?: string;
  /** Multiple images shown side-by-side */
  images?: string[];
}

export interface TipText {
  type: 'text';
  icon: TipIcon;
  title: string;
  body: string;
  warning?: string;
}

export interface CarouselSlide {
  image: string;
  caption: string;
}

export interface TipCarousel {
  type: 'carousel';
  icon: TipIcon;
  title: string;
  sharedIntro?: string;
  frameHeight?: number;
  slides: CarouselSlide[];
}

export type Tip = TipImage | TipText | TipCarousel;

export interface Step {
  num: number;
  title: string;
  subtitle: string;
  videoTitle: string;
  videoSub: string;
  tips: Tip[];
}
