
import { Code2, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
  admin?: boolean;
}

export default function Navbar({
  onMenuClick,
  admin = false,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex h-68px items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu size={21} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
              <Code2 size={18} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-[17px] font-bold tracking-tight text-zinc-950">
                CodeDoctor
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 sm:block">
                {admin ? "Administration" : "Espace utilisateur"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-zinc-600">
              Système opérationnel
            </span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {admin ? "A" : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}

