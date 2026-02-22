import {
  type Entitlement,
  saveEntitlement,
} from "./entitlement";
import {
  getPreferredTrails,
  saveTrails,
  type Trail,
} from "./trails";
import {
  isTheme,
  THEME_STORAGE_KEY,
  type AppTheme,
} from "./theme";

export type AppDataSnapshot = {
  version: number;
  exportedAt: number;
  cards: Trail[];
  theme: AppTheme;
  entitlement: Entitlement;
};

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

function isEntitlement(value: unknown): value is Entitlement {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Entitlement>;

  const isPlan = candidate.plan === "free" || candidate.plan === "premium";
  const isSource =
    candidate.source === "local" ||
    candidate.source === "prompt" ||
    candidate.source === "stripe";
  const isExpiresAt =
    candidate.expiresAt === null ||
    (typeof candidate.expiresAt === "number" &&
      Number.isFinite(candidate.expiresAt));
  const isUpdatedAt =
    typeof candidate.updatedAt === "number" && Number.isFinite(candidate.updatedAt);

  return isPlan && isSource && isExpiresAt && isUpdatedAt;
}

export function dumpAppState(params: {
  theme: AppTheme;
  entitlement: Entitlement;
}): AppDataSnapshot {
  return {
    version: 1,
    exportedAt: Date.now(),
    cards: getPreferredTrails(),
    theme: params.theme,
    entitlement: params.entitlement,
  };
}

export function parseAppStateSnapshot(raw: string): AppDataSnapshot {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid data format.");
  }

  const candidate = parsed as Partial<AppDataSnapshot>;
  const { version, exportedAt, cards, theme, entitlement } = candidate;
  const hasValidHeader =
    typeof version === "number" &&
    Number.isFinite(version) &&
    typeof exportedAt === "number" &&
    Number.isFinite(exportedAt);
  const hasValidCards = Array.isArray(cards) && cards.every(isTrail);
  const hasValidTheme = isTheme(theme);
  const hasValidEntitlement = isEntitlement(entitlement);

  if (!hasValidHeader || !hasValidCards || !hasValidTheme || !hasValidEntitlement) {
    throw new Error("Invalid backup schema.");
  }

  return {
    version,
    exportedAt,
    cards,
    theme,
    entitlement,
  };
}

export function restoreAppState(snapshot: AppDataSnapshot) {
  saveTrails(snapshot.cards);
  localStorage.setItem(THEME_STORAGE_KEY, snapshot.theme);
  saveEntitlement(snapshot.entitlement);
}
