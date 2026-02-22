import Button from "../ui/Button";
import Modal from "../ui/Modal";

export type PremiumActionType = "activate" | "reset";

type PremiumActionModalProps = {
  action: PremiumActionType | null;
  showPromptRoute: boolean;
  promptQuestion: string;
  promptAnswer: string;
  promptError: string | null;
  onClose: () => void;
  onActivateWithLocalRoute: () => void;
  onOpenPromptRoute: () => void;
  onBackFromPromptRoute: () => void;
  onPromptAnswerChange: (nextAnswer: string) => void;
  onSubmitPromptRoute: () => void;
  onConfirmReset: () => void;
};

const mutedTextClass = "text-[var(--tb-muted)]";
const textAreaClass =
  "min-h-28 w-full rounded-2xl border border-[var(--tb-border)] bg-[var(--tb-input-bg)] px-3 py-2 text-sm text-[var(--tb-text)] outline-none placeholder:text-[var(--tb-placeholder)] focus:border-[var(--tb-border)] focus:ring-2 focus:ring-[var(--tb-border)]/50";

export default function PremiumActionModal({
  action,
  showPromptRoute,
  promptQuestion,
  promptAnswer,
  promptError,
  onClose,
  onActivateWithLocalRoute,
  onOpenPromptRoute,
  onBackFromPromptRoute,
  onPromptAnswerChange,
  onSubmitPromptRoute,
  onConfirmReset,
}: PremiumActionModalProps) {
  return (
    <Modal isOpen={Boolean(action)} onClose={onClose}>
      {action === "activate" ? (
        <>
          <h3 className="text-base font-semibold">Activate Premium</h3>
          <p className={`mt-2 text-sm ${mutedTextClass}`}>
            Premiumは0円/1カ月です。付与方法を選んでください。
          </p>

          {!showPromptRoute ? (
            <div className="mt-5 space-y-2">
              <Button
                variant="secondary"
                onClick={onActivateWithLocalRoute}
                className="w-full text-left"
              >
                0円で今月分を有効化する（local / mock）
              </Button>
              <Button
                variant="secondary"
                onClick={onOpenPromptRoute}
                className="w-full text-left"
              >
                お題で1ヶ月分を肩代わりする（prompt）
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-[var(--tb-border)] p-3 text-sm">
                <div className={mutedTextClass}>お題</div>
                <div className="mt-1">{promptQuestion}</div>
              </div>
              <textarea
                value={promptAnswer}
                onChange={(event) => onPromptAnswerChange(event.target.value)}
                placeholder="回答を入力してください"
                className={textAreaClass}
              />
              {promptError && <p className={`text-sm ${mutedTextClass}`}>{promptError}</p>}
              <div className="flex justify-between gap-2">
                <Button variant="secondary" onClick={onBackFromPromptRoute}>
                  Back
                </Button>
                <Button variant="secondary" onClick={onSubmitPromptRoute}>
                  回答して有効化
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
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
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirmReset}>
              Confirm
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
