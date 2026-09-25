import type { Course, Lesson } from "./course-content";

/** Parse "rgb(r, g, b)" / "rgb(r g b / a)" / "rgba(...)" and compare to target (tolerance for rounding). */
function rgbNear(
  computed: string,
  r: number,
  g: number,
  b: number,
  a?: number,
): boolean {
  if (!computed) return false;
  const nums = computed.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return false;
  const [cr, cg, cb] = nums.map(Number);
  const ca = nums.length >= 4 ? Number(nums[3]) : 1;
  const tol = 3;
  if (a === undefined) {
    return (
      Math.abs(cr - r) <= tol &&
      Math.abs(cg - g) <= tol &&
      Math.abs(cb - b) <= tol
    );
  }
  return (
    Math.abs(cr - r) <= tol &&
    Math.abs(cg - g) <= tol &&
    Math.abs(cb - b) <= tol &&
    Math.abs(ca - a) <= 0.05
  );
}

/* ============================================================
   Модуль 1. Основы HTML
   ============================================================ */

const m1: Lesson[] = [
  {
    slug: "html-intro",
    title: "Что такое HTML и первая страница",
    minutes: 15,
    summary:
      "Разбираемся, из чего состоит веб-страница, и пишем первую разметку.",
    theory: [
      {
        filename: "index.html",
        lang: "html",
        intro:
          "HTML — это разметка: он описывает, ЧТО находится на странице. Браузер читает теги и рисует страницу.",
        code: `<!DOCTYPE html>
<html>
  <head>
    <title>Моя первая страница</title>
  </head>
  <body>
    <h1>Привет, мир!</h1>
    <p>Это мой первый абзац.</p>
  </body>
</html>`,
        note: "Теги обычно парные: <h1> открывает, </h1> закрывает.",
      },
      {
        filename: "структура.html",
        lang: "html",
        intro:
          "У страницы есть скелет: head — «мозги» (заголовок вкладки, подключения), body — всё видимое содержимое.",
        code: `<head>
  <title>Вкладка браузера</title>
</head>
<body>
  <!-- всё видимое живёт здесь -->
</body>`,
      },
      {
        filename: "теги.html",
        lang: "html",
        intro:
          "Заголовки h1–h6 задают важность разделов. Абзацы — p. На странице должен быть один главный h1.",
        code: `<h1>Главный заголовок</h1>
<h2>Подраздел</h2>
<p>Обычный текст абзаца.</p>`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что описывает HTML?",
          options: [
            { id: "a", text: "Внешний вид и цвета страницы" },
            { id: "b", text: "Структуру и содержимое страницы" },
            { id: "c", text: "Логику и поведение кнопок" },
          ],
          correctId: "b",
          explanation:
            "HTML — про структуру и смысл содержимого. Внешний вид — CSS, поведение — JavaScript.",
        },
        {
          id: "q2",
          prompt: "Какой тег закрывает <h2>?",
          options: [
            { id: "a", text: "</h2>" },
            { id: "b", text: "</h1>" },
            { id: "c", text: "<h2/>" },
          ],
          correctId: "a",
          explanation: "Закрывающий тег повторяет имя с дробью: </h2>.",
        },
        {
          id: "q3",
          prompt: "Сколько основных заголовков h1 на странице?",
          options: [
            { id: "a", text: "Ровно один" },
            { id: "b", text: "Сколько угодно" },
            { id: "c", text: "Ни одного" },
          ],
          correctId: "a",
          explanation:
            "h1 — главный заголовок страницы, он один. Для подразделов берите h2, h3…",
        },
      ],
    },
    task: {
      instruction:
        "Соберите визитку: заголовок h1 с вашим именем и абзац p с парой слов о себе. Проверка найдёт их на странице.",
      starterHtml: `<!-- Напишите разметку здесь -->
`,
      starterCss: `/* Стили пока не нужны */
`,
      starterJs: `// JavaScript понадобится позже
`,
      checks: [
        {
          checkId: "h1",
          title: "Есть заголовок h1 с текстом",
          test: (h) => h.text("h1").length > 0,
          hintOk: "Заголовок h1 найден.",
          hintFail:
            "Добавьте <h1>Ваше имя</h1> в HTML-панель.",
        },
        {
          checkId: "p",
          title: "Есть абзац p с текстом",
          test: (h) => h.text("p").length > 0,
          hintOk: "Абзац p найден.",
          hintFail: "Добавьте <p>Пара слов о себе</p>.",
        },
        {
          checkId: "second-p",
          title: "Абзацев не меньше двух",
          test: (h) => h.qa("p").length >= 2,
          hintOk: "Два абзаца на месте.",
          hintFail: "Добавьте ещё один <p> с любым текстом.",
        },
      ],
    },
  },
  {
    slug: "html-text",
    title: "Текст: списки, ссылки, выделения",
    minutes: 15,
    summary: "Учимся структурировать текст и добавлять ссылки.",
    theory: [
      {
        filename: "списки.html",
        lang: "html",
        intro:
          "Списки бывают маркированные (ul) и нумерованные (ol). Каждый пункт — тег li.",
        code: `<ul>
  <li>HTML — структура</li>
  <li>CSS — стиль</li>
  <li>JS — поведение</li>
</ul>`,
      },
      {
        filename: "ссылки.html",
        lang: "html",
        intro:
          "Ссылка — тег a с атрибутом href. Это первый атрибут в курсе: он живёт внутри открывающего тега.",
        code: `<a href="https://developer.mozilla.org">Справочник MDN</a>`,
        note: 'Атрибут записывается как имя="значение" внутри открывающего тега.',
      },
      {
        filename: "выделения.html",
        lang: "html",
        intro:
          "strong — важное содержимое, em — смысловой акцент. Визуально это жирный и курсив.",
        code: `<p>Это <strong>очень важно</strong>,
а это <em>акцент</em>.</p>`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Какой тег создаёт нумерованный список?",
          options: [
            { id: "a", text: "<ul>" },
            { id: "b", text: "<ol>" },
            { id: "c", text: "<li>" },
          ],
          correctId: "b",
          explanation: "ol — ordered list, нумерованный; ul — маркированный.",
        },
        {
          id: "q2",
          prompt: "Где живёт адрес ссылки?",
          options: [
            { id: "a", text: 'В атрибуте href' },
            { id: "b", text: 'В атрибуте src' },
            { id: "c", text: "Внутри текста тега" },
          ],
          correctId: "a",
          explanation: "href — «hypertext reference», адрес перехода.",
        },
        {
          id: "q3",
          prompt: "Что делает тег strong?",
          options: [
            { id: "a", text: "Делает текст важным" },
            { id: "b", text: "Создаёт ссылку" },
            { id: "c", text: "Вставляет картинку" },
          ],
          correctId: "a",
          explanation:
            "strong подчёркивает важность содержимого (и обычно жирный шрифт).",
        },
      ],
    },
    task: {
      instruction:
        "Сделайте карточку «Мои цели»: заголовок h2, маркированный список из трёх li и одну ссылку a с атрибутом href.",
      starterHtml: `<h2>Мои цели</h2>
<!-- добавьте список ul с тремя пунктами li -->
<!-- и одну ссылку a с href -->
`,
      starterCss: "",
      starterJs: "",
      checks: [
        {
          checkId: "h2",
          title: "Есть заголовок h2",
          test: (h) => h.text("h2").length > 0,
          hintOk: "Заголовок на месте.",
          hintFail: "Оставьте <h2>Мои цели</h2> в разметке.",
        },
        {
          checkId: "li3",
          title: "В списке ровно 3 пункта li",
          test: (h) => h.qa("li").length >= 3,
          hintOk: "Три пункта найдены.",
          hintFail: "Нужно минимум три <li> внутри <ul>.",
        },
        {
          checkId: "link",
          title: "Есть ссылка с href",
          test: (h) => h.attr("a", "href") !== null,
          hintOk: "Ссылка с href найдена.",
          hintFail: 'Добавьте <a href="https://...">текст</a>.',
        },
      ],
    },
  },
  {
    slug: "html-structure",
    title: "Структура страницы: section, карточки",
    minutes: 20,
    summary: "Собираем страницу из смысловых блоков.",
    theory: [
      {
        filename: "смысловые-блоки.html",
        lang: "html",
        intro:
          "Страницу собирают из смысловых блоков: header, main, section, footer. Это помогает и людям, и поисковикам.",
        code: `<header>Шапка сайта</header>
<main>
  <section>
    <h2>Первый раздел</h2>
  </section>
</main>
<footer>Подвал</footer>`,
      },
      {
        filename: "карточка.html",
        lang: "html",
        intro:
          "Типовой блок «карточка»: контейнер div с заголовком, текстом и кнопкой. Стилизуем его на следующем уроке.",
        code: `<div class="card">
  <h3>Название</h3>
  <p>Описание товара</p>
  <button>Купить</button>
</div>`,
        note: "class — ещё один атрибут: по нему CSS найдёт элемент.",
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Какой тег оборачивает основной контент страницы?",
          options: [
            { id: "a", text: "<main>" },
            { id: "b", text: "<div>" },
            { id: "c", text: "<body-content>" },
          ],
          correctId: "a",
          explanation: "main — основное содержимое, уникальное для страницы.",
        },
        {
          id: "q2",
          prompt: "Зачем нужен атрибут class?",
          options: [
            { id: "a", text: "Чтобы CSS мог найти элемент" },
            { id: "b", text: "Чтобы страница быстрее грузилась" },
            { id: "c", text: "Это обязательный атрибут div" },
          ],
          correctId: "a",
          explanation: "class — «метка», по которой стили и JS находят элемент.",
        },
      ],
    },
    task: {
      instruction:
        "Соберите страницу-профиль: header с h1, main с секцией section, внутри которой div.card с h3 и p. Плюс footer с любым текстом.",
      starterHtml: `<!-- header с h1 -->
<!-- main > section > div.card > h3 + p -->
<!-- footer -->
`,
      starterCss: "",
      starterJs: "",
      checks: [
        {
          checkId: "header",
          title: "header содержит h1",
          test: (h) => h.text("header h1").length > 0,
          hintOk: "Шапка с заголовком найдена.",
          hintFail: "Поместите <h1> внутрь <header>.",
        },
        {
          checkId: "card",
          title: "Внутри section есть div.card",
          test: (h) => h.q("section .card") !== null,
          hintOk: "Карточка внутри секции найдена.",
          hintFail: 'Добавьте <div class="card"> внутрь <section>.',
        },
        {
          checkId: "card-content",
          title: "В карточке есть h3 и p",
          test: (h) => h.text(".card h3").length > 0 && h.text(".card p").length > 0,
          hintOk: "Содержимое карточки на месте.",
          hintFail: "Добавьте в карточку <h3> и <p>.",
        },
        {
          checkId: "footer",
          title: "Есть footer с текстом",
          test: (h) => h.text("footer").length > 0,
          hintOk: "Подвал найден.",
          hintFail: "Добавьте <footer> с любым текстом.",
        },
      ],
    },
  },
];

