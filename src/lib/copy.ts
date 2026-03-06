import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

type HomeCopy = {
  eyebrow: string;
  tagline: string;
  heroNote: string;
  manifestoTitle: string;
  manifestoBody: string;
  contributorsTitle: string;
  contributorsBody: string;
};

type PageCopy = {
  title: string;
  intro: string;
};

type SubmitCopy = PageCopy & {
  guidelines: string[];
  categories: string[];
  uploadLabel: string;
  uploadHint: string;
  submitLabel: string;
};

type CommunityCopy = PageCopy & {
  pillars: Array<{ title: string; body: string }>;
};

type ManifestoCopy = PageCopy & {
  sections: Array<{ title: string; body: string }>;
};

type ContactCopy = PageCopy & {
  cards: Array<{ title: string; body: string; action: string; href: string }>;
};

type SiteCopy = {
  home: HomeCopy;
  about: PageCopy & { principles: Array<{ title: string; body: string }> };
  submit: SubmitCopy;
  community: CommunityCopy;
  manifesto: ManifestoCopy;
  contact: ContactCopy;
  articles: PageCopy;
};

const copy: Localized<SiteCopy> = {
  en: {
    home: {
      eyebrow: "Editorial Research Journal",
      tagline: "Research on the beautiful chaos of being human.",
      heroNote:
        "An editorial journal for essays, field notes and studies on feeling, identity, culture and the systems that shape ordinary life.",
      manifestoTitle: "Journal Manifesto",
      manifestoBody:
        "Human life is not a neat dataset. It is unstable, social, embodied and full of contradiction. FUCK Journal studies that complexity with the seriousness of scholarship and the clarity of literary editing.",
      contributorsTitle: "Community of Contributors",
      contributorsBody:
        "Writers, researchers, artists and social thinkers build this journal together. We value sharp thinking, humane language and work that can travel across disciplines.",
    },
    about: {
      title: "About the Journal",
      intro:
        "FUCK Journal is an academic and editorial experiment devoted to the complexity of contemporary life. We publish rigorous, reflective writing on culture, identity, emotion and social systems.",
      principles: [
        {
          title: "Interdisciplinary by design",
          body: "We bring theory, essays, criticism and observation into the same room so that knowledge can move across boundaries.",
        },
        {
          title: "Elegant but unsentimental",
          body: "We care about language, form and editorial precision, but we are not interested in obscurity for its own sake.",
        },
        {
          title: "Global in tone",
          body: "The journal is bilingual and outward-looking, grounded in local experience while welcoming international conversations.",
        },
      ],
    },
    submit: {
      title: "Submit Your Work",
      intro:
        "We welcome essays, research notes, reflective criticism and hybrid academic forms that take human complexity seriously.",
      guidelines: [
        "Send original work that has not been published elsewhere.",
        "Aim for clarity, argument and a distinct editorial voice.",
        "Submissions may be academic, personal, or hybrid, but should remain intellectually rigorous.",
        "Chinese and English submissions are both welcome.",
      ],
      categories: [
        "Emotion and affect",
        "Identity and selfhood",
        "Loneliness, intimacy and belonging",
        "Technology, media and attention",
        "Urban life, labor and contemporary culture",
      ],
      uploadLabel: "Upload paper",
      uploadHint:
        "File upload is currently a placeholder for the next release. Use the email draft below for now.",
      submitLabel: "Compose Submission Email",
    },
    community: {
      title: "Community",
      intro:
        "The journal is building a community around thoughtful publication, generous criticism and long-form conversation.",
      pillars: [
        {
          title: "Peer review, reimagined",
          body: "We want editorial review that is rigorous without becoming cold or bureaucratic.",
        },
        {
          title: "Discussion-led publishing",
          body: "Essays should lead to dialogue, annotations, reading groups and future collaborative issues.",
        },
        {
          title: "Collective archives",
          body: "Over time the journal will curate thematic dossiers and essay collections that document shared concerns.",
        },
      ],
    },
    manifesto: {
      title: "Manifesto",
      intro:
        "Modern life produces too much noise and too little understanding. This journal exists to think clearly inside that contradiction.",
      sections: [
        {
          title: "Why emotions deserve research",
          body: "Emotion is often treated as private residue, a soft category outside proper analysis. We disagree. Feeling is social evidence. It tells us how institutions enter the body and how culture shapes perception.",
        },
        {
          title: "Why human life is messy",
          body: "Identity is unstable. Growth is non-linear. Belonging is provisional. The point of serious inquiry is not to erase the mess, but to describe it with precision.",
        },
        {
          title: "Why loneliness is political",
          body: "Isolation is not merely a personal failure. It is produced by labor patterns, media environments, urban design and the architectures of modern aspiration.",
        },
      ],
    },
    contact: {
      title: "Contact",
      intro:
        "Write to the editorial team for submissions, collaborations, translation partnerships and future issues.",
      cards: [
        {
          title: "Editorial",
          body: "For general editorial enquiries, partnerships and issue concepts.",
          action: "editorial@fuckjournal.org",
          href: "mailto:editorial@fuckjournal.org",
        },
        {
          title: "Submissions",
          body: "For article submissions, abstracts and pitch emails.",
          action: "submissions@fuckjournal.org",
          href: "mailto:submissions@fuckjournal.org",
        },
        {
          title: "Community",
          body: "For contributor circles, salons and future discussion formats.",
          action: "community@fuckjournal.org",
          href: "mailto:community@fuckjournal.org",
        },
      ],
    },
    articles: {
      title: "Articles",
      intro:
        "Essays, research notes and reflective criticism from the journal's bilingual archive.",
    },
  },
  zh: {
    home: {
      eyebrow: "Editorial Research Journal",
      tagline: "研究人类存在之中那种美丽而混乱的秩序。",
      heroNote:
        "一本兼具学术气质与编辑美学的期刊，关注情感、身份、文化以及塑造日常生活的制度结构。",
      manifestoTitle: "期刊宣言",
      manifestoBody:
        "人的生活从来不是整齐的数据表。它摇摆、社会化、具身而且充满矛盾。FUCK Journal 希望以学术的严肃和文学编辑的清晰，研究这种复杂性。",
      contributorsTitle: "贡献者社群",
      contributorsBody:
        "写作者、研究者、艺术家与社会思想者共同构成这本期刊。我们重视锋利的思考、有人味的语言，以及能够跨越学科边界的作品。",
    },
    about: {
      title: "关于期刊",
      intro:
        "FUCK Journal 是一个面向当代生活复杂性的学术与编辑实验。我们发表关于文化、身份、情感与社会系统的严谨、反思性写作。",
      principles: [
        {
          title: "以跨学科为方法",
          body: "我们让理论、随笔、批评与观察进入同一空间，让知识能够跨越边界流动。",
        },
        {
          title: "优雅，但不矫饰",
          body: "我们在乎语言、形式和编辑精度，但不追求为了晦涩而晦涩的写作。",
        },
        {
          title: "国际化的语调",
          body: "这本期刊是双语的、面向外部世界的，在地经验是出发点，但欢迎国际对话。",
        },
      ],
    },
    submit: {
      title: "投稿",
      intro:
        "我们欢迎随笔、研究札记、反思性评论，以及认真对待人类复杂性的混合型学术写作。",
      guidelines: [
        "请提交原创且未在其他平台发表过的作品。",
        "写作应兼具清晰度、论证能力与独特的编辑声音。",
        "可以是学术、个人或混合体裁，但应保持智识上的严谨。",
        "欢迎中文和英文投稿。",
      ],
      categories: [
        "情感与感受研究",
        "身份与自我",
        "孤独、亲密与归属",
        "技术、媒介与注意力",
        "城市生活、劳动与当代文化",
      ],
      uploadLabel: "上传论文",
      uploadHint: "文件上传目前仍是占位功能。当前版本请先使用下方邮件草稿提交。",
      submitLabel: "生成投稿邮件",
    },
    community: {
      title: "社群",
      intro:
        "这本期刊正在建立一个围绕深度出版、慷慨批评与长篇对话的社群网络。",
      pillars: [
        {
          title: "重想同行评议",
          body: "我们希望形成一种既严谨又不冰冷、不官僚化的编辑评审方式。",
        },
        {
          title: "以讨论驱动发表",
          body: "文章不应止于发布，而应继续生成对话、注释、读书会与后续专题。",
        },
        {
          title: "集体档案",
          body: "随着期刊发展，我们将策划主题档案和论文集，记录共享的时代问题。",
        },
      ],
    },
    manifesto: {
      title: "宣言",
      intro:
        "现代生活制造了太多噪音，却留下太少理解。这个期刊存在的理由，就是在这种矛盾内部保持清晰思考。",
      sections: [
        {
          title: "为什么情感值得研究",
          body: "情感常被当作私人残余，好像它属于分析之外的柔软地带。我们不同意。感受是一种社会证据，它告诉我们制度如何进入身体，文化又如何塑造知觉。",
        },
        {
          title: "为什么人的生活总是凌乱",
          body: "身份并不稳定，成长也不是线性的，归属总带着暂时性。严肃研究的意义，不是消除这种凌乱，而是用精确语言去描述它。",
        },
        {
          title: "为什么孤独是政治性的",
          body: "孤立并不只是个人失败。它由劳动结构、媒介环境、城市设计以及现代欲望的组织方式共同制造。",
        },
      ],
    },
    contact: {
      title: "联系",
      intro:
        "欢迎就投稿、合作、翻译计划和未来专题与编辑团队联系。",
      cards: [
        {
          title: "编辑部",
          body: "用于一般编辑咨询、合作提案与专题设想。",
          action: "editorial@fuckjournal.org",
          href: "mailto:editorial@fuckjournal.org",
        },
        {
          title: "投稿邮箱",
          body: "用于文章投稿、摘要提交与选题提案。",
          action: "submissions@fuckjournal.org",
          href: "mailto:submissions@fuckjournal.org",
        },
        {
          title: "社群合作",
          body: "用于作者社群、沙龙活动与未来讨论机制。",
          action: "community@fuckjournal.org",
          href: "mailto:community@fuckjournal.org",
        },
      ],
    },
    articles: {
      title: "文章",
      intro: "来自期刊双语档案库的随笔、研究札记与反思性批评。",
    },
  },
};

export function getCopy(locale: Locale) {
  return copy[locale];
}
