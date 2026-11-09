/** className 조각들을 공백으로 이어 붙인다. false/undefined는 건너뛴다. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
