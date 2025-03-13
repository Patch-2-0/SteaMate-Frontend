import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token); // 토큰이 존재하면 로그인 상태 유지

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    console.log("✅ AuthContext에서 불러온 토큰:", storedToken); // 디버깅용 로그
    setToken(storedToken);
    setIsLoggedIn(!!storedToken);
  }, []);

  const login = (newToken) => {
    console.log("🚀 로그인: 토큰 저장 중...", newToken);
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("🚨 로그아웃: 토큰 삭제");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
