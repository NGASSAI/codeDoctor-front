
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const CLE_REFUS = "codedoctor-pwa-install-dismissed";

function estDejaInstallee() {
  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    Boolean(
      (
        window.navigator as Navigator & {
          standalone?: boolean;
        }
      ).standalone
    )
  );
}

export default function InstallPWA() {
  const [installationDisponible, setInstallationDisponible] =
    useState(false);

  const [promptInstallation, setPromptInstallation] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (estDejaInstallee()) {
      return;
    }

    const dejaRefuse =
      localStorage.getItem(CLE_REFUS) === "true";

    if (dejaRefuse) {
      return;
    }

    function gererAvantInstallation(
      event: BeforeInstallPromptEvent
    ) {
      event.preventDefault();

      setPromptInstallation(event);
      setInstallationDisponible(true);
      setVisible(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      gererAvantInstallation
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        gererAvantInstallation
      );
    };
  }, []);

  async function installer() {
    if (!promptInstallation) {
      return;
    }

    try {
      await promptInstallation.prompt();

      const choix =
        await promptInstallation.userChoice;

      if (choix.outcome === "accepted") {
        setVisible(false);
      }

      setPromptInstallation(null);
      setInstallationDisponible(false);
    } catch (error) {
      console.error(
        "Erreur lors de l'installation PWA :",
        error
      );
    }
  }

  function fermer() {
    localStorage.setItem(CLE_REFUS, "true");

    setVisible(false);
    setPromptInstallation(null);
    setInstallationDisponible(false);
  }

  if (
    !visible ||
    !installationDisponible ||
    !promptInstallation
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-4 bottom-4 z-60 sm:left-auto sm:right-6 sm:w-420px"
    >
      <div className="rounded-2xl border border-blue-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl shadow-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
            <Download size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Installer CodeDoctor
                </h2>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Installez CodeDoctor sur votre appareil
                  pour y accéder plus rapidement depuis
                  votre écran d'accueil.
                </p>
              </div>

              <button
                type="button"
                onClick={fermer}
                className="
                  shrink-0 rounded-lg p-1.5
                  text-zinc-400
                  transition
                  hover:bg-blue-50
                  hover:text-blue-600
                "
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void installer()}
                className="
                  inline-flex flex-1
                  items-center justify-center
                  gap-2 rounded-xl
                  bg-gradient-to-r from-blue-600 to-cyan-600
                  px-4 py-2.5
                  text-sm font-semibold
                  text-white
                  transition
                  hover:shadow-lg hover:shadow-blue-500/30
                "
              >
                <Download size={16} />
                Installer l'application
              </button>

              <button
                type="button"
                onClick={fermer}
                className="
                  rounded-xl
                  border border-blue-200
                  px-4 py-2.5
                  text-sm font-medium
                  text-blue-700
                  transition
                  hover:bg-blue-50
                "
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
