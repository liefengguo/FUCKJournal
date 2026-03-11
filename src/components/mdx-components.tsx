/* eslint-disable @next/next/no-img-element */

import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={`mt-16 font-serif text-[2.15rem] font-semibold leading-snug tracking-normal text-black ${className ?? ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={`mt-10 font-serif text-[1.62rem] font-semibold leading-snug tracking-normal text-black ${className ?? ""}`}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={`font-serif text-[1.08rem] leading-9 text-black ${className ?? ""}`}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={`underline decoration-black/25 underline-offset-4 transition-colors hover:text-black ${className ?? ""}`}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={`space-y-3 pl-6 font-serif text-[1.04rem] leading-8 text-black ${className ?? ""}`} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={`space-y-3 pl-6 font-serif text-[1.04rem] leading-8 text-black ${className ?? ""}`} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`border-l-2 border-black/15 px-5 py-1 font-serif text-[1.08rem] italic leading-8 text-black/80 ${className ?? ""}`}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={`my-12 border-black/10 ${className ?? ""}`} {...props} />
  ),
  figure: ({ className, ...props }) => (
    <figure
      className={`my-10 ${className ?? ""}`}
      {...props}
    />
  ),
  figcaption: ({ className, ...props }) => (
    <figcaption
      className={`mt-3 font-serif text-[0.96rem] leading-6 text-black/70 ${className ?? ""}`}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }) => (
    <img
      className={`h-auto w-full border border-black/10 bg-white ${className ?? ""}`}
      alt={alt ?? ""}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="article-table-wrap">
      <table
        className={`w-full min-w-[32rem] border-collapse border border-black/10 bg-white ${className ?? ""}`}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th
      className={`border border-black/10 bg-black/[0.035] px-4 py-3 text-left font-sans text-[11px] uppercase tracking-[0.22em] text-black/60 ${className ?? ""}`}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={`border border-black/10 px-4 py-3 font-serif text-[1rem] leading-7 text-black/90 ${className ?? ""}`}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={`my-8 overflow-x-auto border border-black/10 bg-black/[0.03] px-5 py-4 font-mono text-sm leading-7 text-black ${className ?? ""}`}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={`bg-black/[0.045] px-1.5 py-0.5 font-mono text-[0.92em] text-black ${className ?? ""}`}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong className={`font-semibold text-black ${className ?? ""}`} {...props} />
  ),
};
