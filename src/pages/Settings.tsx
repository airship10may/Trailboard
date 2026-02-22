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
import Button from "../components/ui/Button";
import PremiumActionModal, {
  type PremiumActionType,
} from "../components/settings/PremiumActionModal";

const PROMPT_QUESTION = "人生であった一番甘酸っぱい瞬間は？";
const sectionClass =
  "rounded-3xl border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] p-6 shadow-sm";
const mutedTextClass = "text-[var(--tb-muted)]";
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
                    ? "border border-[var(--tb-border)] bg-[var(--tb-input-bg)] font-semibold text-[var(--tb-text)] ring-2 ring-[var(--tb-border)]"
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
            <span
              className={
                premiumActive
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : `font-medium ${mutedTextClass}`
              }
            >
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
          <Button
            variant={isActivateDisabled ? "premiumDisabled" : "premium"}
            disabled={isActivateDisabled}
            onClick={openActivateModal}
          >
            {isActivateDisabled
              ? "Premium Active (+30 days locked)"
              : "Activate Premium (+30 days)"}
          </Button>
          <Button variant="danger" onClick={openResetModal}>
            Reset to Free
          </Button>
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
          <Button variant="secondary" onClick={handleExportJson}>
            Export JSON
          </Button>
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
          <Button variant="secondary" onClick={handleImportJson}>
            Import JSON
          </Button>
          {dataError && (
            <p className={`text-sm ${mutedTextClass}`}>{dataError}</p>
          )}
        </div>
      </section>

      <PremiumActionModal
        action={pendingPremiumAction}
        showPromptRoute={showPromptRoute}
        promptQuestion={PROMPT_QUESTION}
        promptAnswer={promptAnswer}
        promptError={promptError}
        onClose={closePremiumModal}
        onActivateWithLocalRoute={handleActivateWithLocalRoute}
        onOpenPromptRoute={handleOpenPromptRoute}
        onBackFromPromptRoute={() => setShowPromptRoute(false)}
        onPromptAnswerChange={setPromptAnswer}
        onSubmitPromptRoute={handleSubmitPromptRoute}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
