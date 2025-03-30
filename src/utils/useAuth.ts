import { useState, useEffect } from "react";
import {  getUser, isAuthenticated } from "./auth"; // Import auth utils

export const useAuth = () => {
  const [user, setUser] = useState(getUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setUser(getUser());
      setAuthenticated(isAuthenticated());
    };

    checkAuth();
  }, []);

  return { user, isAuthenticated: authenticated };
};
