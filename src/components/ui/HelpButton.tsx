import { useState } from "react";
import { CircleHelp, X } from "lucide-react";

interface HelpButtonProps {
  title: string;
  description?: string;
  items: string[];
}

export default function HelpButton({
  title,
  description,
  items,
}: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((valeur) => !valeur)}
        className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
      >
        <CircleHelp size={15} />
        Aide
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-sky-100 bg-white p-4 shadow-xl shadow-sky-500/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              {description && (
                <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer l'aide"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
