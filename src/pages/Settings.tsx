import { useEffect, useMemo, useState } from "react";
import {
  dumpAppState,
  parseAppStateSnapshot,
  restoreAppState,
  THEME_STORAGE_KEY,
} from "../data/appState";
import {
  createFreeEntitlement,
  createLocalPremiumEntitlement,
  isPremiumActive,
  loadEntitlement,
  saveEntitlement,
} from "../data/entitlement";

type Theme = "light" | "dark";

export default function Settings() {
  const initial = useMemo<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState<Theme>(initial);
  const [entitlement, setEntitlement] = useState(() => loadEntitlement());
  const [exportJson, setExportJson] = useState("");
  const [importJson, setImportJson] = useState("");
  const [dataError, setDataError] = useState<string | null>(null);

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

  function handleExportJson() {
    const snapshot = dumpAppState({ theme, entitlement });
    setExportJson(JSON.stringify(snapshot, null, 2));
    setDataError(null);
  }

  function handleImportJson() {
    const confirmed = window.confirm(
      "Import will overwrite current local data. Continue?"
    );
    if (!confirmed) return;

    try {
      const snapshot = parseAppStateSnapshot(importJson);
      restoreAppState(snapshot);
      window.location.reload();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to import data.";
      setDataError(message);
    }
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

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <h2 className="text-xl font-semibold">Data</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Export / Import local backup JSON
        </p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
          >
            Export JSON
          </button>
          <textarea
            value={exportJson}
            readOnly
            placeholder="Exported JSON will appear here."
            className="min-h-36 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="mt-5 space-y-3">
          <textarea
            value={importJson}
            onChange={(event) => setImportJson(event.target.value)}
            placeholder="Paste backup JSON to import (overwrite)."
            className="min-h-36 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          />
          <button
            type="button"
            onClick={handleImportJson}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
          >
            Import JSON
          </button>
          {dataError && (
            <p className="text-sm text-red-600 dark:text-red-400">{dataError}</p>
          )}
        </div>
      </section>
    </div>
  );
}
