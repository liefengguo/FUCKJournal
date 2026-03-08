"use client";

import { SegmentErrorState } from "@/components/dashboard/segment-error-state";

type EditorErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EditorErrorPage({
  error,
  reset,
}: EditorErrorPageProps) {
  return <SegmentErrorState error={error} reset={reset} scope="editor" />;
}
