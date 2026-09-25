import type { CodeTask, VerificationResult, CheckHelpers } from "@/lib/course-content";

export interface RenderedSandbox {
  /** JS runtime error inside the sandbox, if any. */
  error?: string;
  /** Live document of the sandbox (styles are applied here). */
  doc: Document | null;
  /** Live window of the sandbox (user functions become globals here). */
  win: Window | null;
  /** Remove the sandbox iframe. Call after checks are done. */
  dispose: () => void;
}

/**
 * Render HTML/CSS/JS into an isolated iframe and keep it alive so checks can
 * query the live DOM (computed styles), call user functions and dispatch
 * events. `allow-same-origin` is required to read results back; learner code
 * in a free course is benign.
 */
export function renderSandboxPage(
  html: string,
  css: string,
  js: string,
): Promise<RenderedSandbox> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    iframe.setAttribute("title", "sandbox");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.style.width = "1024px";
    iframe.style.height = "768px";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      resolve({ doc: null, win: null, dispose: () => {} });
      return;
    }

    doc.open();
    doc.write(
      `<!doctype html><html><head><style>${css}\nbody { margin: 0; }</style></head><body>${html}` +
        `<script>try {\n${js}\n} catch (e) { window.__err = e && e.message; }<\/script></body></html>`,
    );
    doc.close();

    const dispose = () => iframe.remove();

    // Give scripts/styles a moment to settle.
    setTimeout(() => {
      if (!iframe.isConnected) {
        resolve({ doc: null, win: null, dispose: () => {} });
        return;
      }
      const win = iframe.contentWindow;
      const err = (win as unknown as { __err?: string } | null)?.__err;
      resolve({
        error: err ? `Ошибка выполнения JS: ${err}` : undefined,
        doc: iframe.contentDocument,
        win: win ?? null,
        dispose,
      });
    }, 150);
  });
}

/** Normalize whitespace in text for comparisons. */
function normText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function makeHelpers(sandbox: RenderedSandbox): CheckHelpers {
  const doc = sandbox.doc;
  const body = doc?.body ?? null;

  return {
    element: (body ?? document.createElement("div")) as HTMLElement,
    q: (sel: string) => (body ? body.querySelector(sel) : null),
    qa: (sel: string) => (body ? Array.from(body.querySelectorAll(sel)) : []),
    text: (sel: string) => {
      const el = body?.querySelector(sel);
      return el ? normText(el.textContent ?? "") : "";
    },
    normText,
    style: (sel: string, prop: string) => {
      const el = body?.querySelector(sel);
      if (!el || !doc) return "";
      return doc.defaultView?.getComputedStyle(el).getPropertyValue(prop) ?? "";
    },
    attr: (sel: string, name: string) => {
      const el = body?.querySelector(sel);
      return el?.getAttribute(name) ?? null;
    },
    fn: (name: string) => {
      const fn = (sandbox.win as unknown as Record<string, unknown> | null)?.[
        name
      ];
      return typeof fn === "function" ? (fn as (...a: unknown[]) => unknown) : null;
    },
    click: (sel: string) => {
      const el = body?.querySelector(sel);
      if (!el) return;
      el.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    },
  };
}

/** Run the user's page through the sandbox and evaluate the task checks. */
export async function verifyCodeTask(
  task: CodeTask,
  userCode: Record<string, string>,
): Promise<VerificationResult> {
  const html = userCode.html ?? "";
  const css = userCode.css ?? "";
  const js = userCode.js ?? "";
  const sandbox = await renderSandboxPage(html, css, js);

  if (!sandbox.doc) {
    sandbox.dispose();
    return {
      passed: false,
      checks: task.checks.map((c) => ({
        id: c.checkId,
        title: c.title,
        pass: false,
        message: "Не удалось отрендерить страницу в песочнице",
      })),
      message: "Проверка не выполнена",
    };
  }

  const helpers = makeHelpers(sandbox);
  const checks: VerificationResult["checks"] = [];
  for (const checkDef of task.checks) {
    try {
      const pass = checkDef.test(helpers);
      checks.push({
        id: checkDef.checkId,
        title: checkDef.title,
        pass,
        message: pass
          ? checkDef.hintOk
          : checkDef.hintFail ?? "Пока не выполнено — попробуйте ещё раз.",
      });
    } catch {
      checks.push({
        id: checkDef.checkId,
        title: checkDef.title,
        pass: false,
        message: "Ошибка при выполнении проверки",
      });
    }
  }
  sandbox.dispose();

  const failed = checks.filter((c) => !c.pass);
  let message: string;
  if (sandbox.error && failed.length > 0) {
    message = `${sandbox.error}. Проверьте код — и загляните в подсказки.`;
  } else if (sandbox.error) {
    message = sandbox.error;
  } else if (checks.length === 0) {
    message = "У задачи нет проверок.";
  } else if (failed.length === 0) {
    message = "Отлично! Все проверки пройдены.";
  } else {
    message = `Пройдено ${checks.length - failed.length} из ${checks.length}. Загляните в подсказки к непройденным пунктам.`;
  }

  return {
    passed: checks.length > 0 && failed.length === 0,
    checks,
    message,
  };
}
