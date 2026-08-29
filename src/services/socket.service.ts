
import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "https://codedoctor-backend.onrender.com";

let socket: Socket | null = null;

export function obtenirSocket(): Socket | null {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  if (socket) {
    const authentification =
      typeof socket.auth === "object"
        ? socket.auth
        : {};

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
    console.error(
      "Erreur de connexion Socket.IO :",
      error.message
    );
  });

  socket.on("disconnect", (raison) => {
    console.log(
      "Socket.IO déconnecté :",
      raison
    );
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

  const gererNotification = (
    notification: unknown
  ) => {
    jouerSonNotification();
    callback(notification);
  };

  currentSocket.on(
    "notification",
    gererNotification
  );

  return () => {
    currentSocket.off(
      "notification",
      gererNotification
    );
  };
}

function jouerSonNotification() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext =
      new AudioContextClass();

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(
      audioContext.destination
    );

    oscillator.frequency.value = 880;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(
      0.3,
      audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(
      audioContext.currentTime
    );

    oscillator.stop(
      audioContext.currentTime + 0.3
    );

    oscillator.addEventListener(
      "ended",
      () => {
        void audioContext.close();
      },
      { once: true }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la lecture du son de notification :",
      error
    );
  }
}
