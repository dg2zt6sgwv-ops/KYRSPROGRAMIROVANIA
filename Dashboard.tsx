import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SiteHeader } from "@/components/SiteHeader";
import { course } from "@/lib/course-data";
import { allLessons } from "@/lib/course-content";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  PlayCircle,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const progress = useQuery(api.progress.getProgress);
  const resetLesson = useMutation(api.progress.resetLesson);

  const lessons = useMemo(() => allLessons(course), []);
  const completedSlugs = progress?.lessonSlugs ?? [];
  const completed = completedSlugs.length;
  const total = lessons.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const [confirmResetSlug, setConfirmResetSlug] = useState<string | null>(null);

  const nextLesson = useMemo(() => {
    const unfinished = lessons.find(
      (l) => !completedSlugs.includes(l.slug),
    );
    return unfinished ?? lessons[0];
  }, [lessons, completedSlugs]);

  const handleReset = (slug: string) => {
    resetLesson({ lessonSlug: slug });
    setConfirmResetSlug(null);
    toast.success("Прогресс урока сброшен — можно пройти заново");
  };

  const displayName = user?.isAnonymous
    ? "Гость"
    : user?.name ?? user?.email ?? "Ученик";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-editor text-xs text-primary">
              ~/dashboard $
              <span className="ml-2 animate-blink">▍</span>
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Привет, {displayName}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.title} · всё бесплатно, всё в вашем темпе
            </p>
          </div>
        </div>

        {/* Прогресс + следующий урок */}
        <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/60 bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Общий прогресс</h2>
              <span className="font-editor text-sm text-primary">
                {completed}/{total} уроков
              </span>
            </div>
            <Progress value={pct} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {pct}% курса пройдено
              {completed === total && completed > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 font-editor text-primary">
                  <Award className="size-3.5" /> курс завершён — поздравляем!
                </span>
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5"
          >
            <div>
              <p className="font-editor text-xs text-primary">// следующий урок</p>
              <h3 className="mt-1.5 font-semibold leading-snug">
                {nextLesson?.title ?? "Курс завершён"}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {nextLesson?.minutes ?? 0} мин
              </p>
            </div>
            <Button
              className="w-full gap-2 font-editor"
              onClick={() => navigate(`/lesson/${nextLesson?.slug ?? ""}`)}
              disabled={!nextLesson}
            >
              <PlayCircle className="size-4" />
              {completed > 0 ? "Продолжить" : "Начать курс"}
            </Button>
          </motion.div>
        </div>

        {/* Программа */}
        <h2 className="mb-4 font-editor text-sm text-muted-foreground">
          // программа курса
        </h2>
        <div className="flex flex-col gap-6">
          {course.modules.map((m, mi) => {
            const modDone = m.lessons.every((l) => completedSlugs.includes(l.slug));
            return (
              <section key={m.id}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-editor text-xs text-primary">
                    module-{mi + 1}
                  </span>
                  <h3 className="font-semibold">{m.title}</h3>
                  {modDone && (
                    <span className="font-editor text-xs text-primary">
                      ✓ модуль пройден
                    </span>
                  )}
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{m.goal}</p>
                <div className="flex flex-col gap-2">
                  {m.lessons.map((l) => {
                    const done = completedSlugs.includes(l.slug);
                    const locked = false;
                    const isConfirming = confirmResetSlug === l.slug;
                    return (
                      <motion.div
                        key={l.slug}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.25 }}
                        className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/40"
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/lesson/${l.slug}`)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          {done ? (
                            <CheckCircle2 className="size-5 shrink-0 text-primary" />
                          ) : (
                            <Circle className="size-5 shrink-0 text-muted-foreground/50 group-hover:text-primary/70" />
                          )}
                          <span className="min-w-0">
                            <span className="block truncate font-medium">
                              {l.title}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" /> {l.minutes} мин
                              </span>
                              {l.quiz && (
                                <span className="flex items-center gap-1">
                                  <ListChecks className="size-3" /> квиз
                                </span>
                              )}
                              {l.task && (
                                <span className="flex items-center gap-1">
                                  <TerminalSquare className="size-3" /> практика
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                        {done ? (
                          isConfirming ? (
                            <span className="flex shrink-0 items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 gap-1 px-2 font-editor text-xs text-destructive hover:text-destructive"
                                onClick={() => handleReset(l.slug)}
                              >
                                сбросить
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 font-editor text-xs"
                                onClick={() => setConfirmResetSlug(null)}
                              >
                                отмена
                              </Button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              title="Пройти заново"
                              className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                              onClick={() => setConfirmResetSlug(l.slug)}
                            >
                              <RotateCcw className="size-3.5" />
                            </button>
                          )
                        ) : (
                          <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-primary" />
                        )}
                        {locked && null}
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 text-xs text-muted-foreground">
          <span className="font-editor">
            кодовая<span className="text-primary">база</span>
          </span>{" "}
          · письменный курс с автопроверкой домашек
        </div>
      </footer>
    </div>
  );
}
