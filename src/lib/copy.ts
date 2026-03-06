import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

type HomeCopy = {
  eyebrow: string;
  tagline: string;
  heroNote: string;
  manifestoTitle: string;
  manifestoBody: string;
  manifestoCta: string;
  contributorsTitle: string;
  contributorsBody: string;
  issueLabel: string;
  issueTitle: string;
  issueBody: string;
  statFeatured: string;
  statEssays: string;
  statLanguages: string;
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

type FooterCopy = {
  sitemapLabel: string;
  contactLabel: string;
  blurb: string;
  buildNote: string;
};

type SiteCopy = {
  home: HomeCopy;
  about: PageCopy & { principles: Array<{ title: string; body: string }> };
  submit: SubmitCopy;
  community: CommunityCopy;
  manifesto: ManifestoCopy;
  contact: ContactCopy;
  articles: PageCopy;
  footer: FooterCopy;
};

const copy: Localized<SiteCopy> = {
  en: {
    home: {
      eyebrow: "Interdisciplinary Journal of Ideas",
      tagline: "A journal of ideas on systems, culture, and the human condition.",
      heroNote:
        "F.U.C.K Journal studies the foundations of universality, complexity and knowledge through essays, research notes and editorial criticism on human life, society, uncertainty, meaning and the structures that shape experience.",
      manifestoTitle: "Why This Journal",
      manifestoBody:
        "We publish work that moves across disciplines without flattening difference: writing on systems, culture, uncertainty, identity, meaning and the forms of knowledge by which human beings orient themselves in the world.",
      manifestoCta: "Read the manifesto",
      contributorsTitle: "Contributors and Correspondents",
      contributorsBody:
        "Our contributors form an international, bilingual community of scholars, essayists, critics and artists committed to rigorous thinking, lucid prose and long-form intellectual exchange.",
      issueLabel: "Current Issue",
      issueTitle: "Life, Systems, Uncertainty",
      issueBody:
        "A selection of essays on loneliness, attention, identity, urban life and the structures through which knowledge becomes lived experience.",
      statFeatured: "Featured",
      statEssays: "Essays",
      statLanguages: "Languages",
    },
    about: {
      title: "About F.U.C.K Journal",
      intro:
        "F.U.C.K Journal studies the foundations of universality, complexity and knowledge. It is a bilingual interdisciplinary publication for thinking about the structures that shape life: systems, culture, uncertainty, identity, meaning, society and human experience.",
      principles: [
        {
          title: "Universality without simplification",
          body: "We ask questions that travel across languages, histories and disciplines while resisting formulas that erase the texture of lived worlds.",
        },
        {
          title: "Complexity as method",
          body: "We treat contradiction, contingency and non-linearity as conditions of inquiry, not as noise to be edited out in pursuit of false clarity.",
        },
        {
          title: "Knowledge with form",
          body: "We publish rigorous thought in editorial forms that remain readable, beautiful and internationally open to different intellectual traditions.",
        },
      ],
    },
    submit: {
      title: "Submit Your Work",
      intro:
        "We welcome essays, research notes, reflective criticism and hybrid academic forms that engage universality, complexity, knowledge and the human condition with rigor and style.",
      guidelines: [
        "Send original work that has not been published elsewhere.",
        "Aim for clarity, argument and a distinct editorial voice.",
        "Submissions may be academic, personal, or hybrid, but should remain intellectually rigorous.",
        "Chinese and English submissions are both welcome.",
      ],
      categories: [
        "Systems, institutions and social life",
        "Culture, language and human meaning",
        "Uncertainty, risk and historical change",
        "Identity, feeling and the human condition",
        "Knowledge, technology and forms of inquiry",
      ],
      uploadLabel: "Upload paper",
      uploadHint:
        "File upload is currently a placeholder for the next release. Use the email draft below for now.",
      submitLabel: "Compose Submission Email",
    },
    community: {
      title: "Community",
      intro:
        "The journal is building an international community around slow thinking, interdisciplinary exchange, bilingual publication and editorial rigor.",
      pillars: [
        {
          title: "Interdisciplinary review",
          body: "We want criticism that is demanding, generous and capable of moving between academic precision and editorial intelligence.",
        },
        {
          title: "Discussion-led publishing",
          body: "Essays should lead to seminars, annotations, correspondence and future issues rather than ending at the moment of publication.",
        },
        {
          title: "Bilingual archives",
          body: "Over time the journal will curate translated dossiers, thematic collections and durable archives of contemporary thought.",
        },
      ],
    },
    manifesto: {
      title: "Manifesto",
      intro:
        "F.U.C.K Journal begins from a simple premise: if we want to understand human life, we cannot isolate systems, culture, uncertainty, meaning and knowledge from one another.",
      sections: [
        {
          title: "Universality is not uniformity",
          body: "The journal is interested in questions that travel: how people seek meaning, how institutions shape life, how knowledge is organized and how uncertainty enters ordinary experience. But universality is not sameness. It is the search for concepts that can move across contexts without flattening them.",
        },
        {
          title: "Complexity belongs to truth",
          body: "Human life is layered, non-linear and often internally contradictory. We do not treat this as a defect in description. Complexity is part of what makes social reality intelligible. Serious thought should meet that condition with patience, formal precision and conceptual range.",
        },
        {
          title: "Knowledge requires form",
          body: "Ideas do not exist apart from their modes of presentation. Essays, research notes, criticism and hybrid writing each make different kinds of knowledge possible. We care about argument, but also cadence; about evidence, but also the editorial form that allows ideas to remain readable across languages and disciplines.",
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
        "Essays, research notes and editorial criticism from the journal's bilingual archive on systems, culture, uncertainty and human meaning.",
    },
    footer: {
      sitemapLabel: "Sitemap",
      contactLabel: "Contact",
      blurb:
        "A bilingual journal of universality, complexity, knowledge and the structures of human life.",
      buildNote: "Edited for clarity, designed for slow reading.",
    },
  },
  zh: {
    home: {
      eyebrow: "跨学科思想期刊",
      tagline: "一份讨论系统、文化与人类处境的思想期刊。",
      heroNote:
        "F.U.C.K Journal 以随笔、研究札记与编辑批评的形式，思考普遍性、复杂性与知识基础，关注人的生活、社会、不确定性、意义以及塑造经验的各种结构。",
      manifestoTitle: "这本期刊为何存在",
      manifestoBody:
        "我们关心能够跨越学科而不抹平差异的写作：关于系统、文化、不确定性、身份、意义，以及人如何借助知识为世界建立方向感。",
      manifestoCta: "阅读宣言",
      contributorsTitle: "作者与通讯者",
      contributorsBody:
        "贡献者来自不同语言与学科背景，包括学者、随笔作者、评论人和艺术实践者。我们重视严谨思考，也重视清晰而优雅的写作。",
      issueLabel: "本期主题",
      issueTitle: "生活、系统与不确定性",
      issueBody:
        "一组关于孤独、注意力、身份、城市生活，以及知识如何成为经验的文章。",
      statFeatured: "精选",
      statEssays: "文章",
      statLanguages: "语言",
    },
    about: {
      title: "关于 F.U.C.K Journal",
      intro:
        "F.U.C.K Journal 研究普遍性、复杂性与知识基础。它是一份双语、跨学科的期刊，思考那些塑造生活的结构：系统、文化、不确定性、身份、意义、社会以及人的经验。",
      principles: [
        {
          title: "普遍性不等于整齐划一",
          body: "我们关心那些能够穿越语言、历史与学科的问题，同时警惕任何抹去在地经验纹理的抽象公式。",
        },
        {
          title: "以复杂性为方法",
          body: "矛盾、偶然性与非线性不是需要被清除的噪音，而是理解社会现实时不可回避的条件。",
        },
        {
          title: "让知识拥有形式",
          body: "我们希望严谨的思想也能拥有可阅读、优美且面向国际交流的编辑形式，让不同传统之间真正发生对话。",
        },
      ],
    },
    submit: {
      title: "投稿",
      intro:
        "我们欢迎以严谨与风格同时回应普遍性、复杂性、知识与人类处境的随笔、研究札记、反思性评论及混合型学术写作。",
      guidelines: [
        "请提交原创且未在其他平台发表过的作品。",
        "写作应兼具清晰度、论证能力与独特的编辑声音。",
        "可以是学术、个人或混合体裁，但应保持智识上的严谨。",
        "欢迎中文和英文投稿。",
      ],
      categories: [
        "系统、制度与社会生活",
        "文化、语言与人类意义",
        "不确定性、风险与历史变化",
        "身份、感受与人的处境",
        "知识、技术与研究形式",
      ],
      uploadLabel: "上传论文",
      uploadHint: "文件上传目前仍是占位功能。当前版本请先使用下方邮件草稿提交。",
      submitLabel: "生成投稿邮件",
    },
    community: {
      title: "社群",
      intro:
        "这本期刊正在围绕慢思考、跨学科交换、双语出版与编辑严谨性，建立一个国际化的思想共同体。",
      pillars: [
        {
          title: "跨学科审读",
          body: "我们希望批评既严格又慷慨，既能保持学术精度，也能拥有编辑判断力与语言敏感度。",
        },
        {
          title: "以讨论驱动出版",
          body: "文章不应止于发布，而应继续生成研讨、注释、通信与未来专题。",
        },
        {
          title: "双语档案",
          body: "随着期刊发展，我们将策划译介专题、主题档案与可以长期保存的当代思想文库。",
        },
      ],
    },
    manifesto: {
      title: "宣言",
      intro:
        "F.U.C.K Journal 建立在一个朴素判断之上：如果我们要理解人的生活，就不能把系统、文化、不确定性、意义与知识彼此切开。",
      sections: [
        {
          title: "普遍性不是同质化",
          body: "我们关心那些可以穿越处境的问题：人如何追索意义，制度如何塑造生活，知识如何被组织，不确定性又如何进入日常经验。但普遍性并不意味着把差异抹平，它意味着寻找能够跨越语境而又不简化语境的概念。",
        },
        {
          title: "复杂性属于真实的一部分",
          body: "人的生活是多层的、非线性的，也经常自相矛盾。我们不把这种状态视为描述的失败。复杂性本身就是现实可理解性的组成部分。严肃思考应当以耐心、形式精度与概念张力去回应它。",
        },
        {
          title: "知识需要形式",
          body: "观念从不脱离其呈现方式而存在。随笔、研究札记、评论与混合写作，各自开启不同的知识可能。我们在乎论证，也在乎节奏；在乎证据，也在乎让思想能够跨越语言与学科而保持可读性的编辑形式。",
        },
      ],
    },
    contact: {
      title: "联系",
      intro:
        "欢迎就投稿、合作、翻译计划与未来专题和编辑团队联系。",
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
      intro: "来自期刊双语档案库的随笔、研究札记与编辑评论，主题涵盖系统、文化、不确定性与人的意义世界。",
    },
    footer: {
      sitemapLabel: "站点地图",
      contactLabel: "联系",
      blurb: "一份关于普遍性、复杂性、知识以及人类生活结构的双语期刊。",
      buildNote: "为清晰而编辑，为缓慢阅读而设计。",
    },
  },
};

export function getCopy(locale: Locale) {
  return copy[locale];
}
