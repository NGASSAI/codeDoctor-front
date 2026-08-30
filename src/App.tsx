import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/auth.store";
import Toast from "./components/ui/Toast";

export default function App() {
  const initialiser = useAuthStore(
    (state) => state.initialiser
  );

  useEffect(() => {
    initialiser();
  }, [initialiser]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}