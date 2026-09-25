import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 select-none items-center justify-center rounded-md bg-primary font-editor text-[13px] font-bold text-primary-foreground shadow-[0_0_18px_-6px_var(--primary)]",
        className,
      )}
      aria-hidden
    >
      {"</>"}
    </span>
  );
}
