const ANONYMOUS_ID_KEY = "anonymousId";

export function getExistingAnonymousId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ANONYMOUS_ID_KEY);
  } catch {
    return null;
  }
}

export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  const existing = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(ANONYMOUS_ID_KEY, id);
  return id;
}
