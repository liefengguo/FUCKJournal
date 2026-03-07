import { Card, CardContent, CardHeader } from "@/components/ui/card";

type LoadingShellProps = {
  columns?: 2 | 3 | 4;
};

export function LoadingShell({ columns = 3 }: LoadingShellProps) {
  const columnClass =
    columns === 4
      ? "md:grid-cols-4"
      : columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8 px-5 py-16 sm:px-8 lg:px-12">
      <div className="space-y-4 border-b border-border/60 pb-8">
        <div className="h-5 w-28 rounded-full bg-muted" />
        <div className="h-14 w-full max-w-2xl rounded-[24px] bg-muted" />
        <div className="h-5 w-full max-w-3xl rounded-full bg-muted" />
      </div>
      <div className={`grid gap-4 ${columnClass}`}>
        {Array.from({ length: columns }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-6 w-32 rounded-full bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-12 w-20 rounded-[24px] bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="h-8 w-48 rounded-full bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-border/60 px-5 py-4"
            >
              <div className="h-7 w-3/4 rounded-full bg-muted" />
              <div className="mt-3 h-4 w-1/3 rounded-full bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
