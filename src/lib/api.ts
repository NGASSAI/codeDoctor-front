import axios from "axios";

export const api = axios.create({
  baseURL: "https://codedoctor-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Ajoute automatiquement le JWT aux requêtes authentifiées.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Gère les erreurs de réponse et normalise les messages d'erreur.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normaliser les messages d'erreur du backend
    if (error.response?.data) {
      const backendError = error.response.data;
      
      // Si le backend renvoie un message d'erreur, l'utiliser
      if (backendError.erreur) {
        error.message = backendError.erreur;
      } else if (backendError.message) {
        error.message = backendError.message;
      }
    }
    
    return Promise.reject(error);
  }
);