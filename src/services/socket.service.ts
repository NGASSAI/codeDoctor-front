
import { io, type Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:4000";

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

  currentSocket.on(
    "notification",
    callback
  );

  return () => {
    currentSocket.off(
      "notification",
      callback
    );
  };
}