/* ============================================================
   Модуль 2. Основы CSS
   ============================================================ */

const m2: Lesson[] = [
  {
    slug: "css-basics",
    title: "Селекторы и цвета",
    minutes: 20,
    summary: "Первые стили: как CSS находит элементы и красит страницу.",
    theory: [
      {
        filename: "styles.css",
        lang: "css",
        intro:
          "CSS-правило = селектор + фигурные скобки со свойствами. Селектор по тегу красит все такие элементы.",
        code: `h1 {
  color: seagreen;
}

p {
  color: #555;
}`,
      },
      {
        filename: "классы.css",
        lang: "css",
        intro:
          "Селектор по классу начинается с точки и работает для любых элементов с этим классом.",
        code: `.card {
  background: #f6f8f6;
  padding: 16px;
}`,
      },
      {
        filename: "цвета.css",
        lang: "css",
        intro:
          "Цвета задают именами, hex-кодами (#rrggbb) или rgb(). Начните с имён — они читаются как слова.",
        code: `a { color: teal; }
h2 { color: #2e7d32; }
p { color: rgb(60, 60, 60); }`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как выглядит селектор по классу .card?",
          options: [
            { id: "a", text: ".card { }" },
            { id: "b", text: "card { }" },
            { id: "c", text: "#card { }" },
          ],
          correctId: "a",
          explanation: "Точка — селектор класса, решётка — селектор id.",
        },
        {
          id: "q2",
          prompt: "Какое свойство задаёт цвет текста?",
          options: [
            { id: "a", text: "color" },
            { id: "b", text: "background-color" },
            { id: "c", text: "text-style" },
          ],
          correctId: "a",
          explanation: "color — цвет текста, background-color — цвет фона.",
        },
      ],
    },
    task: {
      instruction:
        "Раскрасьте страницу: h1 — цвет seagreen, p — любой тёмно-серый, а элементу с классом .box задайте фон и внутренние отступы padding: 16px.",
      starterHtml: `<h1>Раскрась меня</h1>
<p>Обычный абзац.</p>
<div class="box">Я — коробка</div>
`,
      starterCss: `h1 {
  /* задайте цвет seagreen */
}

p {
  /* тёмно-серый цвет */
}

.box {
  /* фон и padding: 16px */
}
`,
      starterJs: "",
      checks: [
        {
          checkId: "h1-color",
          title: "h1 окрашен в seagreen",
          test: (h) => rgbNear(h.style("h1", "color"), 46, 139, 87),
          hintOk: "Цвет заголовка — seagreen.",
          hintFail: "В CSS: h1 { color: seagreen; }",
        },
        {
          checkId: "p-color",
          title: "Цвет абзаца не чёрный и не унаследован по умолчанию",
          test: (h) => {
            const c = h.style("p", "color");
            return !rgbNear(c, 0, 0, 0) && c !== "";
          },
          hintOk: "Абзац окрашен.",
          hintFail: "Задайте p цвет, например color: #444;",
        },
        {
          checkId: "box-bg",
          title: "У .box есть фон",
          test: (h) => {
            const bg = h.style(".box", "background-color");
            return bg !== "" && bg !== "transparent" && !rgbNear(bg, 0, 0, 0, 0);
          },
          hintOk: "Фон коробки задан.",
          hintFail: "Добавьте .box { background: ...; }",
        },
        {
          checkId: "box-padding",
          title: "У .box есть padding: 16px",
          test: (h) => h.style(".box", "padding-top") === "16px",
          hintOk: "Отступы 16px применены.",
          hintFail: "Добавьте padding: 16px; в правило .box.",
        },
      ],
    },
  },
  {
    slug: "css-box-model",
    title: "Боксовая модель: отступы и границы",
    minutes: 20,
    summary: "Padding, margin и border — главные инструменты макета.",
    theory: [
      {
        filename: "box.css",
        lang: "css",
        intro:
          "Каждый элемент — коробка: content, padding (внутренние отступы), border (рамка), margin (внешние отступы).",
        code: `.card {
  padding: 16px;      /* внутри */
  margin: 24px 0;     /* снаружи: сверху и снизу */
  border: 2px solid seagreen;
  border-radius: 8px; /* скругление */
}`,
      },
      {
        filename: "короткая-запись.css",
        lang: "css",
        intro:
          "Отступы задают коротко: одно значение — со всех сторон, два — вертикаль/горизонталь, четыре — по часовой.",
        code: `padding: 16px;             /* все стороны */
margin: 8px 16px;          /* верх-низ | лево-право */
margin: 8px 16px 24px 32px; /* верх право низ лево */`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что делает padding?",
          options: [
            { id: "a", text: "Отодвигает соседние элементы" },
            { id: "b", text: "Добавляет отступы внутри элемента" },
            { id: "c", text: "Рисует рамку" },
          ],
          correctId: "b",
          explanation: "padding — внутренние отступы, margin — внешние.",
        },
        {
          id: "q2",
          prompt: "margin: 8px 16px — это…",
          options: [
            { id: "a", text: "8px сверху и снизу, 16px слева и справа" },
            { id: "b", text: "8px слева и справа, 16px сверху и снизу" },
            { id: "c", text: "8px со всех сторон" },
          ],
          correctId: "a",
          explanation:
            "Два значения: первое — вертикаль, второе — горизонталь.",
        },
      ],
    },
    task: {
      instruction:
        "Оформите карточку .card: padding 16px, скругление border-radius: 12px, сплошная рамка border: 2px solid, и внешний отступ margin: 24px.",
      starterHtml: `<div class="card">
  <h3>Карточка</h3>
  <p>У меня появились отступы и рамка.</p>
</div>
`,
      starterCss: `.card {
  /* padding, border-radius, border, margin */
}
`,
      starterJs: "",
      checks: [
        {
          checkId: "padding",
          title: "padding: 16px",
          test: (h) => h.style(".card", "padding-top") === "16px",
          hintOk: "Внутренние отступы заданы.",
          hintFail: "Добавьте padding: 16px;",
        },
        {
          checkId: "radius",
          title: "border-radius: 12px",
          test: (h) => h.style(".card", "border-top-left-radius") === "12px",
          hintOk: "Скругление углов включено.",
          hintFail: "Добавьте border-radius: 12px;",
        },
        {
          checkId: "border",
          title: "Есть сплошная рамка",
          test: (h) => h.style(".card", "border-top-style") === "solid",
          hintOk: "Рамка на месте.",
          hintFail: "Добавьте border: 2px solid <цвет>;",
        },
        {
          checkId: "margin",
          title: "margin: 24px",
          test: (h) => h.style(".card", "margin-top") === "24px",
          hintOk: "Внешний отступ задан.",
          hintFail: "Добавьте margin: 24px;",
        },
      ],
    },
  },
  {
    slug: "css-flexbox",
    title: "Flexbox: раскладка в ряд",
    minutes: 25,
    summary: "Главный инструмент раскладки: оси, выравнивание, gap.",
    theory: [
      {
        filename: "flex.css",
        lang: "css",
        intro:
          "display: flex выстраивает детей в ряд. gap задаёт расстояние между ними.",
        code: `.row {
  display: flex;
  gap: 12px;
}`,
      },
      {
        filename: "выравнивание.css",
        lang: "css",
        intro:
          "justify-content — вдоль главной оси, align-items — поперёк. center центрирует в обоих направлениях.",
        code: `.row {
  display: flex;
  justify-content: center; /* по горизонтали */
  align-items: center;     /* по вертикали */
}`,
      },
      {
        filename: "колонка.css",
        lang: "css",
        intro:
          "flex-direction: column поворачивает ось: дети идут сверху вниз. Это основа вертикальной раскладки.",
        code: `.column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Какое свойство включает flex-раскладку?",
          options: [
            { id: "a", text: "display: flex" },
            { id: "b", text: "flex: on" },
            { id: "c", text: "position: flex" },
          ],
          correctId: "a",
          explanation: "display: flex превращает контейнер в flex-контейнер.",
        },
        {
          id: "q2",
          prompt: "Что делает gap: 12px?",
          options: [
            { id: "a", text: "Задаёт расстояние между flex-детьми" },
            { id: "b", text: "Растягивает элементы" },
            { id: "c", text: "Скругляет углы" },
          ],
          correctId: "a",
          explanation: "gap — «зазор» между элементами во flex и grid.",
        },
      ],
    },
    task: {
      instruction:
        "Соберите ряд из трёх плиток: контейнер .row — display: flex с gap: 12px и центрированием по обеим осям.",
      starterHtml: `<div class="row">
  <div class="tile">1</div>
  <div class="tile">2</div>
  <div class="tile">3</div>
</div>
`,
      starterCss: `.row {
  /* display, gap, justify-content, align-items */
}

.tile {
  padding: 24px;
  background: seagreen;
  color: white;
}
`,
      starterJs: "",
      checks: [
        {
          checkId: "display",
          title: "У .row включён flex",
          test: (h) => h.style(".row", "display") === "flex",
          hintOk: "Flex включён.",
          hintFail: "Добавьте display: flex; в .row.",
        },
        {
          checkId: "gap",
          title: "gap: 12px",
          test: (h) => h.style(".row", "column-gap") === "12px",
          hintOk: "Зазор между плитками 12px.",
          hintFail: "Добавьте gap: 12px;",
        },
        {
          checkId: "justify",
          title: "Центрирование по горизонтали",
          test: (h) => h.style(".row", "justify-content") === "center",
          hintOk: "Элементы по центру главной оси.",
          hintFail: "Добавьте justify-content: center;",
        },
        {
          checkId: "align",
          title: "Центрирование по вертикали",
          test: (h) => h.style(".row", "align-items") === "center",
          hintOk: "Элементы по центру поперечной оси.",
          hintFail: "Добавьте align-items: center;",
        },
      ],
    },
  },
];

/* ============================================================
   Модуль 3. JavaScript: первые шаги
   ============================================================ */

const m3: Lesson[] = [
  {
    slug: "js-intro",
    title: "Переменные и функции",
    minutes: 20,
    summary: "Учим страницу реагировать: переменные, функции, события.",
    theory: [
      {
        filename: "script.js",
        lang: "js",
        intro:
          "Переменные хранят значения. let — когда значение будет меняться, const — когда нет.",
        code: `let score = 0;
const maxScore = 10;

score = score + 1; // теперь 1`,
      },
      {
        filename: "функции.js",
        lang: "js",
        intro:
          "Функция — переиспользуемый блок кода. Стрелочный синтаксис короче и встречается повсюду.",
        code: `const greet = (name) => {
  return "Привет, " + name + "!";
};

greet("Аня"); // "Привет, Аня!"`,
      },
      {
        filename: "dom.js",
        lang: "js",
        intro:
          "document.querySelector находит элемент на странице, textContent меняет его текст.",
        code: `const title = document.querySelector("#title");
title.textContent = "Новый заголовок";`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что выберет document.querySelector(\"#title\")?",
          options: [
            { id: "a", text: "Элемент с id=\"title\"" },
            { id: "b", text: "Все элементы с классом title" },
            { id: "c", text: "Первый тег title" },
          ],
          correctId: "a",
          explanation: "# — селектор id, . — селектор класса.",
        },
        {
          id: "q2",
          prompt: "Как объявляют константу?",
          options: [
            { id: "a", text: "const" },
            { id: "b", text: "let" },
            { id: "c", text: "var" },
          ],
          correctId: "a",
          explanation: "const — константа, let — переменная.",
        },
      ],
    },
    task: {
      instruction:
        "Напишите функцию greet(name), которая возвращает строку «Привет, <имя>!». В HTML уже есть заголовок с id=\"greeting\" — функция должна работать для любого имени.",
      starterHtml: `<h1 id="greeting">Здесь появится приветствие</h1>
`,
      starterCss: "",
      starterJs: `function greet(name) {
  // верните строку "Привет, " + name + "!"
}
`,
      checks: [
        {
          checkId: "fn-exists",
          title: "Функция greet объявлена",
          test: (h) => h.fn("greet") !== null,
          hintOk: "Функция найдена.",
          hintFail: "Объявите function greet(name) { ... }",
        },
        {
          checkId: "fn-works",
          title: "greet(\"Аня\") возвращает «Привет, Аня!»",
          test: (h) => {
            const fn = h.fn("greet");
            if (!fn) return false;
            return fn("Аня") === "Привет, Аня!";
          },
          hintOk: "Функция работает верно.",
          hintFail: 'Верните "Привет, " + name + "!" из функции.',
        },
        {
          checkId: "fn-works-2",
          title: "greet(\"Мир\") возвращает «Привет, Мир!»",
          test: (h) => {
            const fn = h.fn("greet");
            if (!fn) return false;
            return fn("Мир") === "Привет, Мир!";
          },
          hintOk: "Работает и для других имён.",
          hintFail: "Не подставляйте имя в код жёстко — используйте параметр name.",
        },
      ],
    },
  },
  {
    slug: "js-dom",
    title: "События: кнопка реагирует",
    minutes: 25,
    summary: "addEventListener, обработчики клика и изменение страницы.",
    theory: [
      {
        filename: "события.js",
        lang: "js",
        intro:
          "addEventListener(\"click\", ...) запускает функцию, когда пользователь кликает по элементу.",
        code: `const btn = document.querySelector("#like");
let count = 0;

btn.addEventListener("click", () => {
  count = count + 1;
  btn.textContent = "Нравится: " + count;
});`,
      },
      {
        filename: "классы.js",
        lang: "js",
        intro:
          "classList.toggle переключает класс — так делают переключатели темы и лайки.",
        code: `const box = document.querySelector(".box");
box.classList.toggle("active"); // вкл/выкл класс`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Как подписаться на клик по кнопке?",
          options: [
            { id: "a", text: 'btn.addEventListener("click", fn)' },
            { id: "b", text: "btn.onClick = true" },
            { id: "c", text: 'listen(btn, "click")' },
          ],
          correctId: "a",
          explanation:
            "addEventListener — стандартный способ подписки на события.",
        },
        {
          id: "q2",
          prompt: "Что сделает classList.toggle(\"active\")?",
          options: [
            { id: "a", text: "Добавит класс, если его нет, и уберёт, если есть" },
            { id: "b", text: "Удалит элемент" },
            { id: "c", text: "Перезагрузит страницу" },
          ],
          correctId: "a",
          explanation: "toggle переключает класс: был — уберёт, не было — добавит.",
        },
      ],
    },
    task: {
      instruction:
        "Оживите счётчик: по клику на кнопку #counter увеличивайте переменную count и выводите значение в #output через textContent.",
      starterHtml: `<button id="counter">Кликни меня</button>
<p id="output">Кликов: 0</p>
`,
      starterCss: "",
      starterJs: `let count = 0;

const btn = document.querySelector("#counter");
const out = document.querySelector("#output");

btn.addEventListener("click", () => {
  // увеличьте count и обновите textContent у #output
});
`,
      checks: [
        {
          checkId: "listener",
          title: "На кнопке есть обработчик клика",
          test: (h) => {
            h.click("#counter");
            h.click("#counter");
            const t = h.text("#output");
            return t.includes("2");
          },
          hintOk: "Два клика — счётчик показывает 2.",
          hintFail:
            "Внутри обработчика: count = count + 1; затем out.textContent = ...",
        },
        {
          checkId: "count-var",
          title: "Счётчик не сбрасывается между кликами",
          test: (h) => {
            h.click("#counter");
            const t = h.text("#output");
            return t.includes("3");
          },
          hintOk: "Счётчик продолжил считать.",
          hintFail:
            "Объявите count через let снаружи обработчика, а не внутри.",
        },
      ],
    },
  },
  {
    slug: "js-dom-2",
    title: "DOM: меняем страницу из кода",
    minutes: 25,
    summary: "Создаём элементы, добавляем их в список, чистим поля.",
    theory: [
      {
        filename: "создание.js",
        lang: "js",
        intro:
          "Новые элементы создают через document.createElement и вставляют через appendChild.",
        code: `const li = document.createElement("li");
li.textContent = "Новый пункт";
document.querySelector("ul").appendChild(li);`,
      },
      {
        filename: "значения.js",
        lang: "js",
        intro:
          "У полей ввода читают .value. Его можно и записывать — например, очищать поле после действия.",
        code: `const input = document.querySelector("#task");
console.log(input.value);
input.value = "";`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Что делает document.createElement(\"li\")?",
          options: [
            { id: "a", text: "Создаёт новый элемент li в памяти" },
            { id: "b", text: "Находит первый li на странице" },
            { id: "c", text: "Удаляет li со страницы" },
          ],
          correctId: "a",
          explanation:
            "createElement только создаёт элемент; чтобы он появился, его нужно вставить.",
        },
        {
          id: "q2",
          prompt: "Какое свойство хранит текст поля ввода?",
          options: [
            { id: "a", text: ".value" },
            { id: "b", text: ".textContent" },
            { id: "c", text: ".innerHTML" },
          ],
          correctId: "a",
          explanation: "У input читают и пишут .value.",
        },
      ],
    },
    task: {
      instruction:
        "Доделайте мини-список задач: по клику на #add брать текст из #task, создавать li с этим текстом, добавлять его в ul#list и очищать поле ввода.",
      starterHtml: `<input id="task" placeholder="Новая задача" />
<button id="add">Добавить</button>
<ul id="list"></ul>
`,
      starterCss: "",
      starterJs: `const input = document.querySelector("#task");
const btn = document.querySelector("#add");
const list = document.querySelector("#list");

btn.addEventListener("click", () => {
  // 1) взять input.value
  // 2) создать li, записать текст
  // 3) добавить li в list
  // 4) очистить input.value
});
`,
      checks: [
        {
          checkId: "adds-li",
          title: "Клик добавляет li в список",
          test: (h) => {
            const input = h.q("#task");
            if (input) (input as HTMLInputElement).value = "Купить хлеб";
            h.click("#add");
            const items = h.qa("#list li");
            return items.length === 1 && items[0].textContent?.includes("Купить хлеб");
          },
          hintOk: "Пункт появился в списке.",
          hintFail:
            "const li = document.createElement(\"li\"); li.textContent = input.value; list.appendChild(li);",
        },
        {
          checkId: "clears-input",
          title: "После добавления поле очищается",
          test: (h) => {
            const input = h.q("#task") as HTMLInputElement | null;
            if (!input) return false;
            input.value = "Вторая задача";
            h.click("#add");
            return input.value === "";
          },
          hintOk: "Поле очищено после добавления.",
          hintFail: "В конце обработчика: input.value = \"\";",
        },
        {
          checkId: "empty-ignored",
          title: "Пустая задача не добавляется",
          test: (h) => {
            const input = h.q("#task") as HTMLInputElement | null;
            if (!input) return false;
            input.value = "";
            h.click("#add");
            return h.qa("#list li").length === 2;
          },
          hintOk: "Пустые задачи отфильтрованы.",
          hintFail:
            "Оберните добавление в if (text !== \"\") { ... }",
        },
      ],
    },
  },
];

