import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DeviceFingerprintService from '../utils/fingerprinting';
import { getMyIPSafe } from '../utils/util';
export const UserContext = createContext(null);

import init from "../init";
import axios from "axios";

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
const getUserByEmail = '/' + init.appName + '/api/' + 'users/byEmail/';
const systemAuthUrl = '/' + init.appName + '/api/' + 'authlogs/';
const selectUrl = `/${init.appName}/api/devicefingerprints/selectAll`;
const deviceUrl = `/${init.appName}/api/devicefingerprints/`;
const stationsUrl = `/${init.appName}/api/stations/selectAll`;

const getStations = async () => {
  const response = await axios.get(stationsUrl);
  return response.data;
}

const getDevices = async () => {
  try {
    const response = await fetch(selectUrl, { headers: headers });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    showNotification('Failed to load users', 'error');
  } finally {

  }
};

const addSystemAuthLog = async (data) => {
  // const data = { name: 'New Device', status: 'active' };
  axios.put(systemAuthUrl, data)
    .then(response => console.log(response.data))
    .catch(error => console.error(error));
}

const createSystemAuthLog = async (userId, username, eventType, status, error) => {
  const ip = '192.168.1.200';//await getMyIPSafe();
  return {
    "userId": userId,
    "username": username,
    "eventType": eventType,
    "status": status,
    "ipAddress": ip,
    "userAgent": navigator.userAgent,
    "metadata": {
      "os": "iOS",
      "reason": status,
      "browser": DeviceFingerprintService.getBrowserVendor(),
      "device_type": navigator.userAgentData.platform,
      "eror": error
    },
  }
}

// Handle add a new station
const registerDevice = async (data) => {
  try {
    const response = await fetch(deviceUrl, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        ...data,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register new station');
    }

    return await response.json();

  } catch (error) {
    console.error('Error registering a station:', error);
  } finally {
  }
};

export function UserContextProvider({ children }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const department = `Pharmacy`;
  const location = `TBD`;
  const [appUser, setAppUser] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [stationName, setStationName] = useState(`Not Found`);
  const isSentLog = useRef();

  const initializeStation = async () => {
    try {

      // Check localStorage first
      const savedStationId = localStorage.getItem('stationId');
      const savedStationName = localStorage.getItem('stationName');
      const savedTimestamp = localStorage.getItem('stationTimestamp');
      const devices = await getDevices();

      if (savedStationId && savedTimestamp) {
        // Verify station is still valid
        const exists = devices.find(device => device.id === savedStationId);
        if (exists) {
          setStationName(savedStationName);
          // updateLastSeen(savedStationId);
          // onStationReady(savedStationId);
          return;
        }
      }

      const stations = await getStations();

      // Generate device fingerprint
      const fingerprint = await DeviceFingerprintService.generateFingerprint();
      const fingerprintHash = await DeviceFingerprintService.createFingerprintHash(fingerprint);
      const existingDevice = devices.find(device => device.fingerprintHash === fingerprintHash);

      if (existingDevice) {
        const station = stations.find(s => s.id == existingDevice.stationId);
        const localStationName = station.stationPrefix + '00' + station.id;
        setStationName(localStationName);
        localStorage.setItem('stationId', existingDevice.id);
        localStorage.setItem('stationName', localStationName);
        localStorage.setItem('stationTimestamp', new Date().toISOString());
        localStorage.setItem('fingerprintHash', JSON.stringify(fingerprintHash));
        return;
      }

      //not found => register a new station
      const newStation = await registerDevice({
        fingerprintHash: fingerprintHash,
        department: department,
        location: location,
        browserUserAgent: navigator.userAgent,
        screenResolution: DeviceFingerprintService.getScreenResolution(),
        timezone: DeviceFingerprintService.getTimezone(),
        accessCount: 1
      });

      const station = stations.find(s => s.id == newStation.stationId);
      const localStationName = station.stationPrefix + '00' + station.id;
      setStationName(localStationName);

      // Store in localStorage for quick access
      localStorage.setItem('stationId', newStation.id);
      localStorage.setItem('stationName', localStationName);
      localStorage.setItem('stationTimestamp', new Date().toISOString());
      localStorage.setItem('deviceFingerprint', JSON.stringify(fingerprintHash));

    } catch (err) {
      console.error('Station initialization error:', err);
      setError(err.response?.data?.error || 'Failed to initialize station');
    } finally {

    }
  };

  const getUser = async (email) => {
    try {
      const response = await fetch(`${getUserByEmail}${email}`, { headers: headers });
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();
      setAppUser(users[0]);
      console.log('User fetched:', users[0]);
      if (!isSentLog.current) {
        const log = await createSystemAuthLog(users[0].id, users[0].username, `login`, `success`, `none`);
        await addSystemAuthLog(log);
        isSentLog.current = true;
      }
      return users[0];
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!isSentLog.current) {
        const log = await createSystemAuthLog(users[0].id, users[0].username, `login`, `failure`, error);
        await addSystemAuthLog(log);
        isSentLog.current = true;
      }
    } finally {

    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (appUser) return;
      console.log(`calling initialize ...`);
      await initializeStation();
      if (!appUser && import.meta.env.VITE_DEV) {
        console.log(`user context: get user from local dev user ${import.meta.env.VITE_DEV}`);
        await getUser(import.meta.env.VITE_DEV);
      } else if (user && !appUser) {
        console.log(`user context: get user from okta user ${user?.email}`);
        await getUser(user.email);
      }
    }
    initialize();
  }, []);

  const value = {
    user,
    appUser,
    isAuthenticated,
    isLoading,
    stationName,
    login: () => loginWithRedirect(),
    logout: () =>
      logout({ logoutParams: { returnTo: window.location.origin } }),
    getAccessTokenSilently
  };



  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
