/**
 * IYASAKA サイト設定 (SSOT)
 * ブランド・マスター・プロトコルに基づく設定
 */

export type FeatureFlags = {
  enableFooterCta: boolean;
  enableBlog: boolean;
  enableAiChat: boolean;
  enableAB: boolean;
};

export const site = {
  brand: {
    name: "IYASAKA",
    tagline: "不を光へ、ともに弥栄",
    mission: "今ある「不」を、未来の「光」へ。",
  },
  nap: {
    address: "〒344-0043 埼玉県春日部市下蛭田422-5",
    phone: "048-872-6822",
    businessHours: "月–金 9:00–17:00",
    serviceArea: "関東一円（その他地域はご相談）",
  },
  cta: {
    contact: "/contact",
    download: "/downloads",
  },
  featureFlags: {
    enableFooterCta: true,
    enableBlog: true,
    enableAiChat: false,
    enableAB: false,
  } as FeatureFlags,
  footerCopyrightYear: new Date().getFullYear(),
  
  // ブランドカラー
  colors: {
    primary: "#1a365d",      // 信頼感のある紺
    accent: "#ff9e00",       // 夜明けの光
    organize: "#3182ce",     // 整える
    connect: "#319795",      // つなぐ
    nurture: "#38a169",      // 育てる
  },
} as const;

export type SiteConfig = typeof site;
