// 創業ストーリーデータ（仮データ）
// ストーリーテリング効果（Narrative Transportation）を活用

export interface StoryChapter {
  id: string
  year: string
  title: string
  content: string
  emotion: 'struggle' | 'turning-point' | 'growth' | 'vision'
  image?: string
}

export const foundingStory = {
  prologue: {
    title: '「なぜ、うまくいかないのか」',
    lead: `現場には、いつも"もどかしさ"があった。
技術は揃っている。人もいる。
なのに、肝心な時に「動かない」「続かない」。
その根本にあるものは何か——。
20年間、その答えを探し続けてきた。`
  },
  
  chapters: [
    {
      id: 'chapter-1',
      year: '1999-2009',
      title: '現場で感じた"違和感"の正体',
      content: `大手通信会社のエンジニアとして、全国のネットワーク構築に携わった。
完璧な設計書、最新の機器、十分な予算。
それでも現場では必ずトラブルが起きた。

「なぜ、紙の上の正解が、現場で動かないのか？」

答えは単純だった。
現場を知らない人が、現場を設計していたからだ。`,
      emotion: 'struggle' as const,
      image: '/images/story/chapter-1.jpg'
    },
    {
      id: 'chapter-2',
      year: '2010-2015',
      title: '地方で見つけた"本当の課題"',
      content: `地方創生プロジェクトに参画したとき、衝撃を受けた。
都市部では当たり前の技術が、地方には届いていない。
そして、届いても「使いこなせない」。

技術を入れるだけではダメだ。
「続く仕組み」を一緒につくらなければ。

この気づきが、すべての始まりだった。`,
      emotion: 'turning-point' as const,
      image: '/images/story/chapter-2.jpg'
    },
    {
      id: 'chapter-3',
      year: '2016-2019',
      title: '「統括パートナー」という答え',
      content: `設計だけ、施工だけ、保守だけ——
分断されたサービスでは、現場の"隙間"を埋められない。

必要なのは、入口から出口まで一緒に走るパートナー。
技術も運用も、人の教育まで含めて「統括」する存在。

2019年、IYASAKAを創業。
「弥栄（いやさか）」——ますます栄える。
クライアントの事業を、ともに栄えさせる。
その決意を社名に込めた。`,
      emotion: 'growth' as const,
      image: '/images/story/chapter-3.jpg'
    },
    {
      id: 'chapter-4',
      year: '2020-現在',
      title: '1,500件の現場が教えてくれたこと',
      content: `コロナ禍で配信需要が爆発した。
多くの会場が、突然の変化に対応できず苦しんでいた。

「止まらない運用」「続く仕組み」——
20年間追い求めてきた答えが、今こそ求められている。

1,500件を超えるプロジェクトを通じて確信した。
技術は手段に過ぎない。
本当に必要なのは、「人が変わっても回る仕組み」をつくることだ。`,
      emotion: 'vision' as const,
      image: '/images/story/chapter-4.jpg'
    }
  ],

  epilogue: {
    title: 'これからの弥栄',
    content: `私たちの仕事は、派手ではない。
裏方として、現場を支え、仕組みをつくる。

でも、そこには確かな価値がある。
「開始が遅れなくなった」
「トラブルが減った」
「人が辞めても回るようになった」

そんな声をいただくたびに、この道を選んでよかったと思う。

不を解消し、事業を"弥栄"へ。
その想いで、これからも現場に立ち続ける。`
  },

  mission: {
    title: '使命',
    statement: '不を解消し、事業を"弥栄"へ。',
    description: '技術と運用の力で、クライアントの事業がますます栄える状態をつくる。'
  },

  values: [
    {
      title: '現場主義',
      description: '机上の空論ではなく、現場で動く解決策を。'
    },
    {
      title: '統括視点',
      description: '部分最適ではなく、全体を見渡した設計を。'
    },
    {
      title: '継続設計',
      description: '一度きりではなく、続く仕組みを。'
    }
  ]
}






