
import type { InputHTMLAttributes } from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-zinc-800"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error && id ? `${id}-error` : undefined
        }
        className={`
          w-full rounded-xl
          border
          bg-white px-4 py-3
          text-sm text-zinc-950
          outline-none
          transition
          placeholder:text-zinc-400
          focus:border-blue-500
          focus:ring-4 focus:ring-blue-500/10
          disabled:cursor-not-allowed
          disabled:bg-zinc-50
          disabled:opacity-60
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-50"
              : "border-blue-200"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          className="text-xs text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

