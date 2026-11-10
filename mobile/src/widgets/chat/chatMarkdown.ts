// 웹(Signal-web/src/views/ChatPage/ChatMarkdown.tsx)의 답변 정리·파싱 로직을 그대로 옮겼다.
// 화면 그리는 부분만 React Native로 다시 썼다(ChatRichText.tsx).

export interface Inline {
  text: string;
  bold: boolean;
}

export type Block =
  | { kind: "paragraph" | "heading"; lines: Inline[][] }
  | { kind: "bullet" | "number"; items: Inline[][] };

const HEADING = /^#{1,6}\s+/;
const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;

function parseInline(line: string): Inline[] {
  return line
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("**") && part.endsWith("**") && part.length > 4
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    );
}

const SENTENCE_BREAK = /(?<=[.!?])\s+/;
const QUOTED = /([‘“"'])([^’”"'\n]{1,30})([’”"'])/g;
const AGENCY = /([가-힣]*(?:경찰청|수사대|센터|위원회|상담소|지원단))/g;
const HOTLINE_NUMBER = "\\d{2,4}-\\d{3,4}-\\d{4}|109|112|117|118|119|182|1332|1366|1377|1388|1398";
// "112명"처럼 개수를 나타내는 숫자는 전화번호로 보지 않는다.
const COUNT_UNIT = "[명호개년월일세원층회분초시건위%人個年月日歳円号件岁元个次]";
const HOTLINE = new RegExp(`(?<![\\d-])(${HOTLINE_NUMBER})(?![\\d-]|${COUNT_UNIT})`, "g");
const SENTENCES_PER_PARAGRAPH = 2;
const FULL_HOTLINE = new RegExp(`^(${HOTLINE_NUMBER})$`);
const STARTS_WITH_COUNT_UNIT = new RegExp(`^${COUNT_UNIT}`);

function formatPlainSegment(text: string) {
  if (text.includes("\n") || text.includes("**")) return text;
  if (HEADING.test(text) || BULLET.test(text) || NUMBER.test(text)) return text;
  const emphasized = text
    .replace(QUOTED, "$1**$2**$3")
    .replace(AGENCY, "**$1**")
    .replace(HOTLINE, "**$1**")
    .replace(/\*\*\*\*/g, "");
  const sentences = emphasized.split(SENTENCE_BREAK).filter(Boolean);
  if (sentences.length < 3) return emphasized;
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += SENTENCES_PER_PARAGRAPH) {
    paragraphs.push(sentences.slice(i, i + SENTENCES_PER_PARAGRAPH).join(" "));
  }
  return paragraphs.join("\n\n");
}

function formatPlainReply(text: string) {
  return text
    .split(/\n{2,}/)
    .map(formatPlainSegment)
    .join("\n\n");
}

export function parseChatMarkdown(source: string): Block[] {
  const text = formatPlainReply(source);
  const blocks: Block[] = [];
  let current = null as Block | null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      current = null;
      continue;
    }
    if (HEADING.test(line)) {
      blocks.push({ kind: "heading", lines: [parseInline(line.replace(HEADING, ""))] });
      current = null;
      continue;
    }
    const listKind = BULLET.test(line) ? "bullet" : NUMBER.test(line) ? "number" : null;
    if (listKind) {
      const item = parseInline(line.replace(listKind === "bullet" ? BULLET : NUMBER, ""));
      if (current && "items" in current && current.kind === listKind) {
        current.items.push(item);
      } else {
        current = { kind: listKind, items: [item] };
        blocks.push(current);
      }
      continue;
    }
    if (current && "lines" in current && current.kind === "paragraph") {
      current.lines.push(parseInline(line));
    } else {
      current = { kind: "paragraph", lines: [parseInline(line)] };
      blocks.push(current);
    }
  }
  return blocks;
}

/** 굵게 표시된 조각이 전화번호(긴급·상담 전화)면 true. */
export function isHotline(line: Inline[], index: number): boolean {
  const inline = line[index];
  const next = line[index + 1]?.text ?? "";
  return inline.bold && FULL_HOTLINE.test(inline.text) && !STARTS_WITH_COUNT_UNIT.test(next);
}

/** "02-123-4567" 같은 표기에서 전화 걸 때 쓰는 숫자만 뽑는다. */
export function dialNumber(phone: string): string | null {
  const match = /[\d-]+/.exec(phone);
  return match ? match[0].replace(/-/g, "") : null;
}
