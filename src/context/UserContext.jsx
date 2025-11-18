import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const UserContext = createContext(null);

import init from "../init";

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
const getUserByEmail = '/' + init.appName + '/api/' + 'users/byEmail/';


export function UserContextProvider({ children }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const [appUser, setAppUser] = useState(undefined);

  const getUser = async (email) => {
    try {
      const response = await fetch(`${getUserByEmail}${email}`, { headers: headers });
      if (!response.ok) throw new Error('Failed to fetch users');
      const jsonData = await response.json();
      setAppUser(jsonData[0]);
      console.log('User fetched:', jsonData);

      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {

    }
  };

  const value = {
    user,
    appUser,
    isAuthenticated,
    isLoading,
    login: () => loginWithRedirect(),
    logout: () =>
      logout({ logoutParams: { returnTo: window.location.origin } }),
    getAccessTokenSilently
  };

  

  useEffect(() => {
    if (!appUser && !!import.meta.env.VITE_DEV) {
      console.log(`user context: get user from local dev user ${user?.email}`);
      getUser(import.meta.env.VITE_DEV);
    } else if (user && !appUser) {
      console.log(`user context: get user from okta user ${user?.email}`);
      getUser(user.email);
    }
  });

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
