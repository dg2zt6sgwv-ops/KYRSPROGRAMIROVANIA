import { highlightCode } from "@/lib/highlight.tsx";
import type { TheoryCard } from "@/lib/course-content";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileCode2 } from "lucide-react";
import { useState } from "react";

const LANG_LABEL: Record<TheoryCard["lang"], string> = {
  html: "html",
  css: "css",
  js: "javascript",
};

export function TheoryCards({ cards }: { cards: TheoryCard[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-1">
        {cards.map((card, i) => (
          <button
            key={card.filename}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "flex items-center gap-2 rounded-t-md border border-b-0 border-border/60 px-3 py-1.5 font-editor text-xs transition-colors",
              i === active
                ? "bg-editor-window text-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <FileCode2 className="size-3.5 text-primary" />
            {card.filename}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-lg rounded-tl-none border border-border/60 bg-editor-window"
      >
        <div className="border-b border-border/60 px-4 py-3">
          <p className="text-sm leading-6 text-foreground/90">{cards[active].intro}</p>
        </div>
        <pre className="overflow-x-auto bg-editor-gutter/40 p-4 font-editor text-[13px] leading-6">
          <code>{highlightCode(cards[active].code, cards[active].lang)}</code>
        </pre>
        {cards[active].note && (
          <div className="border-t border-border/60 px-4 py-3 text-xs leading-5 text-muted-foreground">
            <span className="mr-1.5 text-primary">//</span>
            {cards[active].note}
          </div>
        )}
      </motion.div>
    </div>
  );
}
