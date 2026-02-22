import { useEffect, useMemo, useState } from "react";
import {
  dumpAppState,
  parseAppStateSnapshot,
  restoreAppState,
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
import {
  applyThemeToDocument,
  getThemeFromStorage,
  resolveThemeForEntitlement,
  THEME_OPTIONS,
  type AppTheme,
} from "../data/theme";

type PremiumActionType = "activate" | "reset";

const PROMPT_QUESTION = "人生であった一番甘酸っぱい瞬間は？";
const sectionClass =
  "rounded-3xl border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] p-6 shadow-sm";
const mutedTextClass = "text-[var(--tb-muted)]";
const buttonClass =
  "rounded-xl border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] px-4 py-2 text-sm text-[var(--tb-text)] transition hover:opacity-90";
const textAreaClass =
  "w-full rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-input-bg)] px-3 py-2 text-sm text-[var(--tb-text)] outline-none placeholder:text-[var(--tb-placeholder)] focus:border-[var(--tb-border)] focus:ring-2 focus:ring-[var(--tb-border)]/50";

export default function Settings() {
  const initialEntitlement = useMemo(() => loadEntitlement(), []);
  const [entitlement, setEntitlement] = useState(initialEntitlement);
  const [theme, setTheme] = useState<AppTheme>(() =>
    resolveThemeForEntitlement(getThemeFromStorage(), initialEntitlement)
  );
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
    applyThemeToDocument(theme);
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
    const freeEntitlement = createFreeEntitlement();
    setEntitlement(freeEntitlement);
    setTheme((currentTheme) =>
      resolveThemeForEntitlement(currentTheme, freeEntitlement)
    );
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
      <section className={sectionClass}>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className={`mt-1 text-sm ${mutedTextClass}`}>
          Select app theme (Premium unlocks additional variations)
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {THEME_OPTIONS.map((option) => {
            const isLocked = option.premiumOnly && !premiumActive;
            const isSelected = theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={isLocked}
                onClick={() => setTheme(option.value)}
                className={`rounded-xl px-4 py-2 text-sm ${
                  isSelected
                    ? "border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] font-semibold text-[var(--tb-text)] ring-2 ring-[var(--tb-border)]"
                    : isLocked
                      ? "cursor-not-allowed border border-[var(--tb-border)] bg-[var(--tb-input-bg)] text-[var(--tb-muted)] opacity-70"
                      : "border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] text-[var(--tb-text)] hover:ring-2 hover:ring-[var(--tb-border)]"
                }`}
              >
                {option.label}
                {option.premiumOnly ? " (Premium)" : ""}
              </button>
            );
          })}
        </div>
        {!premiumActive && (
          <p className={`mt-3 text-sm ${mutedTextClass}`}>
            Premium themes are locked. Activate Premium to use Soft Dark, Ivory,
            and Ash Grey.
          </p>
        )}
        <p className={`mt-2 text-sm ${mutedTextClass}`}>
          Premium theme falls back to Light when entitlement becomes inactive.
        </p>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold">Premium</h2>
        <p className={`mt-1 text-sm ${mutedTextClass}`}>
          Entitlement status (local mock)
        </p>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={mutedTextClass}>Status:</span>
            <span className="font-medium">
              {premiumActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={mutedTextClass}>Plan:</span>
            <span className="font-medium">{entitlement.plan}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={mutedTextClass}>Expires:</span>
            <span className="font-medium">{expiresAtLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={mutedTextClass}>Source:</span>
            <span className="font-medium">{entitlement.source}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isActivateDisabled}
            onClick={openActivateModal}
            className={`rounded-xl border px-4 py-2 text-sm transition ${
              isActivateDisabled
                ? "cursor-not-allowed border-[var(--tb-border)] bg-[var(--tb-input-bg)] text-[var(--tb-muted)] opacity-70"
                : "border-[var(--tb-border)] bg-[var(--tb-surface-bg)] text-[var(--tb-text)] hover:ring-2 hover:ring-[var(--tb-border)]"
            }`}
          >
            {isActivateDisabled
              ? "Premium Active (+30 days locked)"
              : "Activate Premium (+30 days)"}
          </button>
          <button
            type="button"
            onClick={openResetModal}
            className={buttonClass}
          >
            Reset to Free
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--tb-border)] p-4 text-sm">
          <h3 className="font-semibold">Prompt submission history</h3>
          {latestPromptSubmission ? (
            <div className="mt-3 space-y-1">
              <div>
                <span className={mutedTextClass}>Prompt: </span>
                <span>{latestPromptSubmission.promptText}</span>
              </div>
              <div>
                <span className={mutedTextClass}>Answer: </span>
                <span>{latestPromptSubmission.answerText}</span>
              </div>
              <div>
                <span className={mutedTextClass}>
                  Submitted: 
                </span>
                <span>
                  {new Date(latestPromptSubmission.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className={`mt-2 ${mutedTextClass}`}>
              No prompt submissions yet.
            </p>
          )}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold">Data</h2>
        <p className={`mt-1 text-sm ${mutedTextClass}`}>
          Export / Import local backup JSON
        </p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleExportJson}
            className={buttonClass}
          >
            Export JSON
          </button>
          <textarea
            value={exportJson}
            readOnly
            placeholder="Exported JSON will appear here."
            className={`min-h-36 text-xs ${textAreaClass}`}
          />
        </div>

        <div className="mt-5 space-y-3">
          <textarea
            value={importJson}
            onChange={(event) => setImportJson(event.target.value)}
            placeholder="Paste backup JSON to import (overwrite)."
            className={`min-h-36 text-xs ${textAreaClass}`}
          />
          <button
            type="button"
            onClick={handleImportJson}
            className={buttonClass}
          >
            Import JSON
          </button>
          {dataError && (
            <p className={`text-sm ${mutedTextClass}`}>{dataError}</p>
          )}
        </div>
      </section>

      {pendingPremiumAction && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-zinc-950/45 p-4 sm:items-center"
          onClick={closePremiumModal}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            {pendingPremiumAction === "activate" ? (
              <>
                <h3 className="text-base font-semibold">Activate Premium</h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  Premiumは0円/1カ月です。付与方法を選んでください。
                </p>

                {!showPromptRoute ? (
                  <div className="mt-5 space-y-2">
                    <button
                      type="button"
                      onClick={handleActivateWithLocalRoute}
                      className={`w-full text-left ${buttonClass}`}
                    >
                      0円で今月分を有効化する（local / mock）
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenPromptRoute}
                      className={`w-full text-left ${buttonClass}`}
                    >
                      お題で1ヶ月分を肩代わりする（prompt）
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-[var(--tb-border)] p-3 text-sm">
                      <div className={mutedTextClass}>お題</div>
                      <div className="mt-1">{PROMPT_QUESTION}</div>
                    </div>
                    <textarea
                      value={promptAnswer}
                      onChange={(event) => setPromptAnswer(event.target.value)}
                      placeholder="回答を入力してください"
                      className={`min-h-28 ${textAreaClass}`}
                    />
                    {promptError && (
                      <p className={`text-sm ${mutedTextClass}`}>{promptError}</p>
                    )}
                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPromptRoute(false)}
                        className={buttonClass}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitPromptRoute}
                        className={buttonClass}
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
                    className="rounded-xl px-3 py-2 text-xs text-[var(--tb-muted)] transition hover:bg-[var(--tb-input-bg)]"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold">Confirm action</h3>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  Freeに戻します。よろしいですか？
                </p>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closePremiumModal}
                    className={buttonClass}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className={buttonClass}
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
