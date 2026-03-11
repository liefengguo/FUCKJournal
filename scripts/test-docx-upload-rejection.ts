import { readFile } from "node:fs/promises";
import path from "node:path";

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const manuscriptPath =
  process.argv[2] ??
  "/Users/guoliefeng/Downloads/fuck-journal-word-template-zh.docx";

async function getAuthor(db: any) {
  const user = await db.user.findFirst({
    where: {
      role: "USER",
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
    throw new Error("Missing required USER account. Run npm run db:seed first.");
  }

  return user;
}

async function main() {
  const [{ db }, submissionsModule] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/submissions"),
  ]);

  try {
    const {
      SubmissionError,
      createDraftSubmission,
      replaceSubmissionAsset,
    } = submissionsModule;
    const author = await getAuthor(db);
    const submission = await createDraftSubmission(author.id);
    const buffer = await readFile(manuscriptPath);
    const file = new File([buffer], path.basename(manuscriptPath), {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    let rejectionCode: string | null = null;

    try {
      await replaceSubmissionAsset(author, submission.publicId, "manuscript", file);
      throw new Error("Expected DOCX manuscript upload to be rejected.");
    } catch (error) {
      if (error instanceof SubmissionError && error.code === "invalid-manuscript-file") {
        rejectionCode = error.code;
      } else {
        throw error;
      }
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          submissionPublicId: submission.publicId,
          attemptedFile: path.basename(manuscriptPath),
          rejectionCode,
          cleanedUp: true,
          message:
            "DOCX manuscript uploads are now blocked for new submissions; authors must upload the manuscript as a review-ready PDF.",
        },
        null,
        2,
      ),
    );

    await db.submission.delete({
      where: {
        publicId: submission.publicId,
      },
    });
  } finally {
    await db.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
