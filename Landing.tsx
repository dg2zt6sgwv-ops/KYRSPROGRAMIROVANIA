import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { course } from "@/lib/course-data";
import { allLessons } from "@/lib/course-content";
import { highlightCode } from "@/lib/highlight.tsx";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCode2,
  ListChecks,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";

const HERO_CODE = `// добро пожаловать в курс
const ученик = { имя: "вы", опыт: "с нуля" };

function начать(ученик) {
  return "первая страница уже сегодня";
}

начать(ученик);`;

const FEATURES = [
  {
    icon: FileCode2,
    title: "Теория карточками",
    text: "Короткие карточки-файлы с подсветкой кода. Читается как документация, а не как лекция.",
  },
  {
    icon: ListChecks,
    title: "Квизы с разбором",
    text: "Сразу проверьте понимание: к каждому вопросу — объяснение, почему именно так.",
  },
  {
    icon: TerminalSquare,
    title: "Домашка с автопроверкой",
    text: "Пишете HTML, CSS и JS прямо на сайте. Песочница проверяет результат по пунктам.",
  },
  {
    icon: Zap,
    title: "Без видеовстреч",
    text: "Всё письменное, в своём темпе. Прогресс сохраняется — продолжайте с любого места.",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const lessonsCount = allLessons(course).length;
  const tasksCount = allLessons(course).filter((l) => l.task).length;
  const quizCount = allLessons(course).filter((l) => l.quiz).length;

  const primaryHref = isAuthenticated ? "/dashboard" : "/auth?returnTo=%2Fdashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Шапка */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-editor text-sm font-semibold">
              кодовая<span className="text-primary">база</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="sm"
              variant="outline"
              className="font-editor text-xs"
              onClick={() => navigate(primaryHref)}
            >
              {isAuthenticated ? "В кабинет" : "Войти"}
            </Button>
          </div>
        </div>
      </header>

      {/* Герой */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="outline" className="gap-1.5 border-primary/40 text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                бесплатно · без видеовстреч · в своём темпе
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
            >
              Веб-разработка с нуля —{" "}
              <span className="text-primary">письменный курс</span> с проверкой
              домашек
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="max-w-xl text-pretty text-base leading-7 text-muted-foreground"
            >
              {lessonsCount} уроков в формате редактора кода: короткая теория,
              квизы и {tasksCount} код-заданий, которые проверяет песочница.
              Никаких созвонов — учитесь в удобное время.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button size="lg" className="gap-2 font-editor" onClick={() => navigate(primaryHref)}>
                Начать учиться
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-editor"
                onClick={() => navigate(primaryHref)}
              >
                Посмотреть программу
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.32 }}
              className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> {quizCount} квизов с разбором
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> автопроверка кода
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> 0 ₽ навсегда
              </span>
            </motion.div>
          </div>

          {/* Окно редактора */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="animate-float-y overflow-hidden rounded-xl border border-border/70 bg-editor-window shadow-2xl shadow-black/30"
          >
            <div className="flex items-center gap-2 border-b border-border/60 bg-editor-gutter px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-editor text-[11px] text-muted-foreground">
                урок-01.js
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-editor text-[13px] leading-6">
              <code>{highlightCode(HERO_CODE, "js")}</code>
            </pre>
            <div className="border-t border-border/60 px-5 py-3 font-editor text-xs text-primary">
              <span className="animate-blink">▍</span> вывод: «первая страница
              уже сегодня»
            </div>
          </motion.div>
        </div>
      </section>

      {/* Фичи */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-lg border border-border/60 bg-card p-5"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <f.icon className="size-4" />
              </div>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Программа курса */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-editor text-xs text-primary">// программа</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Четыре модуля — от первого тега до финального проекта
            </h2>
          </div>
          <Button variant="outline" className="gap-2 font-editor" onClick={() => navigate(primaryHref)}>
            Открыть курс
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {course.modules.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="overflow-hidden rounded-lg border border-border/60 bg-card"
            >
              <div className="flex items-center gap-3 border-b border-border/60 bg-editor-gutter/50 px-4 py-2.5 font-editor text-xs">
                <span className="text-primary">m{i + 1}/</span>
                <span className="font-semibold text-foreground">{m.title}</span>
                <span className="ml-auto text-muted-foreground">
                  {m.lessons.length} урока
                </span>
              </div>
              <div className="p-4">
                <p className="mb-3 text-sm text-muted-foreground">{m.goal}</p>
                <ul className="flex flex-col gap-1.5">
                  {m.lessons.map((l) => (
                    <li
                      key={l.slug}
                      className="flex items-center gap-2 font-editor text-xs text-foreground/80"
                    >
                      <Code2 className="size-3.5 shrink-0 text-primary/70" />
                      {l.title}
                      <span className="ml-auto shrink-0 text-muted-foreground/70">
                        {l.minutes} мин
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center">
          <p className="font-editor text-xs text-primary">$ npm run начать</p>
          <h2 className="max-w-2xl text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Первая страница — уже через 15 минут
          </h2>
          <p className="max-w-xl text-pretty text-sm leading-6 text-muted-foreground">
            Курс полностью бесплатный: без подписок, спонсорских таймеров и
            «про»-версий. Просто входите и учитесь.
          </p>
          <Button size="lg" className="gap-2 font-editor" onClick={() => navigate(primaryHref)}>
            Начать бесплатно
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground">
          <span className="font-editor">
            кодовая<span className="text-primary">база</span> · письменные курсы
            с автопроверкой
          </span>
          <span>© 2026 · сделано для тех, кто учится в своём темпе</span>
        </div>
      </footer>
    </div>
  );
}
