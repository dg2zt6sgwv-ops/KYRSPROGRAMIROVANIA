import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { TheoryCards } from "@/components/TheoryCards";
import { QuizBlock } from "@/components/QuizBlock";
import { CodeTaskBlock } from "@/components/CodeTaskBlock";
import { course } from "@/lib/course-data";
import {
  allLessons,
  findLesson,
  lessonNeighbours,
  moduleOfLesson,
} from "@/lib/course-content";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  ListChecks,
  Lock,
  TerminalSquare,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

type Step = "theory" | "quiz" | "task" | "done";

export default function Lesson() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const progress = useQuery(api.progress.getProgress);
  const completeLesson = useMutation(api.progress.completeLesson);
  const resetLesson = useMutation(api.progress.resetLesson);

  const lesson = slug ? findLesson(course, slug) : undefined;
  const module = lesson ? moduleOfLesson(course, lesson.slug) : undefined;
  const neighbours = useMemo(
    () => (slug ? lessonNeighbours(course, slug) : { prev: null, next: null }),
    [slug],
  );

  const doneSlugs = progress?.lessonSlugs ?? [];
  const isCompleted = lesson ? doneSlugs.includes(lesson.slug) : false;

  const [theoryDone, setTheoryDone] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [taskDone, setTaskDone] = useState(false);

  // сброс локальных шагов при переходе на другой урок
  useEffect(() => {
    setTheoryDone(false);
    setQuizPassed(false);
    setTaskDone(false);
  }, [slug]);

  const steps: { id: Step; label: string; icon: typeof ListChecks }[] = [];
  if (lesson) {
    steps.push({ id: "theory", label: "Теория", icon: ListChecks });
    if (lesson.quiz) steps.push({ id: "quiz", label: "Квиз", icon: ListChecks });
    if (lesson.task)
      steps.push({ id: "task", label: "Практика", icon: TerminalSquare });
    steps.push({ id: "done", label: "Готово", icon: Award });
  }

  // Недоступность шагов до выполнения предыдущих
  const stepBlocked = (id: Step): string | null => {
    if (!lesson) return null;
    if (isCompleted) return null;
    if (id === "quiz" && !theoryDone) return "Сначала изучите теорию";
    if (id === "task" && lesson.quiz && !quizPassed)
      return "Сначала пройдите квиз";
    if (id === "done") {
      if (lesson.quiz && !quizPassed) return "Сначала пройдите квиз";
      if (lesson.task && !taskDone) return "Сначала сдайте практику";
    }
    return null;
  };

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="font-editor text-4xl font-bold text-muted-foreground">404</p>
          <p className="text-sm text-muted-foreground">
            Урок «{slug}» не найден.
          </p>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            К программе курса
          </Button>
  </main>
      </div>
    );
  }

  const canFinish =
    (!lesson.quiz || quizPassed) && (!lesson.task || taskDone);

  const handleFinish = () => {
    if (!lesson.slug) return;
    completeLesson({ lessonSlug: lesson.slug });
    toast.success("Урок засчитан! Прогресс сохранён.");
  };

  const activeStep: Step = (() => {
    if (isCompleted) return "done";
    if (canFinish) return "done";
    if (lesson.task && !taskDone && (!lesson.quiz || quizPassed)) return "task";
    if (lesson.quiz && !quizPassed && theoryDone) return "quiz";
    return "theory";
  })();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Хлебные крошки */}
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 font-editor text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">
            ~/курс
          </Link>
          <span>/</span>
          <span className="text-foreground">
            {module?.title ?? "Урок"}
          </span>
          <span>/</span>
          <span className="text-primary">{lesson.slug}.md</span>
        </nav>

        {/* Заголовок урока */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {lesson.minutes} мин
              </span>
              <span>{lesson.summary}</span>
            </p>
          </div>
          {isCompleted && (
            <span className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 font-editor text-xs text-primary">
              <CheckCircle2 className="size-3.5" /> урок пройден
            </span>
          )}
        </div>

        {/* Шаги */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {steps.map((s, i) => {
            const blocked = stepBlocked(s.id);
            const isActive = activeStep === s.id && !isCompleted;
            const isStepDone =
              isCompleted ||
              (s.id === "theory" && theoryDone) ||
              (s.id === "quiz" && quizPassed) ||
              (s.id === "task" && taskDone) ||
              (s.id === "done" && canFinish);
            return (
              <span key={s.id} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground/40">→</span>}
                <span
                  className={
                    "flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-editor text-xs transition-colors " +
                    (blocked
                      ? "border-border/60 text-muted-foreground/60"
                      : s.id === "done" && (isCompleted || canFinish)
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : isActive
                          ? "border-primary/50 bg-primary/5 text-foreground"
                          : "border-border/60 text-muted-foreground")
                  }
                >
                  {blocked ? (
                    <Lock className="size-3" />
                  ) : isStepDone ? (
                    <CheckCircle2 className="size-3 text-primary" />
                  ) : (
                    <s.icon className="size-3" />
                  )}
                  {s.label}
                </span>
              </span>
            );
          })}
        </div>

        {/* Теория */}
        <section className="mb-10">
          <TheoryCards cards={lesson.theory} />
          {!theoryDone && (
            <div className="mt-4">
              <Button onClick={() => setTheoryDone(true)} className="font-editor">
                Теорию изучил — дальше
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Квиз */}
        {lesson.quiz && (
          <section className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-semibold">Проверь себя</h2>
              <span className="font-editor text-xs text-muted-foreground">
                {quizPassed ? "✓ пройден" : "нужно для доступа к практике"}
              </span>
            </div>
            <QuizBlock
              quiz={lesson.quiz}
              onPassed={(correct, total) => {
                setQuizPassed(true);
                toast.success(`Квиз пройден: ${correct}/${total}`);
              }}
            />
          </section>
        )}

        {/* Практика */}
        {lesson.task && (
          <section className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-semibold">Домашнее задание</h2>
              <span className="font-editor text-xs text-muted-foreground">
                {taskDone ? "✓ сдано" : "автопроверка в песочнице"}
              </span>
            </div>
            <CodeTaskBlock
              task={lesson.task}
              lessonSlug={lesson.slug}
              onPassed={() => {
                setTaskDone(true);
                toast.success("Задание сдано — автопроверка пройдена");
              }}
            />
          </section>
        )}

        {/* Завершение */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              "rounded-xl border p-5 " +
              (canFinish || isCompleted
                ? "border-primary/40 bg-primary/5"
                : "border-border/60 bg-card")
            }
          >
            {isCompleted ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-editor text-sm text-primary">
                  <CheckCircle2 className="mr-1.5 inline size-4" />
                  урок пройден — прогресс сохранён
                </p>
                <span className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-editor"
                    onClick={() => {
                      resetLesson({ lessonSlug: lesson.slug });
                      toast.info("Можно пройти урок заново");
                    }}
                  >
                    Пройти заново
                  </Button>
                  {neighbours.next && (
                    <Button
                      size="sm"
                      className="gap-1.5 font-editor"
                      onClick={() => {
                        setTheoryDone(false);
                        setQuizPassed(false);
                        setTaskDone(false);
                        navigate(`/lesson/${neighbours.next!.slug}`);
                      }}
                    >
                      Следующий урок
                      <ArrowRight className="size-4" />
                    </Button>
                  )}
                </span>
              </div>
            ) : canFinish ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-foreground/90">
                  Всё выполнено! Осталось зафиксировать прогресс.
                </p>
                <Button className="gap-1.5 font-editor" onClick={handleFinish}>
                  <CheckCircle2 className="size-4" />
                  Завершить урок
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Завершите все шаги урока — и здесь появится кнопка «Завершить
                урок».
              </p>
            )}
          </motion.div>
        </section>

        {/* Навигация */}
        <nav className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-6">
          {neighbours.prev ? (
            <Button variant="ghost" className="gap-1.5 font-editor" onClick={() => navigate(`/lesson/${neighbours.prev!.slug}`)}>
              <ArrowLeft className="size-4" />
              {neighbours.prev.title}
            </Button>
          ) : (
            <span />
          )}
          {neighbours.next ? (
            <Button
              variant="ghost"
              className="gap-1.5 font-editor"
              onClick={() => navigate(`/lesson/${neighbours.next!.slug}`)}
            >
              {neighbours.next.title}
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <span />
          )}
        </nav>
      </main>
    </div>
  );
}
