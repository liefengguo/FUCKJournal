"use client";

import { SegmentErrorState } from "@/components/dashboard/segment-error-state";

type DashboardErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardErrorPage({
  error,
  reset,
}: DashboardErrorPageProps) {
  return <SegmentErrorState error={error} reset={reset} scope="dashboard" />;
}
