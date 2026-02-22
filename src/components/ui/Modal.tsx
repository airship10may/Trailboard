import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
};

const overlayClassName =
  "fixed inset-0 z-40 flex items-end justify-center bg-zinc-950/45 p-4 sm:items-center";
const panelBaseClassName =
  "w-full max-w-md rounded-3xl border border-[var(--tb-border)] bg-[var(--tb-surface-bg)] p-5 shadow-lg";

export default function Modal({
  isOpen,
  onClose,
  children,
  panelClassName,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={overlayClassName} onClick={onClose}>
      <div
        className={[panelBaseClassName, panelClassName].filter(Boolean).join(" ")}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
