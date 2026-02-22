import { useEffect, useMemo, useState } from "react";
import {
  dumpAppState,
  parseAppStateSnapshot,
  restoreAppState,
  THEME_STORAGE_KEY,
} from "../data/appState";
import {
  createFreeEntitlement,
  createPremiumEntitlement,
  isPremiumActive,
  loadEntitlement,
  saveEntitlement,
} from "../data/entitlement";
import {
  loadPromptSubmissions,
  savePromptSubmissions,
  type PromptSubmission,
} from "../data/promptSubmissions";

type Theme = "light" | "dark";
type PremiumActionType = "activate" | "reset";

const PROMPT_QUESTION = "人生であった一番甘酸っぱい瞬間は？";

export default function Settings() {
  const initial = useMemo<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState<Theme>(initial);
  const [entitlement, setEntitlement] = useState(() => loadEntitlement());
  const [promptSubmissions, setPromptSubmissions] = useState<PromptSubmission[]>(
    () => loadPromptSubmissions()
  );
  const [exportJson, setExportJson] = useState("");
  const [importJson, setImportJson] = useState("");
  const [dataError, setDataError] = useState<string | null>(null);
  const [pendingPremiumAction, setPendingPremiumAction] =
    useState<PremiumActionType | null>(null);
  const [showPromptRoute, setShowPromptRoute] = useState(false);
  const [promptAnswer, setPromptAnswer] = useState("");
  const [promptError, setPromptError] = useState<string | null>(null);

  const premiumActive = useMemo(
    () => isPremiumActive(entitlement),
    [entitlement]
  );
  const expiresAtLabel = useMemo(() => {
    if (entitlement.expiresAt === null) return "No expiry";
    return new Date(entitlement.expiresAt).toLocaleDateString();
  }, [entitlement.expiresAt]);
  const latestPromptSubmission = promptSubmissions[0] ?? null;
  const isActivateDisabled = premiumActive;

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    saveEntitlement(entitlement);
  }, [entitlement]);

  useEffect(() => {
    savePromptSubmissions(promptSubmissions);
  }, [promptSubmissions]);

  function closePremiumModal() {
    setPendingPremiumAction(null);
    setShowPromptRoute(false);
    setPromptAnswer("");
    setPromptError(null);
  }

  useEffect(() => {
    if (!pendingPremiumAction) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePremiumModal();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingPremiumAction]);

  function activatePremium(source: "local" | "prompt") {
    setEntitlement(createPremiumEntitlement(30, source));
  }

  function resetToFree() {
    setEntitlement(createFreeEntitlement());
  }

  function openActivateModal() {
    if (isActivateDisabled) return;
    setPendingPremiumAction("activate");
    setShowPromptRoute(false);
    setPromptAnswer("");
    setPromptError(null);
  }

  function openResetModal() {
    setPendingPremiumAction("reset");
  }

  function handleActivateWithLocalRoute() {
    activatePremium("local");
    closePremiumModal();
  }

  function handleOpenPromptRoute() {
    setShowPromptRoute(true);
    setPromptError(null);
  }

  function handleSubmitPromptRoute() {
    const answer = promptAnswer.trim();
    if (!answer) {
      setPromptError("回答を入力してください。");
      return;
    }

    const submission: PromptSubmission = {
      promptText: PROMPT_QUESTION,
      answerText: answer,
      submittedAt: Date.now(),
    };
    setPromptSubmissions((prev) => [submission, ...prev]);
    activatePremium("prompt");
    closePremiumModal();
  }

  function handleConfirmReset() {
    resetToFree();
    closePremiumModal();
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
            disabled={isActivateDisabled}
            onClick={openActivateModal}
            className={`rounded-xl border px-4 py-2 text-sm transition-colors ${
              isActivateDisabled
                ? "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-800/80 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300/80"
                : "border-zinc-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800 dark:border-zinc-700 dark:hover:border-amber-900/70 dark:hover:bg-amber-950/40 dark:hover:text-amber-300"
            }`}
          >
            {isActivateDisabled
              ? "Premium Active (+30 days locked)"
              : "Activate Premium (+30 days)"}
          </button>
          <button
            type="button"
            onClick={openResetModal}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-zinc-700 dark:hover:border-red-900/70 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            Reset to Free
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
          <h3 className="font-semibold">Prompt submission history</h3>
          {latestPromptSubmission ? (
            <div className="mt-3 space-y-1">
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Prompt: </span>
                <span>{latestPromptSubmission.promptText}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">Answer: </span>
                <span>{latestPromptSubmission.answerText}</span>
              </div>
              <div>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Submitted: 
                </span>
                <span>
                  {new Date(latestPromptSubmission.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              No prompt submissions yet.
            </p>
          )}
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

      {pendingPremiumAction && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-950/45 p-4 sm:items-center"
          onClick={closePremiumModal}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
            onClick={(event) => event.stopPropagation()}
          >
            {pendingPremiumAction === "activate" ? (
              <>
                <h3 className="text-base font-semibold">Activate Premium</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Premiumは0円/1カ月です。付与方法を選んでください。
                </p>

                {!showPromptRoute ? (
                  <div className="mt-5 space-y-2">
                    <button
                      type="button"
                      onClick={handleActivateWithLocalRoute}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
                    >
                      0円で今月分を有効化する（local / mock）
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenPromptRoute}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
                    >
                      お題で1ヶ月分を肩代わりする（prompt）
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-zinc-200 p-3 text-sm dark:border-zinc-700">
                      <div className="text-zinc-500 dark:text-zinc-400">お題</div>
                      <div className="mt-1">{PROMPT_QUESTION}</div>
                    </div>
                    <textarea
                      value={promptAnswer}
                      onChange={(event) => setPromptAnswer(event.target.value)}
                      placeholder="回答を入力してください"
                      className="min-h-28 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                    />
                    {promptError && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {promptError}
                      </p>
                    )}
                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPromptRoute(false)}
                        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitPromptRoute}
                        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                      >
                        回答して有効化
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={closePremiumModal}
                    className="rounded-xl px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold">Confirm action</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  Freeに戻します。よろしいですか？
                </p>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closePremiumModal}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
