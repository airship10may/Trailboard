export type Trail = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  minutes: number;
};

export const CARD_STORAGE_KEY = "trailboard.cards.v1";

export const trails: Trail[] = [
  {
    id: "a01",
    title: "余白を取り戻す",
    subtitle: "短い散歩と、呼吸を整える",
    tags: ["calm", "reset"],
    minutes: 12,
  },
  {
    id: "a02",
    title: "メモを磨く",
    subtitle: "1行だけ書く、を続ける",
    tags: ["writing", "habit"],
    minutes: 8,
  },
  {
    id: "a03",
    title: "設計を眺め直す",
    subtitle: "要件→データ→画面の順で整理",
    tags: ["design", "structure"],
    minutes: 15,
  },
];

function isTrail(value: unknown): value is Trail {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Trail>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.subtitle === "string" &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every((tag) => typeof tag === "string") &&
    typeof candidate.minutes === "number"
  );
}

export function loadStoredTrails(): Trail[] | null {
  const raw = localStorage.getItem(CARD_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every(isTrail)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTrails(nextTrails: Trail[]) {
  localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(nextTrails));
}

export function getPreferredTrails() {
  return loadStoredTrails() ?? trails;
}

export function parseTags(raw: string): string[] {
  const normalized = raw
    .split(/[\s,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#+/, "").toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(normalized));
}

export function parseDurationToMinutes(raw: string): number | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  const withUnit = trimmed.match(/^(\d+)\s*m$/);
  if (!withUnit) return null;
  return Number.parseInt(withUnit[1], 10);
}

export function createTrailId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `trail-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getTrail(id: string) {
  return getPreferredTrails().find((t) => t.id === id);
}

export function deleteTrail(id: string): boolean {
  const current = getPreferredTrails();
  const next = current.filter((trail) => trail.id !== id);
  if (next.length === current.length) {
    return false;
  }

  saveTrails(next);
  return true;
}
