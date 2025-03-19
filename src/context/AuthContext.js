import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  // ✅ localStorage 변경을 감지하여 상태 자동 업데이트
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("access_token");
      const storedUserId = localStorage.getItem("user_id");

      setToken(storedToken);
      setUserId(storedUserId);
      setIsLoggedIn(!!storedToken); // token이 없으면 false 설정
    };

    // ✅ 다른 탭에서 로그인/로그아웃이 발생하면 반영
    window.addEventListener("storage", checkToken);
    window.addEventListener("focus", checkToken); // ✅ 현재 탭이 다시 활성화될 때도 체크
    checkToken(); // ✅ 최초 마운트 시 상태 확인

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("focus", checkToken); // ✅ 메모리 누수 방지
    };
  }, []);

  // ✅ 로그인 시 localStorage와 상태 업데이트
  const login = (newToken, newUserId) => {
    if (!newToken || !newUserId) {
      console.error("로그인 실패: 올바른 토큰 또는 userId가 없음.");
      return;
    }

    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_id", newUserId);

    setToken(newToken);
    setUserId(newUserId);
    setIsLoggedIn(true);
  };

  // ✅ 로그아웃 시 localStorage와 상태 초기화
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
