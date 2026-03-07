import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import {
  addInternalNoteAction,
  updateSubmissionStatusAction,
} from "@/app/actions/submissions";
import { requireEditorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionFilePanel } from "@/components/submissions/submission-file-panel";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { SubmissionStructuredContent } from "@/components/submissions/submission-structured-content";
import { SubmissionTimeline } from "@/components/submissions/submission-timeline";
import { SubmissionVersionList } from "@/components/submissions/submission-version-list";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/routing";
import { getSubmissionError, getSubmissionNotice } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getEditorStatusTransitions,
  getSubmissionStatusLabel,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { getEditorialSubmissionDetail } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type EditorialSubmissionDetailPageProps = {
  params: {
    locale: Locale;
    publicId: string;
  };
  searchParams?: {
    notice?: string;
    error?: string;
  };
};

export default async function EditorialSubmissionDetailPage({
  params,
  searchParams,
}: EditorialSubmissionDetailPageProps) {
  const { locale, publicId } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor/submissions/${publicId}`);
  const submission = await getEditorialSubmissionDetail(publicId);

  if (!submission) {
    notFound();
  }

  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const notice = getSubmissionNotice(locale, searchParams?.notice);
  const errorMessage = getSubmissionError(locale, searchParams?.error);
  const transitions = getEditorStatusTransitions(submission.status);
  const latestVersion = submission.versions[0]?.versionNumber ?? 1;

  return (
    <DashboardShell
      locale={locale}
      title={copy.submission.detailTitle}
      intro={copy.editor.intro}
      navItems={[
        {
          href: "/editor",
          label: locale === "zh" ? "概览" : "Overview",
        },
        {
          href: "/editor/submissions",
          label: copy.editor.queueTitle,
          active: true,
        },
      ]}
      action={
        <>
          <Button asChild variant="outline" size="sm">
            <LocaleLink locale={locale} href="/editor/submissions">
              {copy.submission.backToQueueLabel}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
      {errorMessage ? <FlashMessage message={errorMessage} tone="error" /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-3xl">
                  {submission.title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                </CardTitle>
                <p className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {submission.publicId}
                </p>
              </div>
              <SubmissionStatusBadge locale={locale} status={submission.status} />
            </div>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.submission.editorReadonlyNote}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.authorLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.author.name || (locale === "zh" ? "未填写姓名" : "No name provided")}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.emailLabel}
                </p>
                <p className="mt-2 font-serif text-lg">{submission.author.email}</p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.languageLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.manuscriptLanguage || (locale === "zh" ? "未填写" : "Not specified")}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.latestVersionLabel}
                </p>
                <p className="mt-2 font-serif text-lg">v{latestVersion}</p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.updatedLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {formatDate(submission.updatedAt.toISOString(), locale)}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.submittedLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.submittedAt
                    ? formatDate(submission.submittedAt.toISOString(), locale)
                    : locale === "zh"
                      ? "尚未提交"
                      : "Not submitted"}
                </p>
              </div>
            </div>

            <SubmissionStructuredContent
              locale={locale}
              abstract={submission.abstract}
              keywords={submission.keywords}
              coverLetter={submission.coverLetter}
              introduction={submission.introduction}
              mainContent={submission.mainContent}
              conclusion={submission.conclusion}
              references={submission.references}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{copy.submission.updateStatusLabel}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {copy.submission.statusActionHint}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {transitions.length ? (
                <form action={updateSubmissionStatusAction} className="space-y-5">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="publicId" value={publicId} />
                  <input type="hidden" name="currentStatus" value={submission.status} />
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {copy.submission.statusLabel}
                    </label>
                    <select
                      name="status"
                      defaultValue={transitions[0]}
                      className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {transitions.map((status) => (
                        <option key={status} value={status}>
                          {getSubmissionStatusLabel(status, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {copy.submission.noteLabel}
                    </label>
                    <Textarea name="note" className="min-h-[160px]" />
                  </div>
                  <FormSubmitButton
                    type="submit"
                    size="lg"
                    className="w-full"
                    idleLabel={copy.submission.updateStatusLabel}
                    pendingLabel={locale === "zh" ? "更新中..." : "Updating status..."}
                  />
                </form>
              ) : (
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {locale === "zh"
                    ? "当前状态下没有可执行的下一步编辑操作。"
                    : "No further editorial transitions are available from the current state."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.editor.filesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmissionFilePanel
                locale={locale}
                publicId={publicId}
                editable={false}
                assets={[
                  {
                    kind: "manuscript",
                    fileName: submission.manuscriptFileName,
                    mimeType: submission.manuscriptMimeType,
                    sizeBytes: submission.manuscriptSizeBytes,
                    href: `/api/submissions/${publicId}/assets/manuscript`,
                  },
                  {
                    kind: "source",
                    fileName: submission.sourceArchiveFileName,
                    mimeType: submission.sourceArchiveMimeType,
                    sizeBytes: submission.sourceArchiveSizeBytes,
                    href: `/api/submissions/${publicId}/assets/source`,
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.editor.versionsTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.versions.sectionBody}
              </p>
            </CardHeader>
            <CardContent>
              <SubmissionVersionList locale={locale} versions={submission.versions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.editor.notesTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.editor.notesBody}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form action={addInternalNoteAction} className="space-y-4">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="publicId" value={publicId} />
                <Textarea
                  name="body"
                  className="min-h-[160px]"
                  placeholder={uiCopy.editor.notePlaceholder}
                />
                <FormSubmitButton
                  type="submit"
                  size="lg"
                  className="w-full"
                  idleLabel={uiCopy.editor.addNoteLabel}
                  pendingLabel={uiCopy.editor.addingNoteLabel}
                />
              </form>

              {submission.internalNotes.length ? (
                <div className="space-y-4">
                  {submission.internalNotes.map((note) => (
                    <div key={note.id} className="rounded-[24px] border border-border/60 px-5 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-serif text-lg">
                            {note.author.name || note.author.email}
                          </p>
                          <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {formatDate(note.createdAt.toISOString(), locale)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 whitespace-pre-wrap font-serif text-lg leading-relaxed text-muted-foreground">
                        {note.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-border/60 px-5 py-6">
                  <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                    {uiCopy.editor.notesEmpty}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{copy.submission.statusHistoryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SubmissionTimeline
                locale={locale}
                events={submission.statusEvents}
                isDraft={submission.status === "DRAFT"}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
