export type EntitlementPlan = "free" | "premium";
export type EntitlementSource = "local" | "prompt" | "stripe";

export type Entitlement = {
  plan: EntitlementPlan;
  expiresAt: number | null;
  source: EntitlementSource;
  updatedAt: number;
};

export const ENTITLEMENT_STORAGE_KEY = "trailboard.entitlement.v1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isPlan(value: unknown): value is EntitlementPlan {
  return value === "free" || value === "premium";
}

function isSource(value: unknown): value is EntitlementSource {
  return value === "local" || value === "prompt" || value === "stripe";
}

function isEntitlement(value: unknown): value is Entitlement {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Entitlement>;

  return (
    isPlan(candidate.plan) &&
    (candidate.expiresAt === null ||
      (typeof candidate.expiresAt === "number" &&
        Number.isFinite(candidate.expiresAt))) &&
    isSource(candidate.source) &&
    typeof candidate.updatedAt === "number" &&
    Number.isFinite(candidate.updatedAt)
  );
}

export function createFreeEntitlement(now = Date.now()): Entitlement {
  return {
    plan: "free",
    expiresAt: null,
    source: "local",
    updatedAt: now,
  };
}

export function loadEntitlement(): Entitlement {
  const raw = localStorage.getItem(ENTITLEMENT_STORAGE_KEY);
  if (!raw) return createFreeEntitlement();

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isEntitlement(parsed)) return parsed;
    return createFreeEntitlement();
  } catch {
    return createFreeEntitlement();
  }
}

export function saveEntitlement(entitlement: Entitlement) {
  localStorage.setItem(ENTITLEMENT_STORAGE_KEY, JSON.stringify(entitlement));
}

export function isPremiumActive(entitlement: Entitlement, now = Date.now()) {
  if (entitlement.plan !== "premium") return false;
  if (entitlement.expiresAt === null) return true;
  return entitlement.expiresAt > now;
}

export function createLocalPremiumEntitlement(days: number, now = Date.now()) {
  return {
    plan: "premium",
    expiresAt: now + days * ONE_DAY_MS,
    source: "local",
    updatedAt: now,
  } satisfies Entitlement;
}
