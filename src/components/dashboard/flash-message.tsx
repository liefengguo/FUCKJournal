import { cn } from "@/lib/utils";

type FlashMessageProps = {
  message: string;
  tone?: "success" | "error";
};

export function FlashMessage({
  message,
  tone = "success",
}: FlashMessageProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border px-5 py-4 font-serif text-base leading-relaxed",
        tone === "success"
          ? "border-journal-red/20 bg-journal-red/10 text-foreground"
          : "border-journal-red/30 bg-journal-red/10 text-journal-red",
      )}
    >
      {message}
    </div>
  );
}
