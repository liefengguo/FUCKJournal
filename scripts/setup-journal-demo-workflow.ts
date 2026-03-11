import { readFile } from "node:fs/promises";
import path from "node:path";

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const manuscriptPath =
  process.argv[2] ??
  "/Users/guoliefeng/Downloads/fuck-journal-word-template-zh.pdf";

function stamp() {
  return new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
}

async function getUser(
  db: any,
  role: "USER" | "REVIEWER" | "EDITOR" | "ADMIN" | Array<"USER" | "REVIEWER" | "EDITOR" | "ADMIN">,
) {
  const targetRole = Array.isArray(role) ? { in: role } : role;
  const user = await db.user.findFirst({
    where: { role: targetRole },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, email: true, name: true },
  });

  if (!user) {
    throw new Error(
      `Missing required user for role ${Array.isArray(role) ? role.join(",") : role}. Run npm run db:seed first.`,
    );
  }

  return user;
}

async function cleanupLegacyDemoSubmissions(db: any) {
  const legacy = await db.submission.findMany({
    where: {
      OR: [
        { publicationSlug: { startsWith: "pdf-publication-flow-" } },
        { publicationSlug: { startsWith: "docx-publication-flow-" } },
        { publicationSlug: { startsWith: "journal-demo-" } },
        { title: { contains: "端到端测试" } },
        { title: { contains: "流程验证" } },
        { title: { contains: "流程测试" } },
      ],
    },
    select: { id: true, publicId: true, publicationSlug: true, title: true },
  });

  if (!legacy.length) {
    return [];
  }

  await db.submission.deleteMany({
    where: {
      id: {
        in: legacy.map((item: { id: string }) => item.id),
      },
    },
  });

  return legacy;
}

async function createSubmissionRecord({
  submissions,
  author,
  editor,
  reviewer,
  pdfFile,
  metadata,
}: {
  submissions: any;
  author: any;
  editor: any;
  reviewer: any;
  pdfFile: File;
  metadata: {
    title: string;
    abstract: string;
    keywords: string[];
    coverLetter: string;
    manuscriptLanguage: "zh" | "en" | "bilingual" | "other";
    status:
      | "DRAFT"
      | "SUBMITTED"
      | "UNDER_REVIEW"
      | "REVISION_REQUESTED"
      | "ACCEPTED_READY"
      | "PUBLISHED";
    editorialNote?: string;
    review?: {
      decision: "ACCEPT" | "MINOR_REVISION" | "MAJOR_REVISION" | "REJECT";
      commentsToAuthor: string;
      commentsToEditor: string;
    };
    publication?: {
      slug: string;
      title: string;
      excerpt: string;
      tags: string[];
      volume: string;
      issue: string;
      year: number;
      published: boolean;
    };
  };
}) {
  const {
    addInternalEditorNote,
    assignReviewerToSubmission,
    createDraftSubmission,
    replaceSubmissionAsset,
    saveAuthorSubmissionDraft,
    saveReviewerReview,
    submitAuthorSubmission,
    updateEditorialSubmissionStatus,
    updatePublicationSettings,
  } = submissions;

  const submission = await createDraftSubmission(author.id);

  await saveAuthorSubmissionDraft(author, submission.publicId, {
    title: metadata.title,
    abstract: metadata.abstract,
    keywords: metadata.keywords,
    coverLetter: metadata.coverLetter,
    manuscriptLanguage: metadata.manuscriptLanguage,
  });

  await replaceSubmissionAsset(
    author,
    submission.publicId,
    "manuscript",
    new File([pdfFile], pdfFile.name, { type: pdfFile.type }),
  );

  if (metadata.status === "DRAFT") {
    return submission;
  }

  await submitAuthorSubmission(author, submission.publicId);

  if (metadata.editorialNote) {
    await addInternalEditorNote(editor, submission.publicId, metadata.editorialNote);
  }

  if (metadata.status === "SUBMITTED") {
    return submission;
  }

  await updateEditorialSubmissionStatus(
    editor,
    submission.publicId,
    "UNDER_REVIEW",
    "Moved from editorial screening into peer review.",
  );
  await assignReviewerToSubmission(editor, submission.publicId, reviewer.id);

  if (metadata.status === "UNDER_REVIEW") {
    return submission;
  }

  if (metadata.review) {
    await saveReviewerReview(reviewer, submission.publicId, {
      decision: metadata.review.decision,
      commentsToAuthor: metadata.review.commentsToAuthor,
      commentsToEditor: metadata.review.commentsToEditor,
    });
  }

  if (metadata.status === "REVISION_REQUESTED") {
    await updateEditorialSubmissionStatus(
      editor,
      submission.publicId,
      "REVISION_REQUESTED",
      "Reviewer feedback returned; author revision requested.",
    );
    return submission;
  }

  await updateEditorialSubmissionStatus(
    editor,
    submission.publicId,
    "ACCEPTED",
    "Accepted after peer review and editorial decision.",
  );

  if (!metadata.publication) {
    return submission;
  }

  await updatePublicationSettings(editor, submission.publicId, {
    isPublicationReady: true,
    isPublished: metadata.publication.published,
    publicationSlug: metadata.publication.slug,
    publicationTitle: metadata.publication.title,
    publicationExcerpt: metadata.publication.excerpt,
    publicationTags: metadata.publication.tags,
    publicationLocale: metadata.manuscriptLanguage,
    publicationVolume: metadata.publication.volume,
    publicationIssue: metadata.publication.issue,
    publicationYear: metadata.publication.year,
    seoTitle: metadata.publication.title,
    seoDescription: metadata.publication.excerpt,
    publishedAt: metadata.publication.published ? new Date().toISOString() : null,
  });

  return submission;
}

