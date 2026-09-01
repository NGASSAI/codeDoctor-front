import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "https://codedoctor-backend.onrender.com";

let socket: Socket | null = null;
let audioContext: AudioContext | null = null;

/**
 * Récupère ou instancie l'AudioContext de manière lazy.
 */
function obtenirAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  return audioContext;
}

/**
 * Débloque le contexte audio lors d'un geste utilisateur direct.
 */
function activerAudioSurInteraction() {
  const ctx = obtenirAudioContext();
  if (ctx && ctx.state === "suspended") {
    void ctx.resume();
  }
}

// Attachement des écouteurs globaux
if (typeof window !== "undefined") {
  const gestesUtilisateur = ["click", "keydown", "touchstart", "pointerdown"];

  const handler = () => {
    activerAudioSurInteraction();
    gestesUtilisateur.forEach((event) => {
      window.removeEventListener(event, handler);
    });
  };

  gestesUtilisateur.forEach((event) => {
    window.addEventListener(event, handler, { once: true });
  });
}

export function obtenirSocket(): Socket | null {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  if (socket) {
    const authentification =
      typeof socket.auth === "object" ? socket.auth : {};

    if (authentification.token !== token) {
      socket.auth = {
        ...authentification,
        token,
      };
    }

    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: true,
    auth: {
      token,
    },
  });

  socket.on("connect_error", (error) => {
    console.error("Erreur de connexion Socket.IO :", error.message);
  });

  socket.on("disconnect", (raison) => {
    console.log("Socket.IO déconnecté :", raison);
  });

  return socket;
}

export function deconnecterSocket() {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

export function ecouterNotification(
  callback: (notification: unknown) => void
) {
  const currentSocket = obtenirSocket();

  if (!currentSocket) {
    return () => {};
  }

  const gererNotification = (notification: unknown) => {
    jouerSonNotification();
    callback(notification);
  };

  currentSocket.on("notification", gererNotification);

  return () => {
    currentSocket.off("notification", gererNotification);
  };
}

function jouerSonNotification() {
  try {
    const context = obtenirAudioContext();

    // Si pas de support audio ou contexte suspendu (pas encore de geste), on ignore le son silencieusement sans crash
    if (!context || context.state !== "running") {
      return;
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1320,
      context.currentTime + 0.13
    );

    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.18,
      context.currentTime + 0.02
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.28
    );

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.28);
  } catch (error) {
    console.error(
      "Erreur lors de la lecture du son de notification :",
      error
    );
  }
}