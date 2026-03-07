import { createDraftAction } from "@/app/actions/submissions";
import { getServerAuthSession } from "@/auth";
import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlatformCopy } from "@/lib/platform-copy";
import { isStaffRole } from "@/lib/submission-status";

type SubmissionFormProps = {
  locale: Locale;
};

export async function SubmissionForm({ locale }: SubmissionFormProps) {
  const session = await getServerAuthSession();
  const copy = getPlatformCopy(locale).submitPortal;
  const isStaff = session?.user ? isStaffRole(session.user.role) : false;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>{session?.user ? copy.memberTitle : copy.guestTitle}</CardTitle>
        <p className="font-serif text-lg leading-relaxed text-muted-foreground">
          {session?.user ? copy.memberBody : copy.guestBody}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {session?.user ? (
          <>
            <div className="rounded-[24px] border border-border/60 px-5 py-4">
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.signedInAs}
              </p>
              <p className="mt-3 font-serif text-lg">
                {session.user.name || session.user.email}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!isStaff ? (
                <form action={createDraftAction} className="w-full sm:w-auto">
                  <input type="hidden" name="locale" value={locale} />
                  <FormSubmitButton
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    idleLabel={copy.createDraftLabel}
                    pendingLabel={locale === "zh" ? "创建中..." : "Creating draft..."}
                  />
                </form>
              ) : null}
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <LocaleLink locale={locale} href={isStaff ? "/editor" : "/dashboard"}>
                  {isStaff ? copy.editorLabel : copy.dashboardLabel}
                </LocaleLink>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <LocaleLink locale={locale} href="/sign-in">
                  {copy.signInLabel}
                </LocaleLink>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <LocaleLink locale={locale} href="/sign-up">
                  {copy.signUpLabel}
                </LocaleLink>
              </Button>
            </div>
            <p className="font-serif text-base leading-relaxed text-muted-foreground">
              {copy.authNote}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
