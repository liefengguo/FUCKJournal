"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SubmissionFormProps = {
  locale: Locale;
  submitLabel: string;
  uploadLabel: string;
  uploadHint: string;
};

export function SubmissionForm({
  locale,
  submitLabel,
  uploadLabel,
  uploadHint,
}: SubmissionFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [abstractText, setAbstractText] = useState("");

  const labels =
    locale === "zh"
      ? {
          name: "姓名",
          email: "邮箱",
          title: "题目",
          abstract: "摘要",
        }
      : {
          name: "Name",
          email: "Email",
          title: "Title",
          abstract: "Abstract",
        };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `[Submission] ${title || "Untitled manuscript"}`;
    const body = [
      `${labels.name}: ${name}`,
      `${labels.email}: ${email}`,
      `${labels.title}: ${title}`,
      "",
      `${labels.abstract}:`,
      abstractText,
      "",
      uploadHint,
    ].join("\n");

    window.location.href = `mailto:submissions@fuckjournal.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {labels.name}
              </label>
              <Input value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {labels.email}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {labels.title}
            </label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {labels.abstract}
            </label>
            <Textarea
              value={abstractText}
              onChange={(event) => setAbstractText(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {uploadLabel}
            </label>
            <Input type="file" disabled />
            <p className="font-serif text-base leading-relaxed text-muted-foreground">
              {uploadHint}
            </p>
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
