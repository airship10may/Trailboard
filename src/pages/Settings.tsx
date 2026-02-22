import { useEffect, useMemo, useState } from "react";
import {
  createFreeEntitlement,
  createLocalPremiumEntitlement,
  isPremiumActive,
  loadEntitlement,
  saveEntitlement,
} from "../data/entitlement";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "trailboard.theme";

export default function Settings() {
  const initial = useMemo<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState<Theme>(initial);
  const [entitlement, setEntitlement] = useState(() => loadEntitlement());

  const premiumActive = useMemo(
    () => isPremiumActive(entitlement),
    [entitlement]
  );
  const expiresAtLabel = useMemo(() => {
    if (entitlement.expiresAt === null) return "No expiry";
    return new Date(entitlement.expiresAt).toLocaleDateString();
  }, [entitlement.expiresAt]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    saveEntitlement(entitlement);
  }, [entitlement]);

  function handleActivatePremium() {
    setEntitlement(createLocalPremiumEntitlement(30));
  }

  function handleResetToFree() {
    setEntitlement(createFreeEntitlement());
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          テーマを選択できます(Light/Dark)
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-xl px-4 py-2 text-sm ${
              theme === "light"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-xl px-4 py-2 text-sm ${
              theme === "dark"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
            }`}
          >
            Dark
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="text-xl font-semibold">Premium</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Entitlement status (local mock)
        </p>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Status:</span>
            <span
              className={
                premiumActive
                  ? "font-medium text-emerald-700 dark:text-emerald-300"
                  : "font-medium text-zinc-700 dark:text-zinc-200"
              }
            >
              {premiumActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Plan:</span>
            <span className="font-medium">{entitlement.plan}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Expires:</span>
            <span className="font-medium">{expiresAtLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Source:</span>
            <span className="font-medium">{entitlement.source}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleActivatePremium}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
          >
            Activate Premium (+30 days)
          </button>
          <button
            type="button"
            onClick={handleResetToFree}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
          >
            Reset to Free
          </button>
        </div>
      </section>
    </div>
  );
}
