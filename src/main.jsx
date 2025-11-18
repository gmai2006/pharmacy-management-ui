import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

import { UserContextProvider } from './context/UserContext.jsx';


// const oktaConfig = {
//   issuer: import.meta.env.VITE_AUTH0_DOMAIN,
//   clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
//   redirectUri: window.location.origin + "/login/callback",
// };

function restoreOriginalUri(_oktaAuth, originalUri) {
  // Default behavior recommended by Okta:
  window.location.replace(originalUri || "/");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </Auth0Provider>
  </StrictMode>,
)