/* ============================================================
   Модуль 4. Мини-проект
   ============================================================ */

const m4: Lesson[] = [
  {
    slug: "project-card",
    title: "Мини-проект: карточка товара",
    minutes: 25,
    summary:
      "Применяем CSS на практике: собираем аккуратную карточку с flex-раскладкой.",
    theory: [
      {
        filename: "карточка.html",
        lang: "html",
        intro:
          "Карточка товара: контейнер, картинка-заглушка, название, цена и кнопка. Разметка уже готова — вся работа сегодня в CSS.",
        code: `<div class="product">
  <div class="thumb">🖼</div>
  <h3>Наушники</h3>
  <p class="price">2 990 ₽</p>
  <button>В корзину</button>
</div>`,
      },
      {
        filename: "карточка.css",
        lang: "css",
        intro:
          "Вертикальная flex-колонка + gap = ровные карточки без единого margin. Центрирование делает вид «магазинным».",
        code: `.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Какое свойство ставит детей карточки в колонку?",
          options: [
            { id: "a", text: "flex-direction: column" },
            { id: "b", text: "display: column" },
            { id: "c", text: "vertical: true" },
          ],
          correctId: "a",
          explanation:
            "Направление главной оси задаёт flex-direction внутри flex-контейнера.",
        },
      ],
    },
    task: {
      instruction:
        "Оформите карточку .product: display: flex, flex-direction: column, align-items: center, gap: 12px и border-radius: 16px.",
      starterHtml: `<div class="product">
  <div class="thumb">🖼</div>
  <h3>Наушники</h3>
  <p class="price">2 990 ₽</p>
  <button>В корзину</button>
</div>
`,
      starterCss: `.product {
  /* flex-колонка с центрированием */
}

.thumb {
  font-size: 48px;
}
`,
      starterJs: "",
      checks: [
        {
          checkId: "flex",
          title: "display: flex",
          test: (h) => h.style(".product", "display") === "flex",
          hintOk: "Flex включён.",
          hintFail: "Добавьте display: flex;",
        },
        {
          checkId: "column",
          title: "flex-direction: column",
          test: (h) => h.style(".product", "flex-direction") === "column",
          hintOk: "Дети идут колонкой.",
          hintFail: "Добавьте flex-direction: column;",
        },
        {
          checkId: "center",
          title: "align-items: center",
          test: (h) => h.style(".product", "align-items") === "center",
          hintOk: "Содержимое по центру.",
          hintFail: "Добавьте align-items: center;",
        },
        {
          checkId: "gap",
          title: "gap: 12px",
          test: (h) => h.style(".product", "row-gap") === "12px",
          hintOk: "Отступы между детьми заданы.",
          hintFail: "Добавьте gap: 12px;",
        },
        {
          checkId: "radius",
          title: "border-radius: 16px",
          test: (h) => h.style(".product", "border-top-left-radius") === "16px",
          hintOk: "Углы скруглены.",
          hintFail: "Добавьте border-radius: 16px;",
        },
      ],
    },
  },
  {
    slug: "project-counter",
    title: "Мини-проект: счётчик на кнопках",
    minutes: 25,
    summary:
      "Чистый JavaScript: две кнопки плюс/минус и живое значение на экране.",
    theory: [
      {
        filename: "счётчик.html",
        lang: "html",
        intro:
          "Разметка счётчика: экран со значением и две кнопки. Каждой — свой id, чтобы JS мог их найти.",
        code: `<p id="value">0</p>
<button id="inc">+1</button>
<button id="dec">−1</button>`,
      },
      {
        filename: "счётчик.js",
        lang: "js",
        intro:
          "Логика: одна переменная состояния и функция обновления экрана. Обработчики только меняют состояние и просят перерисовать.",
        code: `let count = 0;
const value = document.querySelector("#value");

function render() {
  value.textContent = count;
}`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "Зачем функция render() отдельно от обработчиков?",
          options: [
            { id: "a", text: "Чтобы не дублировать обновление экрана" },
            { id: "b", text: "Так требует браузер" },
            { id: "c", text: "Она ускоряет интернет" },
          ],
          correctId: "a",
          explanation:
            "Один источник правды: состояние + одна функция отрисовки.",
        },
      ],
    },
    task: {
      instruction:
        "Оживите счётчик: #inc увеличивает count на 1, #dec уменьшает на 1, а значение всегда видно в #value (textContent).",
      starterHtml: `<p id="value">0</p>
<button id="inc">+1</button>
<button id="dec">−1</button>
`,
      starterCss: "",
      starterJs: `let count = 0;
const value = document.querySelector("#value");

const inc = document.querySelector("#inc");
const dec = document.querySelector("#dec");

// обработчики: меняют count и обновляют value.textContent
`,
      checks: [
        {
          checkId: "inc",
          title: "Клик «+1» показывает 1",
          test: (h) => {
            h.click("#inc");
            return h.text("#value") === "1";
          },
          hintOk: "Увеличение работает.",
          hintFail: "count += 1; затем value.textContent = count;",
        },
        {
          checkId: "inc2",
          title: "Ещё клик — уже 2",
          test: (h) => {
            h.click("#inc");
            return h.text("#value") === "2";
          },
          hintOk: "Счётчик накапливает значение.",
          hintFail: "count должен объявляться через let снаружи обработчика.",
        },
        {
          checkId: "dec",
          title: "Клик «−1» возвращает к 1",
          test: (h) => {
            h.click("#dec");
            return h.text("#value") === "1";
          },
          hintOk: "Уменьшение работает.",
          hintFail: "Аналогично: count -= 1; value.textContent = count;",
        },
      ],
    },
  },
  {
    slug: "project-profile",
    title: "Мини-проект: страница-визитка",
    minutes: 30,
    summary:
      "Собираем всё вместе: разметка, стили, интерактив. Финальная работа модуля.",
    theory: [
      {
        filename: "совет.html",
        lang: "html",
        intro:
          "Проект — это комбинация всего изученного. Начните с разметки: шапка, блок «обо мне», список навыков, кнопка.",
        code: `<header>
  <h1>Визитка разработчика</h1>
</header>
<main>
  <section id="about">
    <h2>Обо мне</h2>
    <p>Пишу на HTML, CSS и JavaScript.</p>
  </section>
  <button id="hire">Нанять меня</button>
</main>`,
      },
      {
        filename: "совет.css",
        lang: "css",
        intro:
          "Стили делают визитку живой: центрированная колонка, карточка с рамкой, аккуратная кнопка.",
        code: `main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

section {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
}`,
      },
      {
        filename: "совет.js",
        lang: "js",
        intro:
          "Интерактив: по клику на кнопку меняем текст — это уже настоящее приложение.",
        code: `const hire = document.querySelector("#hire");
hire.addEventListener("click", () => {
  hire.textContent = "Скоро свяжусь!";
});`,
      },
    ],
    quiz: {
      questions: [
        {
          id: "q1",
          prompt: "В каком порядке обычно собирают страницу?",
          options: [
            { id: "a", text: "Разметка → стили → поведение" },
            { id: "b", text: "Поведение → разметка → стили" },
            { id: "c", text: "Стили → поведение → разметка" },
          ],
          correctId: "a",
          explanation:
            "Сначала структура (HTML), потом вид (CSS), потом логика (JS).",
        },
        {
          id: "q2",
          prompt: "Что умеет финальный проект?",
          options: [
            { id: "a", text: "Показывать контент и реагировать на клик" },
            { id: "b", text: "Отправлять письма" },
            { id: "c", text: "Хранить данные в облаке" },
          ],
          correctId: "a",
          explanation:
            "Это фронтенд: контент, оформление и реакция на действия пользователя.",
        },
      ],
    },
    task: {
      instruction:
        "Финальная работа: страница-визитка. Нужны: header c h1, section#about с h2 и p, ul#skills минимум с тремя li, кнопка #hire, которая по клику меняет свой текстContent.",
      starterHtml: `<header>
  <h1>Визитка</h1>
</header>
<main>
  <section id="about">
    <h2>Обо мне</h2>
    <p>...</p>
  </section>
  <ul id="skills">
    <!-- три навыка li -->
  </ul>
  <button id="hire">Нанять меня</button>
</main>
`,
      starterCss: `main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
`,
      starterJs: `const hire = document.querySelector("#hire");
hire.addEventListener("click", () => {
  // поменяйте текст кнопки
});
`,
      checks: [
        {
          checkId: "header-h1",
          title: "header содержит h1",
          test: (h) => h.text("header h1").length > 0,
          hintOk: "Шапка с заголовком на месте.",
          hintFail: "Поместите <h1> внутрь <header>.",
        },
        {
          checkId: "about",
          title: "Секция #about с h2 и p",
          test: (h) =>
            h.text("#about h2").length > 0 && h.text("#about p").length > 0,
          hintOk: "Секция «обо мне» заполнена.",
          hintFail: "Внутри <section id=\"about\"> должны быть h2 и p с текстом.",
        },
        {
          checkId: "skills",
          title: "В #skills минимум 3 пункта",
          test: (h) => h.qa("#skills li").length >= 3,
          hintOk: "Навыки перечислены.",
          hintFail: "Добавьте минимум три <li> в <ul id=\"skills\">.",
        },
        {
          checkId: "hire-click",
          title: "Кнопка #hire меняет текст по клику",
          test: (h) => {
            h.click("#hire");
            return h.text("#hire").length > 0 && h.text("#hire") !== "Нанять меня";
          },
          hintOk: "Кнопка реагирует на клик.",
          hintFail:
            'Внутри обработчика: hire.textContent = "Спасибо! Напишите мне.";',
        },
      ],
    },
  },
];

export const course: Course = {
  title: "Веб-разработка с нуля",
  tagline:
    "Письменный курс без видеовстреч: читайте карточки-редакторы, проходите квизы и сдавайте код-задания с автопроверкой.",
  modules: [
    { id: "m1", title: "Основы HTML", goal: "Понимать структуру веб-страницы и писать чистую разметку.", lessons: m1 },
    { id: "m2", title: "Основы CSS", goal: "Управлять внешним видом: цвета, отступы, раскладка.", lessons: m2 },
    { id: "m3", title: "JavaScript: первые шаги", goal: "Оживлять страницу: переменные, функции, события, DOM.", lessons: m3 },
    { id: "m4", title: "Мини-проект", goal: "Собрать собственную страницу-визитку и сдать финальную работу.", lessons: m4 },
  ],
};
