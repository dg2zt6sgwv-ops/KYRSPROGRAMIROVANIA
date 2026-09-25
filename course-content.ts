/* ---------- Квизы ---------- */

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

/* ---------- Код-задания ---------- */

/** A single verifiable condition over the rendered result. */
export interface CheckDefinition {
  checkId: string;
  title: string;
  /** Returns true if the check passes against the rendered sandbox DOM. */
  test: (h: CheckHelpers) => boolean;
  hintOk: string;
  hintFail?: string;
}

/** Minimal DOM helpers passed to each check. */
export interface CheckHelpers {
  element: HTMLElement;
  q: (sel: string) => Element | null;
  qa: (sel: string) => Element[];
  text: (sel: string) => string;
  normText: (s: string) => string;
  /** Computed style property of the first matched element. */
  style: (sel: string, prop: string) => string;
  /** Attribute of the first matched element. */
  attr: (sel: string, name: string) => string | null;
  /** A global function defined by the learner's JS, if it exists. */
  fn: (name: string) => ((...a: unknown[]) => unknown) | null;
  /** Dispatch a click on the first matched element. */
  click: (sel: string) => void;
}

export interface CodeTask {
  instruction: string;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  checks: CheckDefinition[];
}

/** Result of running all checks against the learner's page. */
export interface VerificationCheck {
  id: string;
  title: string;
  pass: boolean;
  message: string;
}

export interface VerificationResult {
  passed: boolean;
  checks: VerificationCheck[];
  message: string;
}

/* ---------- Уроки и модули ---------- */

/** One theory "card": editor-style file card with short text. */
export interface TheoryCard {
  filename: string;
  lang: "html" | "css" | "js";
  intro: string;
  code: string;
  note?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  minutes: number;
  /** Short summary shown in module lists. */
  summary: string;
  theory: TheoryCard[];
  quiz?: Quiz;
  task?: CodeTask;
}

export interface Module {
  id: string;
  title: string;
  goal: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  tagline: string;
  modules: Module[];
}

/* ---------- Типы прогресса ---------- */

export type TaskKind = "theory" | "quiz" | "code";

export interface TaskCompletionState {
  theory: true;
  quiz?: {
    correct: number;
    total: number;
  };
  code?: true;
}

/** All lesson slugs in order, across modules. */
export function allLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function findLesson(course: Course, slug: string): Lesson | undefined {
  return allLessons(course).find((l) => l.slug === slug);
}

export function moduleOfLesson(course: Course, slug: string): Module | undefined {
  return course.modules.find((m) => m.lessons.some((l) => l.slug === slug));
}

/** Lesson neighbours for prev/next navigation. */
export function lessonNeighbours(
  course: Course,
  slug: string,
): { prev: Lesson | null; next: Lesson | null } {
  const list = allLessons(course);
  const idx = list.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}
