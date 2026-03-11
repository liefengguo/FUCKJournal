import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

import { setRequestLocale } from "next-intl/server";

import { SubmissionForm } from "@/components/submission-form";
import { TemplateDownloadGrid } from "@/components/templates/template-download-grid";
import { LocaleLink } from "@/components/locale-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { getTemplatePageContent } from "@/lib/template-packages";

type SubmitPageProps = {
  params: {
    locale: Locale;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: SubmitPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.submit.title,
    description: copy.submit.intro,
    pathname: `/${params.locale}/submit`,
  });
}

export default function SubmitPage({ params }: SubmitPageProps) {
  const { locale } = params;

  noStore();
  setRequestLocale(locale);
  const copy = getCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const templateCopy = getTemplatePageContent(locale);
  const submissionSteps =
    locale === "zh"
      ? [
          "1. 创建账户并开始一条投稿记录。",
          "2. 填写标题、摘要、关键词、稿件语言与附信。",
          "3. 上传正式送审 PDF。论文版式以该 PDF 为准。",
          "4. 提交后进入编辑初筛，作者等待编辑决定。",
        ]
      : [
          "1. Create an account and open a submission record.",
          "2. Enter the title, abstract, keywords, manuscript language, and cover letter.",
          "3. Upload the review-ready PDF. The paper layout is taken from that PDF.",
          "4. Submit the record for editorial screening and wait for the next decision.",
        ];
  const reviewStages =
    locale === "zh"
      ? [
          {
            title: "编辑初筛",
            body: "编辑先判断选题是否适配、元数据是否完整、稿件 PDF 是否具备送审条件。",
          },
          {
            title: "外部审稿",
            body: "通过初筛后，编辑分配审稿人，审稿人围绕作者提交的 PDF 稿件给出建议。",
          },
          {
            title: "决定与返修",
            body: "编辑根据审稿意见决定接收、小修、大修或拒稿；若需返修，作者替换 PDF 后再次提交。",
          },
          {
            title: "出版准备",
            body: "接收后进入卷期、slug、SEO 与公开阅读设置，最终作为正式期刊稿件发布。",
          },
        ]
      : [
          {
            title: "Editorial screening",
            body: "Editors first check scope, metadata completeness, and whether the PDF is ready to send for review.",
          },
          {
            title: "Peer review",
            body: "After screening, editors assign reviewers who read the submitted PDF and return recommendations.",
          },
          {
            title: "Decision and revision",
            body: "Editors decide accept, minor revision, major revision, or reject; revised submissions replace the manuscript PDF.",
          },
          {
            title: "Publication preparation",
            body: "Accepted papers move into issue placement, slugging, SEO setup, and public release as journal manuscripts.",
          },
        ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">{locale === "zh" ? "投稿" : "Submit"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.submit.title}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.submit.intro}
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {locale === "zh" ? "投稿指南" : "Submission guidelines"}
              </h2>
              <ul className="space-y-4">
                {copy.submit.guidelines.map((guideline) => (
                  <li
                    key={guideline}
                    className="font-serif text-lg leading-relaxed text-muted-foreground"
                  >
                    {guideline}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {locale === "zh" ? "作者提交流程" : "Author submission flow"}
              </h2>
              <ul className="space-y-4">
                {submissionSteps.map((step) => (
                  <li
                    key={step}
                    className="font-serif text-lg leading-relaxed text-muted-foreground"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {locale === "zh" ? "编辑与审稿流程" : "Editorial and review flow"}
              </h2>
              <div className="space-y-4">
                {reviewStages.map((stage) => (
                  <div key={stage.title} className="rounded-[22px] border border-border/60 px-4 py-4">
                    <p className="font-display text-2xl">{stage.title}</p>
                    <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                      {stage.body}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {locale === "zh" ? "议题分类" : "Topic categories"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {copy.submit.categories.map((category) => (
                  <Badge key={category} variant="neutral">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {uiCopy.submitTemplatesCtaLabel}
              </h2>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.submitTemplatesCtaBody}
              </p>
              <TemplateDownloadGrid
                locale={locale}
                compact
                downloadLabel={templateCopy.downloadLabel}
              />
              <Button asChild size="sm">
                <LocaleLink locale={locale} href="/templates">
                  {locale === "zh" ? "查看模板详情" : "View full template guide"}
                </LocaleLink>
              </Button>
            </CardContent>
          </Card>
        </div>
        <SubmissionForm locale={locale} />
      </div>
    </div>
  );
}
