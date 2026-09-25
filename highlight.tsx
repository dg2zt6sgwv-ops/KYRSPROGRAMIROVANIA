import type { ReactNode } from "react";

const C = {
  tag: "text-editor-tag",
  attr: "text-editor-attr",
  str: "text-editor-string",
  com: "text-editor-comment",
  kw: "text-editor-keyword",
  num: "text-editor-number",
};

function span(cls: string, text: string, key: number): ReactNode {
  return (
    <span key={key} className={cls}>
      {text}
    </span>
  );
}

function highlightHtmlLine(line: string, base: number): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(<\/?)([a-zA-Z][\w-]*)|("(?:[^"]*)"|'(?:[^']*)')|([\w-]+)(=)|(>|\/>|<!--|-->)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = base;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(<span key={i++}>{line.slice(last, m.index)}</span>);
    if (m[1] !== undefined && m[2] !== undefined) {
      out.push(span(C.tag, m[1] + m[2], i++));
    } else if (m[3] !== undefined) {
      out.push(span(C.str, m[3], i++));
    } else if (m[4] !== undefined && m[5] !== undefined) {
      out.push(span(C.attr, m[4] + m[5], i++));
    } else if (m[6] !== undefined) {
      out.push(span(C.tag, m[6], i++));
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(<span key={i++}>{line.slice(last)}</span>);
  return out;
}

function highlightCssLine(line: string, base: number): ReactNode[] {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return [span(C.com, line, base)];
  }
  if (trimmed.startsWith(".") || trimmed.startsWith("#") || /^[a-zA-Z][\w-]*\s*\{/.test(trimmed)) {
    const braceIdx = line.indexOf("{");
    if (braceIdx !== -1) {
      return [
        span(C.tag, line.slice(0, braceIdx), base),
        span(C.kw, line.slice(braceIdx), base + 1),
      ];
    }
    return [span(C.tag, line, base)];
  }
  const colonIdx = line.indexOf(":");
  if (colonIdx !== -1) {
    return [
      span(C.attr, line.slice(0, colonIdx), base),
      span(C.kw, ":", base + 1),
      <span key={base + 2}>{line.slice(colonIdx + 1)}</span>,
    ];
  }
  return [span(C.kw, line, base)];
}

const JS_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "new",
  "true",
  "false",
  "null",
  "undefined",
]);

function highlightJsLine(line: string, base: number): ReactNode[] {
  if (line.trimStart().startsWith("//")) return [span(C.com, line, base)];
  const out: ReactNode[] = [];
  const re = /("(?:[^"]*)"|'(?:[^']*)'|`(?:[^`]*)`)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$][\w$]*\b)|(\/\/.*$)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = base;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(<span key={i++}>{line.slice(last, m.index)}</span>);
    if (m[1] !== undefined) {
      out.push(span(C.str, m[1], i++));
    } else if (m[2] !== undefined) {
      out.push(span(C.num, m[2], i++));
    } else if (m[3] !== undefined) {
      out.push(
        span(JS_KEYWORDS.has(m[3]) ? C.kw : "", m[3], i++),
      );
    } else if (m[4] !== undefined) {
      out.push(span(C.com, m[4], i++));
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(<span key={i++}>{line.slice(last)}</span>);
  return out;
}

/** Highlight a whole code block into gutter-numbered lines. */
export function highlightCode(
  code: string,
  lang: "html" | "css" | "js",
): ReactNode {
  return code.replace(/\n$/, "").split("\n").map((line, idx) => {
    const tokens =
      lang === "html"
        ? highlightHtmlLine(line, idx * 100)
        : lang === "css"
          ? highlightCssLine(line, idx * 100)
          : highlightJsLine(line, idx * 100);
    return (
      <span key={idx} className="flex">
        <span className="w-8 shrink-0 select-none pr-4 text-right text-muted-foreground/40">
          {idx + 1}
        </span>
        <span className="min-w-0 whitespace-pre-wrap break-words">
          {tokens.length > 0 ? tokens : "\u00A0"}
        </span>
      </span>
    );
  });
}
