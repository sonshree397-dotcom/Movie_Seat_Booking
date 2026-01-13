/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { USERS_KEY, LOGIN_KEY, USERNAME_KEY } from "../../constants/authConstants";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (localStorage.getItem(LOGIN_KEY) === "true") {
      setTimeout(() => {
        setIsLoggedIn(true);
        setUsername(localStorage.getItem(USERNAME_KEY));
      }, 0);
    }
  }, []);

  const register = (u, p) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    if (users.some(x => x.username === u)) {
      toast.error("Username already exists");
      return false;
    }
    users.push({ username: u, password: p });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    toast.success("Registration successful");
    return true;
  };

  const login = (u, p) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(x => x.username === u && x.password === p);
    if (!user) {
      toast.error("Invalid credentials");
      return false;
    }
    localStorage.setItem(LOGIN_KEY, "true");
    localStorage.setItem(USERNAME_KEY, u);
    setTimeout(() => {
      setIsLoggedIn(true);
      setUsername(u);
    }, 0);
    toast.success("Login successful");
    return true;
  };

  const logout = () => {
    localStorage.removeItem(LOGIN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setTimeout(() => {
      setIsLoggedIn(false);
      setUsername("");
    }, 0);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default function AuthProviderWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
