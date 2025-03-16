import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // ✅ localStorage 변경을 감지하여 상태 자동 업데이트
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUserId = localStorage.getItem("user_id");
  
      setToken(storedToken);
      setUserId(storedUserId);
      setIsLoggedIn(!!storedToken);
    };
  
    // 로컬스토리지 변경 즉시 반영 (현재 탭에서도 동작)
    window.addEventListener("storage", checkToken);
    window.addEventListener("focus", checkToken);  // ✅ 현재 탭 활성화 시에도 체크
    checkToken(); // 최초 마운트 시 상태 체크
  
    return () => {
      window.removeEventListener("storage", checkToken);
    };  
  }, []);

  const login = (newToken, newUserId) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_id", newUserId);
    
    setToken(newToken);
    setUserId(newUserId);
    setIsLoggedIn(true);
  };

  const logout = () => {
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
