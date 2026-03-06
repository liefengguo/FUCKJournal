import type { TocItem } from "@/lib/articles";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  items: TocItem[];
  title: string;
};

export function TableOfContents({ items, title }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="top-28 rounded-[28px] border border-border bg-card/70 p-6 shadow-editorial lg:sticky">
      <p className="font-sans text-xs uppercase tracking-[0.28em] text-muted-foreground">
        {title}
      </p>
      <nav className="mt-5 space-y-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block font-serif leading-relaxed text-muted-foreground transition-colors hover:text-foreground",
              item.level === 3 ? "pl-4 text-sm" : "text-base",
            )}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
