import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

type LinkCard = {
  title: string;
  body: string;
  href: string;
  cta: string;
};

type CopyCard = {
  title: string;
  body: string;
};

type HomeCopy = {
  eyebrow: string;
  tagline: string;
  heroNote: string;
  submitCta: string;
  manifestoCta: string;
  protocolCta: string;
  principlesTitle: string;
  principlesIntro: string;
  principles: CopyCard[];
  governanceTitle: string;
  governanceBody: string;
  governanceCards: LinkCard[];
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
  pillars: CopyCard[];
  participationTitle: string;
  participationBody: string;
};

type ManifestoCopy = PageCopy & {
  sections: CopyCard[];
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

type ProtocolCopy = PageCopy & {
  roleTitle: string;
  roleIntro: string;
  roles: Array<CopyCard & { bullets: string[] }>;
  flowTitle: string;
  flowIntro: string;
  flowStages: CopyCard[];
  decisionTitle: string;
  decisionIntro: string;
  decisionStages: CopyCard[];
  safeguardTitle: string;
  safeguardIntro: string;
  safeguards: Array<CopyCard & { bullets?: string[] }>;
  judgmentTitle: string;
  judgmentIntro: string;
  judgmentCards: Array<CopyCard & { bullets: string[] }>;
};

type GovernanceCopy = PageCopy & {
  manifestoTitle: string;
  manifestoBody: string;
  commitmentsTitle: string;
  commitmentsIntro: string;
  commitments: CopyCard[];
  permissionsTitle: string;
  permissionsIntro: string;
  permissions: Array<CopyCard & { bullets: string[] }>;
  changelogTitle: string;
  changelogBody: string;
  rulesTitle: string;
  rulesBody: string;
};

type SiteCopy = {
  home: HomeCopy;
  about: PageCopy & { principles: CopyCard[] };
  submit: SubmitCopy;
  community: CommunityCopy;
  manifesto: ManifestoCopy;
  protocol: ProtocolCopy;
  governance: GovernanceCopy;
  contact: ContactCopy;
  articles: PageCopy;
  footer: FooterCopy;
};

const copy: Localized<SiteCopy> = {
  en: {
    home: {
      eyebrow: "Editorial journal platform",
      tagline:
        "A journal better suited to the future we want to read — and better suited to the future we want to publish in.",
      heroNote:
        "F.U.C.K Journal publishes papers, notes, observations, and original viewpoints that deserve serious treatment without needing prestige theatre first. We want a public journal where process is legible, rules are inspectable, and good work can arrive from anywhere.",
      submitCta: "Submit",
      manifestoCta: "Read Manifesto",
      protocolCta: "Review the Protocol",
      principlesTitle: "What this journal is for",
      principlesIntro:
        "We are building a journal that takes ideas seriously without asking authors or readers to perform distance, hierarchy, or institutional mystique.",
      principles: [
        {
          title: "Ideas matter more than titles",
          body: "We care about whether a manuscript says something worth reading. Institutional prestige, famous supervisors, and inherited status should not receive quiet priority.",
        },
        {
          title: "Papers should feel closer to people",
          body: "Scholarly writing can be rigorous without sounding remote. We want papers to remain formal, readable, and genuinely connected to lived experience.",
        },
        {
          title: "Stories and observations deserve serious treatment",
          body: "An original observation, an unexpected field note, or a strong conceptual story can matter as much as a conventional academic paper if it carries real thought.",
        },
        {
          title: "Fairness should come from rules",
          body: "Editorial legitimacy should come from transparent protocol, shared constraints, and public auditability rather than administrator mood or personal authority.",
        },
      ],
      governanceTitle: "Open protocol, inspectable governance",
      governanceBody:
        "This platform is designed so that editorial power is bounded, review stages are visible, and the community can see which parts are rule-based, which parts still require judgment, and where future governance work remains unfinished.",
      governanceCards: [
        {
          title: "Protocol",
          body: "See who can do what, how manuscripts move, how reviews inform decisions, and which safeguards are already formalized.",
          href: "/protocol",
          cta: "Open protocol",
        },
        {
          title: "Governance",
          body: "Read the journal's public commitments on anti-prestige privilege, editor limits, community oversight, and open-rule development.",
          href: "/governance",
          cta: "Open governance",
        },
      ],
      contributorsTitle: "Community and contributors",
      contributorsBody:
        "We want a community of authors, reviewers, editors, critics, and readers who care about serious work, plain dealing, and the long life of ideas after publication.",
      issueLabel: "Launch preparation",
      issueTitle: "Public papers, proofs, and platform hardening",
      issueBody:
        "The current issue view shows published manuscripts while the platform is being prepared for deployment, governance rollout, and a more durable editorial rhythm.",
      statFeatured: "Featured",
      statEssays: "Published",
      statLanguages: "Languages",
    },
    about: {
      title: "About F.U.C.K Journal",
      intro:
        "F.U.C.K Journal stands for Foundations of Uncertainty, Complexity, and Knowledge. We publish bilingual work about how people live, think, organize, improvise, misread, and make meaning under conditions that are never fully settled.",
      principles: [
        {
          title: "Serious ideas should stay readable",
          body: "We take argument, evidence, and editorial care seriously, but we do not think seriousness requires coldness or needless distance from ordinary readers.",
        },
        {
          title: "Prestige is not a method",
          body: "Titles, famous names, and institutional aura are not substitutes for judgment. They should not silently decide who gets treated as publishable.",
        },
        {
          title: "Editorial form is part of knowledge",
          body: "How a paper is structured, read, annotated, and archived changes what it can do. Presentation is not decoration after the thinking is over.",
        },
        {
          title: "Bilingual publication changes the audience",
          body: "Publishing in Chinese and English is not a branding gesture. It widens who can enter the conversation and how ideas circulate across contexts.",
        },
      ],
    },
    submit: {
      title: "Submit Your Work",
      intro:
        "We welcome papers, research notes, reflective criticism, and hybrid academic writing from people with something real to say. Submission is PDF-first: authors prepare a review-ready manuscript, add the necessary metadata, and enter a transparent editorial process.",
      guidelines: [
        "Send original work that is not already published elsewhere.",
        "Make the PDF readable, review-ready, and close to the form you want others to evaluate.",
        "We accept disciplinary, cross-disciplinary, and hard-to-classify work if the thinking is clear and serious.",
        "Chinese and English submissions are both welcome.",
      ],
      categories: [
        "Institutions, systems, and collective life",
        "Culture, language, and human meaning",
        "Uncertainty, risk, and historical change",
        "Observation, field notes, and lived structures",
        "Knowledge, technology, and forms of inquiry",
      ],
      uploadLabel: "Submission format",
      uploadHint:
        "Authors submit a review-ready PDF. Word and LaTeX templates remain available for preparing that file, not for replacing the file-based workflow.",
      submitLabel: "Open submission workspace",
    },
    community: {
      title: "Community",
      intro:
        "We are trying to build a journal community that is rigorous without being socially closed, editorial without becoming ceremonial, and open to people who arrive with strong ideas rather than the right pedigree.",
      pillars: [
        {
          title: "Authors, readers, and reviewers all matter",
          body: "A journal should not only optimize for editors. The experience of reading, reviewing, revising, and responding is part of the publication culture itself.",
        },
        {
          title: "Interesting work can come from unusual places",
          body: "Original viewpoints are not confined to formal prestige channels. The community should remain open to the person who has seen something true before they have learned how to sound official.",
        },
        {
          title: "Public agreement is stronger than vague authority",
          body: "We want community norms that can be read, challenged, revised, and cited back to the platform when decisions feel arbitrary or inconsistent.",
        },
      ],
      participationTitle: "How to take part",
      participationBody:
        "You can participate by submitting work, reviewing carefully, reading generously, annotating published papers, or helping us pressure-test the rules before authority quietly hardens around them.",
    },
    manifesto: {
      title: "Manifesto",
      intro:
        "We care about what gets published because publication changes what gets read, what gets remembered, and what feels legitimate to think in public.",
      sections: [
        {
          title: "We want a journal better suited to the future",
          body: "Many journals still ask readers and authors to accept inherited forms of distance, ceremony, and prestige sorting. We want a journal built for a future in which good thought should travel more directly, without losing rigor.",
        },
        {
          title: "Good ideas should not need prestige cover",
          body: "A paper should not need the blessing of a famous institution or a recognizable name before it can be taken seriously. We do not believe status should function as a hidden editorial accelerator.",
        },
        {
          title: "Interesting stories deserve serious treatment",
          body: "A sharp observation, a difficult experience, a careful note from the field, or an original conceptual story can all deserve the same seriousness we bring to formal scholarship.",
        },
        {
          title: "Anti-authority projects can still become authority centers",
          body: "We are not interested in replacing one opaque gate with another. If a journal says it resists hierarchy, that claim should be tested by its procedures, not by its slogans.",
        },
        {
          title: "Rules should stay open to scrutiny",
          body: "Editorial rules, governance mechanisms, and publication logic should remain inspectable. When judgment is necessary, it should be named as judgment rather than hidden inside technical language.",
        },
      ],
    },
    protocol: {
      title: "Protocol",
      intro:
        "The protocol describes how the journal currently works in public: who can act, how manuscripts move, where decisions are constrained by rules, and where human judgment still enters the process.",
      roleTitle: "Role permissions",
      roleIntro:
        "The platform already separates contributor, reviewer, editor, and administrator access. The goal is to keep permissions legible and narrower than the total power available to a database operator.",
      roles: [
        {
          title: "Contributors",
          body: "Authors control their private submission record until the manuscript is formally sent into editorial screening.",
          bullets: [
            "Create a submission record and edit metadata.",
            "Upload and replace the review-ready manuscript PDF while the record is still editable.",
            "Read editorial status changes and respond to revision requests.",
          ],
        },
        {
          title: "Reviewers",
          body: "Reviewers only see manuscripts explicitly assigned to them.",
          bullets: [
            "Access the assigned manuscript and its metadata summary.",
            "Submit a structured recommendation and reviewer comments.",
            "Do not gain queue-wide access through search or navigation.",
          ],
        },
        {
          title: "Editors",
          body: "Editors manage workflow state without rewriting the author's manuscript inside the platform.",
          bullets: [
            "Screen submissions, assign reviewers, record internal notes, and update decisions.",
            "Move accepted manuscripts into publication preparation.",
            "Prepare publication metadata, slugging, and export records.",
          ],
        },
        {
          title: "Administrators",
          body: "Administrators currently share the highest platform permissions and remain a governance surface that still needs clearer public constraints.",
          bullets: [
            "Maintain infrastructure, accounts, and deployment-level configuration.",
            "Should not override editorial outcomes without a public rule or audit record.",
            "Need further formalization in the governance layer.",
          ],
        },
      ],
      flowTitle: "Submission, review, and publication flow",
      flowIntro:
        "The journal currently follows a straight workflow so that each manuscript has a legible state and a recoverable history.",
      flowStages: [
        {
          title: "1. Submission",
          body: "A contributor opens a submission record, fills in metadata, uploads a review-ready PDF, and sends the manuscript into editorial screening.",
        },
        {
          title: "2. Editorial screening",
          body: "Editors check scope, file readiness, metadata completeness, and whether the manuscript is ready to enter review.",
        },
        {
          title: "3. Peer review",
          body: "Editors assign reviewers, reviewers read the submitted manuscript PDF, and the platform stores their recommendations and comments.",
        },
        {
          title: "4. Decision and revision",
          body: "Editors can request revision, reject, or accept. Revised manuscripts return through the same record instead of creating a second hidden workflow.",
        },
        {
          title: "5. Publication preparation and release",
          body: "Accepted submissions move into publication preparation, where editors set public metadata, issue placement, export records, and publication timing before release.",
        },
      ],
      decisionTitle: "Decision logic and stages",
      decisionIntro:
        "Review does not automatically decide publication. Reviewer input informs a later editorial decision that remains visible in the workflow history.",
      decisionStages: [
        {
          title: "Screening outcome",
          body: "A manuscript can remain in preparation, move into review, or be returned for revision before review if the record is incomplete.",
        },
        {
          title: "Review outcome",
          body: "Reviewers recommend accept, minor revision, major revision, or reject. Their recommendation is advisory rather than sovereign.",
        },
        {
          title: "Editorial decision",
          body: "Editors record the formal status transition. The platform keeps status history, reviewer assignment history, and version snapshots so the path is inspectable later.",
        },
      ],
      safeguardTitle: "Safeguards, placeholders, and auditability",
      safeguardIntro:
        "Some safeguards are already visible in the platform. Others are intentionally marked as unfinished so they can be formalized rather than silently improvised.",
      safeguards: [
        {
          title: "Conflict of interest",
          body: "A formal conflict-of-interest policy still needs a public rule set, disclosure format, and visible enforcement path.",
          bullets: [
            "Placeholder: reviewer and editor disclosure requirements.",
            "Placeholder: recusal logic and replacement procedure.",
          ],
        },
        {
          title: "Appeals",
          body: "Appeals are not yet implemented as a public-facing workflow and should not be simulated through private administrator discretion.",
          bullets: [
            "Placeholder: appeal window, evidence standard, and escalation route.",
            "Placeholder: audit trail for any overturned decision.",
          ],
        },
        {
          title: "Auditability",
          body: "The current platform already records versions, status events, reviewer assignments, reviews, and publication audit events so the workflow can be reconstructed after the fact.",
        },
      ],
      judgmentTitle: "Rules and human judgment",
      judgmentIntro:
        "Not everything should be automated. The point is to name the difference between constrained action and discretionary judgment instead of hiding one inside the other.",
      judgmentCards: [
        {
          title: "Rule-based",
          body: "Permissions, status transitions, reviewer access boundaries, publication-ready gates, and export endpoints are implemented as explicit workflow logic.",
          bullets: [
            "Who can see a manuscript.",
            "Which state changes are currently allowed.",
            "What gets logged in the workflow history.",
          ],
        },
        {
          title: "Human judgment",
          body: "Scope fit, editorial interest, review interpretation, and final publication standards still require human reading and cannot be reduced to a simple score.",
          bullets: [
            "Whether the manuscript belongs in the journal.",
            "How reviewer comments are weighed against one another.",
            "When a text is ready for public release.",
          ],
        },
      ],
    },
    governance: {
      title: "Governance",
      intro:
        "Governance is how the journal promises not to become the kind of opaque authority it claims to resist. It is a public statement about limits, accountability, and unfinished work.",
      manifestoTitle: "A community-facing commitment",
      manifestoBody:
        "We want a journal where good work can be taken seriously without requiring prestige certification, where editorial power stays bounded, and where people can read the rules that shape their chances of being heard.",
      commitmentsTitle: "What we are trying to protect",
      commitmentsIntro:
        "The journal's governance should protect authors, reviewers, readers, and future editors from the slow return of hidden privilege under a new language of openness.",
      commitments: [
        {
          title: "No prestige-based privilege",
          body: "Famous names, elite affiliations, and status markers should not receive informal fast paths or invisible deference.",
        },
        {
          title: "Transparent process over personality",
          body: "When a decision is rule-based, the rule should be visible. When a decision is judgment-based, that fact should be acknowledged instead of disguised as neutrality.",
        },
        {
          title: "Public oversight over private myth",
          body: "The platform should remain open to criticism, inspection, and revision by the community it asks to trust it.",
        },
      ],
      permissionsTitle: "What platform roles can and cannot do",
      permissionsIntro:
        "Governance matters most where someone could act quietly. These limits make the intended boundaries explicit even when some parts still need stronger technical enforcement.",
      permissions: [
        {
          title: "Editors can",
          body: "Editors can manage workflow, assign review, interpret reports, and prepare accepted manuscripts for publication.",
          bullets: [
            "Screen records for readiness and scope.",
            "Assign or remove reviewer access.",
            "Record status changes and publication metadata.",
          ],
        },
        {
          title: "Editors cannot",
          body: "Editors should not rewrite an author's manuscript inside the platform or invent hidden process branches unavailable to others.",
          bullets: [
            "No silent substitution of the submitted manuscript.",
            "No unpublished shadow workflow for preferred authors.",
            "No private override that leaves no audit trail.",
          ],
        },
        {
          title: "Administrators can",
          body: "Administrators can maintain infrastructure and account-level operations needed to keep the system running.",
          bullets: [
            "Manage deployment, storage, and service availability.",
            "Recover operational failures when the platform breaks.",
            "Maintain user roles where explicitly required.",
          ],
        },
        {
          title: "Administrators cannot",
          body: "Administrators should not function as invisible sovereign editors.",
          bullets: [
            "No quiet publication reversal without a visible rule.",
            "No hidden privilege for personal networks or status groups.",
            "No authority claims that cannot later be inspected.",
          ],
        },
      ],
      changelogTitle: "Governance changelog",
      changelogBody:
        "Placeholder: a public changelog should record governance revisions, protocol changes, and any meaningful change to editorial powers or review logic.",
      rulesTitle: "Open-source rules and algorithm notes",
      rulesBody:
        "Placeholder: workflow rules, scoring logic if introduced later, and any algorithmic assistance should be published in a form the community can inspect, critique, and version.",
    },
    contact: {
      title: "Contact",
      intro:
        "Write to the editorial team about submissions, collaborations, translation work, governance feedback, or future issues.",
      cards: [
        {
          title: "Editorial",
          body: "For general editorial enquiries, collaborations, and issue proposals.",
          action: "guoliefeng@hotmail.com",
          href: "mailto:guoliefeng@hotmail.com",
        },
        {
          title: "Submissions",
          body: "For submission questions, workflow problems, and author support.",
          action: "guoliefeng@hotmail.com",
          href: "mailto:guoliefeng@hotmail.com",
        },
        {
          title: "Governance and community",
          body: "For governance feedback, community proposals, and oversight concerns.",
          action: "guoliefeng@hotmail.com",
          href: "mailto:guoliefeng@hotmail.com",
        },
      ],
    },
    articles: {
      title: "Papers",
      intro:
        "Published papers from the bilingual archive, presented in a manuscript-first reading view that keeps the author's submitted form legible to readers.",
    },
    footer: {
      sitemapLabel: "Sitemap",
      contactLabel: "Contact",
      blurb:
        "A bilingual journal for uncertainty, complexity, knowledge, and the public life of serious ideas.",
      buildNote: "Built for editorial clarity and durable scrutiny.",
    },
  },
  zh: {
    home: {
      eyebrow: "编辑型期刊平台",
      tagline: "一本更适合未来的我们去阅读，也更适合未来的我们去发表的期刊。",
      heroNote:
        "F.U.C.K Journal 希望认真对待论文、研究札记、观察记录与原创观点，而不要求作者先完成一套威望表演。我们想做的是一份流程清楚、规则可读、好想法可以从任何地方进入的公共期刊。",
      submitCta: "投稿",
      manifestoCta: "阅读宣言",
      protocolCta: "查看规程",
      principlesTitle: "这本期刊想解决什么",
      principlesIntro:
        "我们希望期刊仍然严肃，但不要再把距离感、等级感和神秘感误当成学术质量本身。",
      principles: [
        {
          title: "想法比头衔更重要",
          body: "我们关心的是稿件是否真的值得读，而不是作者是否来自著名机构、是否背后站着有名导师、是否自带一种可被默认信任的身份。",
        },
        {
          title: "论文不必高高在上",
          body: "学术写作可以保持严格，同时也可以更接近人的经验、更接近真实问题，不必靠疏离口气来证明自己专业。",
        },
        {
          title: "故事与观察也值得被严肃对待",
          body: "一则有洞见的观察、一个不寻常的案例、一种原创的叙述框架，都可能和标准论文一样重要，只要其中确实有思考。",
        },
        {
          title: "公平应来自规则，而不是人情",
          body: "编辑正当性应该来自透明规程、共享约束和可追溯记录，而不是管理员的偏好、熟人关系或临时心证。",
        },
      ],
      governanceTitle: "开放规程，可检查的治理",
      governanceBody:
        "这个平台的目标不是把权力藏在后台，而是让大家看到哪些地方已经由规则约束，哪些地方仍然依赖判断，以及哪些治理部分还处在待完善状态。",
      governanceCards: [
        {
          title: "规程",
          body: "查看谁可以做什么，稿件如何流转，审稿意见如何进入决定，以及哪些保障机制已经被写清楚。",
          href: "/protocol",
          cta: "打开规程",
        },
        {
          title: "治理",
          body: "阅读这份期刊对反威望特权、编辑权限边界、社群监督和开放规则开发的公共承诺。",
          href: "/governance",
          cta: "打开治理",
        },
      ],
      contributorsTitle: "社群与贡献者",
      contributorsBody:
        "我们想建立的是一个由作者、审稿人、编辑、评论者与读者组成的共同体：认真对待作品，也认真对待规则、语言和出版之后的讨论生命。",
      issueLabel: "上线准备",
      issueTitle: "公开论文、校样与平台打磨",
      issueBody:
        "当前的期刊视图一方面展示已发布稿件，另一方面也在为正式部署、治理公开与更稳定的编辑节奏做最后整理。",
      statFeatured: "精选",
      statEssays: "已发布",
      statLanguages: "语言",
    },
    about: {
      title: "关于 F.U.C.K Journal",
      intro:
        "F.U.C.K Journal 的全称是 Foundations of Uncertainty, Complexity, and Knowledge。我们希望出版的是那些讨论人在不稳定条件下如何生活、思考、组织、误解、即兴应对与建构意义的双语作品。",
      principles: [
        {
          title: "严肃思想也应该保持可读",
          body: "我们认真对待论证、证据与编辑质量，但不认为“严肃”就必须冷漠，也不认为写得疏离才算学术。",
        },
        {
          title: "威望不是方法",
          body: "头衔、名校、名人背书和机构光环不能代替判断，也不应悄悄决定谁更容易被当作“可发表”。",
        },
        {
          title: "编辑形式本身就是知识的一部分",
          body: "论文如何被组织、阅读、注释和存档，会改变它能做什么。呈现方式不是思考结束后的包装。",
        },
        {
          title: "双语不是装饰",
          body: "中英文并行并不是品牌动作，而是为了改变谁可以进入讨论、谁可以继续传播这些思想。",
        },
      ],
    },
    submit: {
      title: "投稿",
      intro:
        "我们欢迎论文、研究札记、反思性评论和难以归类但真正有内容的写作。投稿采用 PDF-first：作者准备一份可送审的正式稿件，再进入清晰的编辑和审稿流程。",
      guidelines: [
        "请提交尚未公开发表的原创工作。",
        "请让 PDF 本身适合送审，尽量接近你希望他人阅读和判断它的最终样子。",
        "无论是学科内、跨学科，还是难以归类的稿件，只要思考清楚、写作认真，都可以进入考虑范围。",
        "欢迎中文和英文投稿。",
      ],
      categories: [
        "制度、系统与集体生活",
        "文化、语言与人的意义世界",
        "不确定性、风险与历史变化",
        "观察、田野记录与生活结构",
        "知识、技术与研究形式",
      ],
      uploadLabel: "投稿格式",
      uploadHint:
        "作者提交的是可送审 PDF。Word 与 LaTeX 模板仍然可用，但它们服务于生成这份文件，而不是替代文件工作流。",
      submitLabel: "打开投稿工作区",
    },
    community: {
      title: "社群",
      intro:
        "我们想建立的是一种不靠封闭社交网络维系的期刊社群：它可以严格，但不刻意冷；可以编辑化，但不仪式化；可以欢迎好想法，而不先筛选出身。",
      pillars: [
        {
          title: "作者、读者与审稿人都重要",
          body: "一个期刊不应该只为编辑效率而设计。阅读、审稿、修改、回应的体验，本身就是出版文化的一部分。",
        },
        {
          title: "有意思的工作会从意想不到的地方来",
          body: "原创观点并不只产生于高威望通道。社群必须对那些先看见问题、后学会官方口气的人保持开放。",
        },
        {
          title: "公开约定比模糊权威更可靠",
          body: "我们希望社群规范可以被阅读、质疑、修订，也可以在决策显得任意时被再次引用回来约束平台。",
        },
      ],
      participationTitle: "如何参与",
      participationBody:
        "你可以通过投稿、认真审稿、仔细阅读、给公开论文做注释，或者帮助我们在权力固化之前把规则先测试清楚，来参与这本期刊。",
    },
    manifesto: {
      title: "宣言",
      intro:
        "我们在意发表什么，因为发表会改变什么能够被读到、被记住，以及什么样的思考会被当作有资格在公共空间里成立。",
      sections: [
        {
          title: "我们想做一份更适合未来的期刊",
          body: "太多期刊仍然要求作者和读者接受一种继承来的距离感、仪式感和威望排序。我们想做的是另一种期刊：让好思想更直接地抵达读者，而不牺牲严谨。",
        },
        {
          title: "好想法不该先去借威望外衣",
          body: "一篇稿件不应该先被著名机构、名人作者或熟悉的人脉认证，才配被严肃对待。我们不接受地位变成隐形加速器。",
        },
        {
          title: "有意思的故事也值得被认真处理",
          body: "一个尖锐观察、一段棘手经验、一份认真的田野记录，或者一种原创的叙述框架，都可能和标准学术论文一样值得被认真阅读。",
        },
        {
          title: "反权威项目也可能变成新的权威中心",
          body: "我们不想只是把旧门槛换一种话语重新搭起来。如果一个期刊说自己反对等级，那这个说法必须经得起程序与记录的检验。",
        },
        {
          title: "规则应该保持可审视",
          body: "编辑规则、治理机制和出版逻辑都应该可检查。凡是仍然需要判断的地方，也应该被明确说成“判断”，而不是藏进技术和官方语气里。",
        },
      ],
    },
    protocol: {
      title: "规程",
      intro:
        "规程页面用来公开说明这本期刊当前如何运作：谁拥有什么权限，稿件如何流转，哪些决定已经被规则约束，哪些地方仍然需要人的判断。",
      roleTitle: "角色权限",
      roleIntro:
        "平台目前已经区分作者、审稿人、编辑和管理员权限。目标是让权限边界始终清楚，而不是把所有能力默认交给后台角色。",
      roles: [
        {
          title: "作者",
          body: "在正式提交之前，作者控制自己的私有投稿记录。",
          bullets: [
            "创建投稿记录并编辑元数据。",
            "在可编辑状态下上传或替换送审 PDF。",
            "查看编辑状态变化并响应返修决定。",
          ],
        },
        {
          title: "审稿人",
          body: "审稿人只能看到被明确分配给自己的稿件。",
          bullets: [
            "访问被分配稿件及其元数据摘要。",
            "提交结构化建议与审稿意见。",
            "不能通过搜索或导航获得整条队列访问权。",
          ],
        },
        {
          title: "编辑",
          body: "编辑管理流程状态，但不会在平台内部代替作者改写稿件正文。",
          bullets: [
            "进行初筛、分配审稿、记录内部备注、更新决定。",
            "将已接收稿件送入出版准备。",
            "维护公开元数据、slug、导出记录与发布时间。",
          ],
        },
        {
          title: "管理员",
          body: "管理员目前仍然拥有最高平台权限，这本身就是一个需要继续治理化的公共问题。",
          bullets: [
            "维护基础设施、账号与部署配置。",
            "不应在没有公开规则和审计记录的情况下覆盖编辑结果。",
            "这一层权限未来需要更明确的公开边界。",
          ],
        },
      ],
      flowTitle: "投稿、审稿与出版流程",
      flowIntro:
        "平台当前采用一条直线型流程，确保每篇稿件都有清楚状态与可回溯历史。",
      flowStages: [
        {
          title: "1. 投稿",
          body: "作者创建投稿记录，填写元数据，上传可送审 PDF，并将稿件送入编辑初筛。",
        },
        {
          title: "2. 编辑初筛",
          body: "编辑检查选题范围、文件状态、元数据完整性，以及稿件是否适合进入送审。",
        },
        {
          title: "3. 外部审稿",
          body: "编辑分配审稿人，审稿人阅读作者提交的 PDF，并提交建议与意见。",
        },
        {
          title: "4. 决定与返修",
          body: "编辑可以要求返修、拒稿或接收。返修稿继续沿用同一条投稿记录，而不是进入另一条隐藏流程。",
        },
        {
          title: "5. 出版准备与公开发布",
          body: "已接收稿件进入出版准备，设置公开元数据、期次信息、导出记录与发布时间，然后正式发布。",
        },
      ],
      decisionTitle: "审稿逻辑与决定阶段",
      decisionIntro:
        "审稿不会自动等同于发表决定。审稿意见会进入后续编辑判断，而该判断仍然保留在可查看的流程记录中。",
      decisionStages: [
        {
          title: "初筛结果",
          body: "稿件可以继续停留在准备中、进入送审，或者因为记录不完整而被要求先修改再送审。",
        },
        {
          title: "审稿结果",
          body: "审稿人可给出接收、小修、大修或拒稿建议，但建议并不自动成为最终决定。",
        },
        {
          title: "编辑决定",
          body: "编辑记录正式状态变化。平台会保留状态历史、审稿分配历史与版本快照，便于事后追溯。",
        },
      ],
      safeguardTitle: "保障机制、占位项与可审计性",
      safeguardIntro:
        "有些保障已经体现在平台里；有些部分则明确标记为未完成，避免它们在后台被临时发明出来。",
      safeguards: [
        {
          title: "利益冲突",
          body: "正式的利益冲突政策还需要公开规则、披露格式与可见的执行路径。",
          bullets: [
            "占位：审稿人与编辑的披露要求。",
            "占位：回避逻辑与替换流程。",
          ],
        },
        {
          title: "申诉",
          body: "申诉目前还没有实现为公开工作流，不应通过管理员私下裁量来替代。",
          bullets: [
            "占位：申诉时限、证据标准与升级路径。",
            "占位：任何改判都应留下可审计记录。",
          ],
        },
        {
          title: "可审计性",
          body: "当前平台已经会记录版本、状态事件、审稿分配、审稿意见和出版审计事件，因此一条稿件流程可以在事后被重建出来。",
        },
      ],
      judgmentTitle: "规则与人的判断",
      judgmentIntro:
        "不是所有东西都应该自动化。重要的是把“被规则约束的行为”和“仍然需要判断的行为”明确区分，而不是相互伪装。",
      judgmentCards: [
        {
          title: "规则约束的部分",
          body: "权限、状态流转、审稿访问边界、出版准备门槛与导出接口，都是明确定义的流程逻辑。",
          bullets: [
            "谁可以看到一篇稿件。",
            "当前允许哪些状态变化。",
            "哪些操作会被写入流程记录。",
          ],
        },
        {
          title: "仍需判断的部分",
          body: "选题是否适配、稿件是否值得发表、审稿意见如何被权衡，仍然必须由人来阅读和判断。",
          bullets: [
            "稿件是否属于这本期刊。",
            "如何理解彼此冲突的审稿意见。",
            "什么状态下适合公开发布。",
          ],
        },
      ],
    },
    governance: {
      title: "治理",
      intro:
        "治理的意义，是让这本期刊不要在自称反对旧权威的同时，又悄悄长成另一套不透明权威。它是一份关于边界、问责和未完成工作的公共说明。",
      manifestoTitle: "面向社群的承诺",
      manifestoBody:
        "我们希望做一份让好作品可以在不依赖威望认证的情况下被认真对待的期刊，也希望编辑权力始终有边界，且任何人都能看到影响自己机会的规则。",
      commitmentsTitle: "我们想保护什么",
      commitmentsIntro:
        "治理的作用，是保护作者、审稿人、读者和未来编辑，不让新的隐藏特权在“开放”的名义下再次生长出来。",
      commitments: [
        {
          title: "反对基于威望的优待",
          body: "知名作者、名校机构和既有地位，不应拥有非正式快车道，也不应享受默认更可信的待遇。",
        },
        {
          title: "流程透明高于人格权威",
          body: "凡是规则驱动的决定，规则应可见；凡是判断驱动的决定，也应承认那是判断，而不是伪装成中性的自动结果。",
        },
        {
          title: "公共监督高于私下神话",
          body: "平台应保持对质疑、检查和修订开放，而不是要求社群对“我们会处理好”进行无限信任。",
        },
      ],
      permissionsTitle: "平台角色能做什么，不能做什么",
      permissionsIntro:
        "治理最重要的地方，往往是某人可以悄悄行动的地方。下面这些边界先把意图写清楚，即便其中一些技术限制还需要继续加强。",
      permissions: [
        {
          title: "编辑可以",
          body: "编辑可以管理流程、分配审稿、解释审稿报告，并准备已接收稿件的公开元数据。",
          bullets: [
            "初筛投稿是否就绪与是否匹配范围。",
            "分配或移除审稿权限。",
            "记录状态变化与出版设置。",
          ],
        },
        {
          title: "编辑不能",
          body: "编辑不应在平台里替作者重写正文，也不应为特定作者发明别人无法进入的隐藏流程。",
          bullets: [
            "不能悄悄替换已提交稿件。",
            "不能给特定作者开设未公开的快捷通道。",
            "不能进行不留痕迹的私下覆盖。",
          ],
        },
        {
          title: "管理员可以",
          body: "管理员可以维护系统运行所需的基础设施与账号级操作。",
          bullets: [
            "管理部署、存储与服务可用性。",
            "在平台故障时执行恢复性操作。",
            "在明确需要时维护角色配置。",
          ],
        },
        {
          title: "管理员不能",
          body: "管理员不应成为看不见的主权编辑。",
          bullets: [
            "不能在没有公开规则的情况下改写发表结果。",
            "不能为个人网络或地位群体保留隐藏优待。",
            "不能主张无法被社群检查的权力。",
          ],
        },
      ],
      changelogTitle: "治理变更记录",
      changelogBody:
        "占位：未来应公开记录治理修订、规程变更，以及任何影响编辑权限或审稿逻辑的重要调整。",
      rulesTitle: "开源规则与算法说明",
      rulesBody:
        "占位：如果未来引入更明确的规则引擎、评分逻辑或算法辅助，它们都应以可检查、可版本化的方式对社群开放。",
    },
    contact: {
      title: "联系",
      intro:
        "欢迎就投稿、合作、翻译、治理反馈或未来专题，与编辑团队联系。",
      cards: [
        {
          title: "编辑事务",
          body: "用于一般编辑咨询、合作提案与专题设想。",
          action: "guoliefeng@hotmail.com",
          href: "mailto:guoliefeng@hotmail.com",
        },
        {
          title: "投稿支持",
          body: "用于投稿流程问题、作者支持与工作流反馈。",
          action: "guoliefeng@hotmail.com",
          href: "mailto:guoliefeng@hotmail.com",
        },
        {
          title: "治理与社群",
          body: "用于治理意见、社群提案与监督相关问题。",
          action: "guoliefeng@hotmail.com",
          href: "mailto:guoliefeng@hotmail.com",
        },
      ],
    },
    articles: {
      title: "论文",
      intro:
        "这里收录已经正式发布的期刊论文，并优先保留作者提交稿件对读者的可见形态。",
    },
    footer: {
      sitemapLabel: "站点地图",
      contactLabel: "联系",
      blurb: "一份讨论不确定性、复杂性、知识与公共思想生活的双语期刊。",
      buildNote: "为编辑清晰度而建，也为公共审视而建。",
    },
  },
};

export function getCopy(locale: Locale) {
  return copy[locale];
}
