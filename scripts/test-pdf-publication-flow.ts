import { readFile } from "node:fs/promises";
import path from "node:path";

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const manuscriptPath =
  process.argv[2] ??
  "/Users/guoliefeng/Downloads/fuck-journal-word-template-zh.pdf";

function createSlug() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 12);
  return `pdf-publication-flow-${stamp}`;
}

async function getViewer(
  db: any,
  role: "USER" | "REVIEWER" | "EDITOR" | "ADMIN" | Array<"USER" | "REVIEWER" | "EDITOR" | "ADMIN">,
) {
  const targetRole = Array.isArray(role) ? { in: role } : role;

  const user = await db.user.findFirst({
    where: {
      role: targetRole,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      role: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new Error(
      `Missing required user for role ${Array.isArray(role) ? role.join(",") : role}. Run npm run db:seed first.`,
    );
  }

  return user;
}

async function main() {
  const [{ db }, manuscriptPreviewModule, submissionsModule] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/manuscript-preview"),
    import("@/lib/submissions"),
  ]);

  try {
    const { loadStoredManuscriptPreview } = manuscriptPreviewModule;
    const {
      createDraftSubmission,
      getPublicationExportSource,
      getPublishedSubmissionBySlug,
      replaceSubmissionAsset,
      saveAuthorSubmissionDraft,
      submitAuthorSubmission,
      updateEditorialSubmissionStatus,
      updatePublicationSettings,
    } = submissionsModule;
    const author = await getViewer(db, "USER");
    const editor = await getViewer(db, ["EDITOR", "ADMIN"]);
    const slug = createSlug();
    const buffer = await readFile(manuscriptPath);
    const file = new File([buffer], path.basename(manuscriptPath), {
      type: "application/pdf",
    });

    const submission = await createDraftSubmission(author.id);

    await saveAuthorSubmissionDraft(author, submission.publicId, {
      title: "PDF 原稿公开下载链路验证",
      abstract:
        "本文用于验证当作者提交的正式稿已经是 PDF 时，平台能否沿着作者投稿、编辑接收、出版设置与公开阅读这一整条链路，稳定保留该 PDF 的成稿观感，并使编辑 proof 与公开文章页保持一致。",
      keywords: ["PDF 投稿", "公开下载", "出版流程", "功能测试"],
      coverLetter:
        "该稿件只用于验证 PDF 原稿的投稿与出版链路，不作为真实投稿内容进入后续审稿。重点是确认平台现在以 PDF 稿件为标准交付形态。",
      manuscriptLanguage: "zh",
    });

    await replaceSubmissionAsset(author, submission.publicId, "manuscript", file);
    await submitAuthorSubmission(author, submission.publicId);
    await updateEditorialSubmissionStatus(
      editor,
      submission.publicId,
      "UNDER_REVIEW",
      "PDF end-to-end publication flow test",
    );
    await updateEditorialSubmissionStatus(
      editor,
      submission.publicId,
      "ACCEPTED",
      "Accepted for public PDF delivery verification",
    );
    await updatePublicationSettings(editor, submission.publicId, {
      isPublicationReady: true,
      publicationSlug: slug,
      publicationTitle: "PDF 原稿投稿到公开阅读页的端到端测试",
      publicationExcerpt:
        "一篇用于验证 PDF 原稿在投稿、接收、出版与公开阅读链路中保持成稿观感的流程测试稿件。",
      publicationTags: ["pdf", "publication", "viewer", "workflow"],
      publicationLocale: "zh",
      publicationVolume: "1",
      publicationIssue: "2",
      publicationYear: 2026,
      seoTitle: "PDF 原稿投稿到公开阅读页的端到端测试",
      seoDescription: "验证 F.U.C.K Journal 是否已将 PDF 作为正式稿件提交与公开阅读的主链路。",
      publishedAt: new Date().toISOString(),
    });

    const previewSource = await getPublicationExportSource(submission.publicId);

    if (!previewSource) {
      throw new Error("Accepted PDF submission could not be reloaded for proof preview.");
    }

    const preview = await loadStoredManuscriptPreview({
      fileName: previewSource.manuscriptFileName,
      mimeType: previewSource.manuscriptMimeType,
      storageKey: previewSource.manuscriptStorageKey,
      storageProvider: previewSource.manuscriptStorageProvider,
      inlineUrl: `/api/submissions/${submission.publicId}/assets/manuscript?inline=1`,
      downloadUrl: `/api/submissions/${submission.publicId}/assets/manuscript`,
    });

    const published = await getPublishedSubmissionBySlug(slug, "zh");

    if (!published) {
      throw new Error("Published PDF manuscript could not be loaded from the public publication query.");
    }

    await db.submission.delete({
      where: {
        publicId: submission.publicId,
      },
    });

    console.log(
      JSON.stringify(
        {
          ok: true,
          submissionPublicId: submission.publicId,
          verifiedPublicationSlug: slug,
          uploadedFile: path.basename(manuscriptPath),
          previewKind: preview?.kind ?? null,
          previewFileName: preview?.fileName ?? null,
          cleanedUp: true,
          note:
            "The temporary submission is deleted after verification so the public archive stays clean. Use setup-journal-demo-workflow.ts for a persistent demo dataset.",
        },
        null,
        2,
      ),
    );
  } finally {
    await db.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
