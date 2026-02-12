export type Experiment = {
  id: string;
  active: boolean;
  variants: number[];
  kpi: string;
};

export const experiments: Record<string, Experiment> = {
  hero_copy: {
    id: "hero_copy",
    active: false,
    variants: [0, 1],
    kpi: "cta_hero_jv",
  },
  aiplus_hero: {
    id: "aiplus_hero",
    active: true,
    variants: [0, 1, 2],
    kpi: "aiplus_cta_click",
  },
};
















