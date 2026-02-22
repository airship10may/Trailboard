import type { ButtonHTMLAttributes } from "react";
import { getButtonClass, type ButtonVariant } from "../buttonVariants";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "secondary",
  className,
  type,
  ...props
}: ButtonProps) {
  const resolvedClassName = [getButtonClass(variant), className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type ?? "button"}
      className={resolvedClassName}
      {...props}
    />
  );
}
