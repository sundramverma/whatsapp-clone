import { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// context providers
import UserProvider from "./context/UserProvider";
import AccountProvider from "./context/AccountProvider";

// components
import Loader from "./components/loader/Loader";

const Messenger = lazy(() => import("./components/Messenger"));

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <AccountProvider>
          <Suspense fallback={<Loader />}>
            <Messenger />
          </Suspense>
        </AccountProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

// 🔍 Debug (temporary)
console.log("GOOGLE CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log("BACKEND BASE URL:", import.meta.env.VITE_BASE_URL);

export default App;
