import type { Locale } from "@/i18n/routing";

type Contributor = {
  name: string;
  initials: string;
  role: Record<Locale, string>;
  affiliation: Record<Locale, string>;
  bio: Record<Locale, string>;
};

const contributors: Contributor[] = [
  {
    name: "Mina Hart",
    initials: "MH",
    role: {
      en: "Culture Editor",
      zh: "文化编辑",
    },
    affiliation: {
      en: "Comparative Literature, London",
      zh: "伦敦，比较文学",
    },
    bio: {
      en: "Writes on memory, migration and the emotional texture of cities.",
      zh: "关注记忆、迁移以及城市生活中的情感质地。",
    },
  },
  {
    name: "Rui Shen",
    initials: "RS",
    role: {
      en: "Research Editor",
      zh: "研究编辑",
    },
    affiliation: {
      en: "Sociology of Technology, Shanghai",
      zh: "上海，技术社会学",
    },
    bio: {
      en: "Studies media infrastructure, digital intimacy and contemporary attention.",
      zh: "研究媒介基础设施、数字亲密关系与当代注意力结构。",
    },
  },
  {
    name: "Lucia Morel",
    initials: "LM",
    role: {
      en: "Essay Editor",
      zh: "随笔编辑",
    },
    affiliation: {
      en: "Independent critic, Paris",
      zh: "巴黎，独立评论人",
    },
    bio: {
      en: "Edits hybrid essays that move between criticism, diary and cultural analysis.",
      zh: "编辑跨越评论、日记与文化分析的混合型随笔。",
    },
  },
];

export function getContributors(locale: Locale) {
  return contributors.map((contributor) => ({
    name: contributor.name,
    initials: contributor.initials,
    role: contributor.role[locale],
    affiliation: contributor.affiliation[locale],
    bio: contributor.bio[locale],
  }));
}
