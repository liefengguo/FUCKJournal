import { expect, test, type Browser, type Page } from "@playwright/test";

const locale = "zh";
const fixturePdfPath = `${process.cwd()}/tests/fixtures/launch-review-manuscript.pdf`;

const editorAccount = {
  email: process.env.SEED_TEST_EDITOR_EMAIL ?? "editor@fuckjournal.local",
  password: process.env.SEED_TEST_EDITOR_PASSWORD ?? "Phase1Editor123!",
  homePath: `/${locale}/editor`,
};

const reviewerAccount = {
  email: process.env.SEED_TEST_REVIEWER_EMAIL ?? "reviewer@fuckjournal.local",
  password: process.env.SEED_TEST_REVIEWER_PASSWORD ?? "Phase3Reviewer123!",
  homePath: `/${locale}/reviewer`,
};

function absoluteUrl(baseURL: string, pathname: string) {
  return new URL(pathname, baseURL).toString();
}

function extractPublicId(url: string) {
  const match = url.match(/submissions\/([^/?]+)\//);

  if (!match?.[1]) {
    throw new Error(`Unable to extract submission publicId from URL: ${url}`);
  }

  return match[1];
}

async function signIn(
  page: Page,
  baseURL: string,
  email: string,
  password: string,
  expectedHomePath: string,
) {
  await page.goto(absoluteUrl(baseURL, `/${locale}/sign-in`));
  await page.getByTestId("sign-in-email").fill(email);
  await page.getByTestId("sign-in-password").fill(password);
  await page.getByTestId("sign-in-submit").click();
  await expect(page).toHaveURL(new RegExp(`${expectedHomePath}(\\?|$)`));
}

async function openSignedInPage(
  browser: Browser,
  baseURL: string,
  account: { email: string; password: string; homePath: string },
) {
  const context = await browser.newContext();
  const page = await context.newPage();

  await signIn(page, baseURL, account.email, account.password, account.homePath);

  return { context, page };
}

test.describe("critical journal workflow", () => {
  test("sign up, submit, review, accept, and export records", async ({
    browser,
    page,
    baseURL,
  }) => {
    test.setTimeout(240_000);

    if (!baseURL) {
      throw new Error("Playwright baseURL is required.");
    }

    const runId = Date.now();
    const contributorEmail = `launch-flow-${runId}@example.test`;
    const contributorPassword = "LaunchFlow123!";
    const manuscriptTitle = `Launch Readiness Workflow ${runId}`;

    await page.goto(absoluteUrl(baseURL, `/${locale}/sign-up`));
    await page.getByTestId("sign-up-name").fill("Launch Flow Contributor");
    await page.getByTestId("sign-up-email").fill(contributorEmail);
    await page.getByTestId("sign-up-password").fill(contributorPassword);
    await page.getByTestId("sign-up-submit").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/dashboard(\\?|$)`));

    await page.goto(absoluteUrl(baseURL, `/${locale}/submit`));
    await page.getByTestId("submission-portal-start-button").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/dashboard/submissions/[^/]+/edit(\\?|$)`),
    );

    const publicId = extractPublicId(page.url());

    await page.getByTestId("submission-title").fill(manuscriptTitle);
    await page
      .getByTestId("submission-abstract")
      .fill(
        "This manuscript is used to validate the contributor, editorial, reviewer, and publication workflow before launch. It is intentionally long enough to satisfy screening checks.",
      );
    await page.getByTestId("submission-keywords").fill("launch, workflow, protocol");
    await page
      .getByTestId("submission-cover-letter")
      .fill("Please consider this manuscript as part of the launch-readiness workflow test.");
    await page.getByTestId("submission-language").selectOption("zh");

    await page.getByTestId("submission-file-input-manuscript").setInputFiles(fixturePdfPath);
    const uploadResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/api/submissions/${publicId}/assets`) &&
      response.request().method() === "POST",
    );
    await page.getByTestId("submission-file-upload-button-manuscript").click();
    const uploadResponse = await uploadResponsePromise;
    expect(uploadResponse.ok()).toBeTruthy();
    await expect(page.getByTestId("submission-file-current-manuscript")).toContainText(
      "launch-review-manuscript.pdf",
    );

    await page.getByTestId("submission-save-button").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/dashboard/submissions/${publicId}/edit\\?notice=saved`),
    );

    await page.getByTestId("submission-send-button").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/dashboard/submissions/${publicId}\\?notice=submitted`),
    );

    const editor = await openSignedInPage(browser, baseURL, editorAccount);
    const editorPage = editor.page;

    await editorPage.goto(absoluteUrl(baseURL, `/${locale}/editor/submissions/${publicId}`));
    const reviewerOptions = editorPage.locator(
      '[data-testid="editor-assign-reviewer-select"] option',
    );
    const reviewerId = await reviewerOptions.first().getAttribute("value");

    if (!reviewerId) {
      throw new Error("No reviewer account is available for assignment.");
    }

    await editorPage.getByTestId("editor-assign-reviewer-select").selectOption(reviewerId);
    await editorPage.getByTestId("editor-assign-reviewer-button").click();
    await expect(editorPage).toHaveURL(
      new RegExp(`/${locale}/editor/submissions/${publicId}\\?notice=reviewer-assigned`),
    );

    await editorPage.getByTestId("editor-status-select").selectOption("UNDER_REVIEW");
    await editorPage
      .getByTestId("editor-status-note")
      .fill("Move the manuscript into formal peer review.");
    await editorPage.getByTestId("editor-status-button").click();
    await expect(editorPage).toHaveURL(
      new RegExp(`/${locale}/editor/submissions/${publicId}\\?notice=updated`),
    );

    const reviewer = await openSignedInPage(browser, baseURL, reviewerAccount);
    const reviewerPage = reviewer.page;

    await reviewerPage.goto(absoluteUrl(baseURL, `/${locale}/reviewer/submissions/${publicId}`));
    await reviewerPage.getByTestId("reviewer-decision").selectOption("ACCEPT");
    await reviewerPage
      .getByTestId("reviewer-comments-author")
      .fill("The manuscript is clear enough for launch validation and publication testing.");
    await reviewerPage
      .getByTestId("reviewer-comments-editor")
      .fill("Recommend acceptance so export and publication handoff can be validated.");
    await reviewerPage.getByTestId("reviewer-save-review").click();
    await expect(reviewerPage).toHaveURL(
      new RegExp(`/${locale}/reviewer/submissions/${publicId}\\?notice=review-saved`),
    );

    await editorPage.goto(absoluteUrl(baseURL, `/${locale}/editor/submissions/${publicId}`));
    await editorPage.getByTestId("editor-status-select").selectOption("ACCEPTED");
    await editorPage
      .getByTestId("editor-status-note")
      .fill("Accepted after reviewer confirmation in launch workflow test.");
    await editorPage.getByTestId("editor-status-button").click();
    await expect(editorPage).toHaveURL(
      new RegExp(`/${locale}/editor/submissions/${publicId}\\?notice=updated`),
    );

    await editorPage.goto(absoluteUrl(baseURL, `/${locale}/editor/publications/${publicId}`));
    await expect(editorPage).toHaveURL(
      new RegExp(`/${locale}/editor/publications/${publicId}(\\?|$)`),
    );

    const markdownResponsePromise = editorPage.waitForResponse((response) =>
      response.url().includes(`/api/editor/publications/${publicId}/markdown`) &&
      response.request().method() === "GET",
    );
    await editorPage.getByTestId("publication-export-markdown").click();
    const markdownResponse = await markdownResponsePromise;
    expect(markdownResponse.ok()).toBeTruthy();
    expect(markdownResponse.headers()["content-type"]).toContain("text/markdown");

    const jsonResponsePromise = editorPage.waitForResponse((response) =>
      response.url().includes(`/api/editor/publications/${publicId}/json`) &&
      response.request().method() === "GET",
    );
    await editorPage.getByTestId("publication-export-json").click();
    const jsonResponse = await jsonResponsePromise;
    expect(jsonResponse.ok()).toBeTruthy();
    expect(jsonResponse.headers()["content-type"]).toContain("application/json");

    await reviewer.context.close();
    await editor.context.close();
  });
});
