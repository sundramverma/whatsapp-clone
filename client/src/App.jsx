import { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// components
import UserProvider from "./context/UserProvider";
import AccountProvider from "./context/AccountProvider";
import Loader from "./components/loader/Loader";

const Messenger = lazy(() => import("./components/Messenger"));

function App() {
  const clientId =
    "399714262188-0em6luur0b2vo88prhdf28mfj2r39nbt.apps.googleusercontent.com";

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

export default App;
