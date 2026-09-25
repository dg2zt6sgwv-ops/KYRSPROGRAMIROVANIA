import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/lib/course-content";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function QuizBlock({
  quiz,
  onPassed,
}: {
  quiz: Quiz;
  onPassed: (correct: number, total: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const total = quiz.questions.length;
  const correct = useMemo(
    () =>
      quiz.questions.filter((q) => answers[q.id] === q.correctId).length,
    [answers, quiz.questions],
  );

  const isComplete = checked && correct === total;
  const notified = useRef(false);
  useEffect(() => {
    if (isComplete && !notified.current) {
      notified.current = true;
      onPassed(correct, total);
    }
  }, [isComplete, correct, total, onPassed]);

  const handleCheck = () => setChecked(true);
  const handleRetake = () => {
    setAnswers({});
    setChecked(false);
    notified.current = false;
  };

  return (
    <div className="flex flex-col gap-4">
      {quiz.questions.map((q, qIdx) => {
        const selected = answers[q.id];
        const isRight = selected === q.correctId;
        return (
          <div
            key={q.id}
            className={cn(
              "rounded-lg border bg-card p-4 transition-colors",
              checked && (isRight ? "border-primary/50" : "border-destructive/50"),
            )}
          >
            <p className="mb-3 flex items-start gap-2 text-sm font-medium">
              <span className="font-editor text-primary">
                {String(qIdx + 1).padStart(2, "0")}
              </span>
              {q.prompt}
            </p>
            <RadioGroup
              value={selected ?? ""}
              onValueChange={(v) => {
                if (!checked) setAnswers((a) => ({ ...a, [q.id]: v }));
              }}
              className="gap-2"
            >
              {q.options.map((opt) => {
                const isSelected = selected === opt.id;
                const showCorrect = checked && opt.id === q.correctId;
                const showWrong = checked && isSelected && opt.id !== q.correctId;
                return (
                  <Label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-3 text-sm font-normal transition-colors",
                      "hover:bg-muted/60",
                      isSelected && !checked && "border-primary/40 bg-primary/5",
                      showCorrect && "border-primary/60 bg-primary/10",
                      showWrong && "border-destructive/60 bg-destructive/10",
                    )}
                  >
                    <RadioGroupItem value={opt.id} className="mt-0.5" />
                    <span className="flex-1">{opt.text}</span>
                    {showCorrect && (
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    )}
                    {showWrong && (
                      <XCircle className="size-4 shrink-0 text-destructive" />
                    )}
                  </Label>
                );
              })}
            </RadioGroup>
            {checked && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-3 rounded-md bg-muted/60 p-3 text-xs leading-5",
                  isRight ? "text-foreground" : "text-foreground/90",
                )}
              >
                <span className={cn("font-editor", isRight ? "text-primary" : "text-destructive")}>
                  {isRight ? "// верно" : "// разбор"}
                </span>{" "}
                {q.explanation}
              </motion.p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {checked ? (
          <>
            <p className="font-editor text-sm">
              <span className={correct === total ? "text-primary" : "text-muted-foreground"}>
                {correct}/{total}
              </span>{" "}
              <span className="text-muted-foreground">верных ответов</span>
            </p>
            {correct === total ? (
              <p className="font-editor text-sm text-primary">
                ✓ квиз пройден — домашка разблокирована
              </p>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRetake}>
                <RotateCcw className="size-3.5" />
                Пройти заново
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Ответьте на все вопросы и проверьте себя.
            </p>
            <Button
              size="sm"
              disabled={Object.keys(answers).length < total}
              onClick={handleCheck}
            >
              Проверить ответы
            </Button>
          </>
        )}
      </div>
    </div>
  );
}


