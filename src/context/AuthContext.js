import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // 토큰이 존재하면 로그인 상태 유지

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUserId = localStorage.getItem("user_id");
    console.log("✅ AuthContext에서 불러온 토큰:", storedToken);
    console.log("✅ AuthContext에서 불러온 userId:", storedUserId);
    setToken(storedToken);
    setUserId(storedUserId);
    setIsLoggedIn(!!storedToken);
  }, []);

  const login = (newToken, newUserId) => {
    console.log("🚀 로그인: 토큰 저장 중...", newToken);
    console.log("🚀 로그인: userId 저장 중...", newUserId);
    localStorage.setItem("access_token", newToken);
    if (newUserId) {
      localStorage.setItem("user_id", newUserId);
      setUserId(newUserId);
    }
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("🚨 로그아웃: 토큰 삭제");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    setToken(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ token, userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
