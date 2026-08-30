
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart'> {
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
      "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30",
    secondary:
      "border border-blue-200 bg-white/80 backdrop-blur-sm text-blue-900 hover:bg-blue-50 hover:border-blue-300",
    danger:
      "bg-red-600 text-white shadow-md shadow-red-500/20 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/30",
    ghost:
      "bg-transparent text-blue-700 hover:bg-blue-100",
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
        focus-visible:ring-blue-500
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:opacity-50
        hover:scale-[1.02]
        active:scale-[0.98]
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

