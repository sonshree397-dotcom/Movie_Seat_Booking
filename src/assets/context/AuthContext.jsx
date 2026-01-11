import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

const LOCAL_USERS_KEY = "users"; // all registered users stored here
const LOCAL_LOGIN_KEY = "isLoggedIn";
const LOCAL_USERNAME_KEY = "username";

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem(LOCAL_LOGIN_KEY);
    const storedUsername = localStorage.getItem(LOCAL_USERNAME_KEY);
    if (loggedIn === "true" && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const register = (newUsername, newPassword) => {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
    const exists = users.some((u) => u.username === newUsername);
    if (exists) {
      toast.error("Username already exists!");
      return false;
    }
    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    toast.success("Registration successful! You can now login.");
    return true;
  };

  const login = (inputUsername, inputPassword) => {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
    const user = users.find(
      (u) => u.username === inputUsername && u.password === inputPassword
    );
    if (user) {
      localStorage.setItem(LOCAL_LOGIN_KEY, "true");
      localStorage.setItem(LOCAL_USERNAME_KEY, user.username);
      setIsLoggedIn(true);
      setUsername(user.username);
      toast.success("Login successful 🎉");
      return true;
    } else {
      toast.error("Invalid username or password");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_LOGIN_KEY);
    localStorage.removeItem(LOCAL_USERNAME_KEY);
    setIsLoggedIn(false);
    setUsername("");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
