import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  // ✅ localStorage 변경 감지 및 자동 동기화
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUserId = localStorage.getItem("user_id");

      setToken(storedToken);
      setUserId(storedUserId);
      setIsLoggedIn(!!storedToken);
    };

    window.addEventListener("storage", checkToken);
    window.addEventListener("focus", checkToken);
    checkToken();

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("focus", checkToken);
    };
  }, []);

  // ✅ 로그인 시 상태 즉시 반영
  const login = (newToken, newUserId) => {
    if (!newToken || !newUserId) {
      return;
    }

    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_id", newUserId);

    setToken(newToken);
    setUserId(newUserId);
    setIsLoggedIn(true);
  };

  // ✅ 로그아웃 시 상태 초기화
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");

    setToken(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  // ✅ 로그인 상태가 변경될 때마다 `useEffect`로 즉시 반영
  useEffect(() => {
    if (isLoggedIn) {
      setToken(localStorage.getItem("access_token"));
      setUserId(localStorage.getItem("user_id"));
    }
  }, [isLoggedIn]); // 로그인 상태 변경 감지

  return (
    <AuthContext.Provider value={{ token, userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
