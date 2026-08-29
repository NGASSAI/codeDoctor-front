
import type {
  HTMLAttributes,
  ReactNode,
} from "react";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-blue-200/80
        bg-white/80 backdrop-blur-sm
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

