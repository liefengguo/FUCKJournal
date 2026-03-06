import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={`mt-16 font-display text-4xl leading-tight tracking-tight text-foreground ${className ?? ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={`mt-12 font-display text-2xl leading-tight tracking-tight text-foreground ${className ?? ""}`}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={`font-serif text-xl leading-[1.95] text-foreground/90 ${className ?? ""}`}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={`underline decoration-journal-red/40 underline-offset-4 transition-colors hover:text-journal-red dark:decoration-journal-gold/40 dark:hover:text-journal-gold ${className ?? ""}`}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={`space-y-3 pl-6 font-serif text-xl leading-[1.85] ${className ?? ""}`} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={`space-y-3 pl-6 font-serif text-xl leading-[1.85] ${className ?? ""}`} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`border-l-2 border-journal-red/50 pl-6 font-display text-3xl italic leading-relaxed text-foreground/85 dark:border-journal-gold/50 ${className ?? ""}`}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={`my-12 border-border ${className ?? ""}`} {...props} />
  ),
};
