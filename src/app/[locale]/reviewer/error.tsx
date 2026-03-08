"use client";

import { SegmentErrorState } from "@/components/dashboard/segment-error-state";

type ReviewerErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReviewerErrorPage({
  error,
  reset,
}: ReviewerErrorPageProps) {
  return <SegmentErrorState error={error} reset={reset} scope="reviewer" />;
}
