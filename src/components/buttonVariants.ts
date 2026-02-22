export type ButtonVariant =
  | "primary"
  | "secondary"
  | "premium"
  | "premiumDisabled"
  | "success"
  | "danger";

const buttonBaseClass =
  "rounded-xl border px-4 py-2 text-sm transition-colors transition-shadow transition-opacity";

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--tb-text)] bg-[var(--tb-text)] text-[var(--tb-surface-bg)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "border-[var(--tb-border)] bg-[var(--tb-surface-bg)] text-[var(--tb-text)] hover:bg-[var(--tb-input-bg)] hover:ring-1 hover:ring-[var(--tb-border)]",
  premium:
    "border-[var(--tb-border)] bg-[var(--tb-surface-bg)] text-[var(--tb-text)] hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 dark:hover:border-amber-800 dark:hover:bg-amber-950/30 dark:hover:text-amber-300",
  premiumDisabled:
    "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-700 opacity-80 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300",
  success:
    "border-[var(--tb-border)] bg-[var(--tb-surface-bg)] text-[var(--tb-text)] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300",
  danger:
    "border-[var(--tb-border)] bg-[var(--tb-surface-bg)] text-[var(--tb-text)] hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-300",
};

export function getButtonClass(variant: ButtonVariant): string {
  return `${buttonBaseClass} ${buttonVariantClasses[variant]}`;
}
