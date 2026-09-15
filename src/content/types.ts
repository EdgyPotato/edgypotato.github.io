export interface Project {
  slug: string; title: string; summary: string; category: string; status: string;
  placement: 'featured' | 'supporting'; order: number; technologies: string[];
  contribution?: string; sections: { title: string; body: string }[];
  limitations: string; links?: { label: string; url: string }[];
  // `image` and `secondaryImage` are the full size captures the viewer opens. `card` and `secondaryCard` are
  // display sized derivatives for the inline visual, so a 1080px phone capture is not decoded for a 167px frame.
  visual: { title: string; nodes?: string[]; caption: string; image?: string; alt?: string; width?: number; height?: number; card?: string; secondaryImage?: string; secondaryAlt?: string; secondaryWidth?: number; secondaryHeight?: number; secondaryCard?: string };
  metrics?: { label: string; value: string; evidence: string }[];
}