async function main() {
  const [{ db }, submissions] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/submissions"),
  ]);

  try {
    const author = await getUser(db, "USER");
    const editor = await getUser(db, ["EDITOR", "ADMIN"]);
    const reviewer = await getUser(db, "REVIEWER");
    const deleted = await cleanupLegacyDemoSubmissions(db);
    const buffer = await readFile(manuscriptPath);
    const pdfFile = new File([buffer], path.basename(manuscriptPath), {
      type: "application/pdf",
    });
    const token = stamp();

    const records = [
      {
        title: "作者端投稿准备记录 / PDF-first workflow",
        abstract:
          "这条记录用于展示作者在正式提交前如何填写题名、摘要、关键词、附信与稿件语言，并上传最终送审 PDF。它不再要求作者在平台内重复粘贴论文正文，而是以稿件文件本身作为阅读对象。",
        keywords: ["投稿流程", "PDF", "作者工作区", "元数据"],
        coverLetter:
          "本文主要用于验证作者端投稿体验是否已经从“站内写长文”转向“提交正式论文 PDF”。如系统表现正常，该记录将保持在准备状态，不进入编辑队列。",
        manuscriptLanguage: "zh" as const,
        status: "DRAFT" as const,
      },
      {
        title: "编辑初筛中的投稿记录 / Editorial screening",
        abstract:
          "该稿件用于展示正式提交后、尚未外审之前的编辑初筛阶段。编辑在这一阶段主要检查稿件是否适配期刊范围、元数据是否完整，以及稿件 PDF 是否具备送审条件。",
        keywords: ["编辑初筛", "投稿状态", "PDF 稿件"],
        coverLetter:
          "请将该稿件视为编辑初筛样本，用于展示提交后作者锁定、编辑可见、但尚未指派审稿人的状态。",
        manuscriptLanguage: "zh" as const,
        status: "SUBMITTED" as const,
        editorialNote:
          "Metadata is complete. Hold for scope check before assigning reviewers.",
      },
      {
        title: "外审中的投稿记录 / Peer review",
        abstract:
          "该稿件用于展示进入外审后的状态：编辑已完成初筛，稿件 PDF 正在被分配给审稿人阅读，审稿人可基于同一份 PDF 给出建议。",
        keywords: ["外审", "审稿人", "期刊流程"],
        coverLetter:
          "这篇稿件用于演示审稿台与编辑台如何围绕同一份 PDF 稿件协同工作。",
        manuscriptLanguage: "zh" as const,
        status: "UNDER_REVIEW" as const,
        editorialNote:
          "Reviewer assigned. Awaiting first-round recommendation on the submitted PDF.",
      },
      {
        title: "返修中的投稿记录 / Revision requested",
        abstract:
          "该稿件用于展示一轮审稿结束后进入返修阶段的状态。编辑收到审稿建议后要求作者更新稿件 PDF，并在必要时同步调整摘要、关键词或附信说明。",
        keywords: ["返修", "审稿意见", "编辑决定"],
        coverLetter:
          "该样本用于展示大修决定后作者工作区重新开放的状态，以及编辑侧如何保存审稿建议。",
        manuscriptLanguage: "zh" as const,
        status: "REVISION_REQUESTED" as const,
        editorialNote:
          "One round of review completed. Author revision required before reconsideration.",
        review: {
          decision: "MAJOR_REVISION" as const,
          commentsToAuthor:
            "The manuscript is reviewable in its current PDF form, but the framing and section transitions need a clearer argument before acceptance.",
          commentsToEditor:
            "Recommend major revision. The file-based workflow behaves correctly; the academic framing still needs work.",
        },
      },
      {
        title: "出版准备中的稿件 / Production queue",
        abstract:
          "这条记录用于展示已接收但尚未正式公开发布的稿件。它已经完成审稿与编辑决定，正在等待卷期编排、slug 确认、SEO 信息与 proof 检查。",
        keywords: ["出版准备", "已接收", "卷期编排"],
        coverLetter:
          "该样本用于验证已接收稿件如何从审稿队列转入出版工作区。",
        manuscriptLanguage: "zh" as const,
        status: "ACCEPTED_READY" as const,
        editorialNote:
          "Accepted. Hold in production queue until issue placement and final release checks are complete.",
        review: {
          decision: "MINOR_REVISION" as const,
          commentsToAuthor:
            "The manuscript is acceptable after light revisions and has been cleared for production preparation.",
          commentsToEditor:
            "Minor revision addressed. Suitable to move into accepted / production state.",
        },
        publication: {
          slug: `journal-demo-production-${token}`,
          title: "出版准备中的稿件 / Production-ready manuscript",
          excerpt:
            "一篇用于展示已接收稿件如何进入出版准备、卷期编排与 proof 检查的流程样本。",
          tags: ["production", "accepted", "workflow"],
          volume: "1",
          issue: "1",
          year: 2026,
          published: false,
        },
      },
      {
        title: "测试论文，用于测试",
        abstract:
          "这篇稿件使用作者提交的 PDF 原稿完成从投稿、编辑初筛、外部审稿、接收、出版准备到公开阅读的完整链路验证。公开页将直接显示作者提交后的 PDF 成稿观感。",
        keywords: ["公开论文页", "PDF-first", "期刊发布", "流程验证"],
        coverLetter:
          "该稿件用于验证平台是否已经具备一条从作者提交 PDF 到公开论文阅读页的完整发布链路。",
        manuscriptLanguage: "zh" as const,
        status: "PUBLISHED" as const,
        editorialNote:
          "Accepted and released as the primary public manuscript demo.",
        review: {
          decision: "ACCEPT" as const,
          commentsToAuthor:
            "The manuscript is accepted for publication. The submitted PDF will be used as the primary public reading copy.",
          commentsToEditor:
            "Use this record as the stable public-facing manuscript demo on the archive page.",
        },
        publication: {
          slug: `journal-demo-public-${token}`,
          title: "测试论文，用于测试",
          excerpt:
            "作者提交后的 PDF 稿件已沿着完整期刊流程公开发布，用于验证正式论文阅读与后台工作流是否已经打通。",
          tags: ["pdf", "publication", "journal workflow"],
          volume: "1",
          issue: "1",
          year: 2026,
          published: true,
        },
      },
    ];

    const created: Array<{
      title: string;
      publicId: string;
      status: string;
      publicUrl?: string;
    }> = [];

    for (const metadata of records) {
      const submission = await createSubmissionRecord({
        submissions,
        author,
        editor,
        reviewer,
        pdfFile,
        metadata,
      });

      created.push({
        title: metadata.title,
        publicId: submission.publicId,
        status: metadata.status,
        publicUrl: metadata.publication?.published
          ? `http://127.0.0.1:3000/zh/articles/${metadata.publication.slug}`
          : undefined,
      });
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          deleted: deleted.map((item: any) => ({
            publicId: item.publicId,
            publicationSlug: item.publicationSlug,
            title: item.title,
          })),
          created,
          authorDashboard: "http://127.0.0.1:3000/zh/dashboard",
          authorSubmissions: "http://127.0.0.1:3000/zh/dashboard/submissions",
          editorDesk: "http://127.0.0.1:3000/zh/editor/submissions",
          reviewerDesk: "http://127.0.0.1:3000/zh/reviewer/submissions",
          publicationDesk: "http://127.0.0.1:3000/zh/editor/publications",
          publicArchive: "http://127.0.0.1:3000/zh/articles",
        },
        null,
        2,
      ),
    );
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
