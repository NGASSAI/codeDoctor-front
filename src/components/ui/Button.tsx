
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary:
      "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    ghost:
      "bg-transparent text-zinc-600 hover:bg-zinc-100",
  };

  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center
        rounded-xl px-4 py-2.5
        text-sm font-medium
        transition-all duration-200
        outline-none
        focus-visible:ring-2
        focus-visible:ring-zinc-900
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

