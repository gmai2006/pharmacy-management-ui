import AdminDashboard from "./pages/AdminDashboard";
import OktaLoginModal from "./components/OktaLogin";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContextProvider } from "./context/UserContext";



const App = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <>
      {!isAuthenticated && !import.meta.env.VITE_DEV ? (
        <OktaLoginModal />
      ) : (
        <div>
          <UserContextProvider >
            <AdminDashboard />
          </UserContextProvider>
        </div>
      )}
    </>
  );
};
export default App;