import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        // ===== 2026年版 カラーパレット（指示書準拠） =====
        
        // プライマリーカラー
        'sumi': '#1A1A1A',           // 墨色（メインテキスト）
        'washi': '#FAFAF8',          // 和紙の白（背景）
        'akatsuki': '#FF6B35',       // 暁光オレンジ（CTA）
        
        // セカンダリーカラー
        'ash': '#8B8B8B',            // 灰色（補助テキスト）
        'pale-orange': '#FFE8D6',    // 淡いオレンジ（ホバー）
        'deep-sumi': '#0D0D0D',      // 濃墨（強調）
        
        // システムカラー
        'success': '#2D6A4F',        // 成功（和の緑）
        'warning': '#D4A574',        // 警告（和の金）
        'error': '#B7410E',          // エラー（和の赤）
        
        // AIPlus LP専用
        'aiplus-navy': '#1a365d',    // LPメインカラー
        'aiplus-blue': '#3b82f6',    // LPアクセント
        'aiplus-cta': '#f97316',     // LP CTA（オレンジ）
        'aiplus-cta-hover': '#ea580c', // LP CTAホバー
        'aiplus-light': '#eff6ff',   // LP薄青背景

        // レガシー（互換性のため維持）
        'kinari': '#F5F3EF',         // 生成り
        'gyoko': '#FF9E00',          // 旧・暁光
        'hinomaru': '#BC002D',       // 日の丸の赤
        'matsuha': '#2F6F4F',        // 松葉色
      },
      fontFamily: {
        // Neo-Japanesque タイポグラフィ
        'mincho': ['"Noto Serif JP"', '"Yu Mincho"', '游明朝', 'serif'],
        'gothic': ['"Noto Sans JP"', '"Hiragino Sans"', 'ヒラギノ角ゴ Pro', 'sans-serif'],
        'decorative': ['"Yuji Syuku"', 'serif'],
        
        // レガシー（互換性のため維持）
        'oldMincho': ['"Zen Old Mincho"', 'serif'],
        'syuku': ['"Yuji Syuku"', 'serif'],
        'garamond': ['"EB Garamond"', 'serif'],
        'sans': ['Noto Sans JP', 'sans-serif'],
        'heading': ['BIZ UDPGothic', 'sans-serif']
      },
      spacing: {
        // セクション間
        'section': '120px',
        'section-sp': '80px',
        
        // コンポーネント間
        'component': '60px',
        'component-sp': '40px',
        
        // 要素間
        'element': '40px',
        'element-sp': '24px',
      },
      borderRadius: {
        'card': '24px',
        'button': '40px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(26, 26, 26, 0.08)',
        'card-hover': '0 16px 48px rgba(26, 26, 26, 0.12)',
        'cta': '0 4px 16px rgba(255, 107, 53, 0.3)',
        'cta-hover': '0 8px 24px rgba(255, 107, 53, 0.4)',
        'aiplus-cta': '0 4px 16px rgba(249, 115, 22, 0.3)',
        'aiplus-cta-hover': '0 8px 24px rgba(249, 115, 22, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scroll-hint': 'scrollHint 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
    }
  }
}
