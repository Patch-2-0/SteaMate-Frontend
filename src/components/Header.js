import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(isLoggedIn);

  // ✅ isLoggedIn이 변경될 때마다 UI 업데이트
  useEffect(() => {
    setIsAuth(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
  
    if (!accessToken || !refreshToken) {
      console.error("🚨 로그아웃 실패: JWT 토큰이 없습니다.");
      return;
    }
  
    try {
      await axios.post(
        `${BASE_URL}/account/logout/`,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      logout();
      navigate("/");
    } catch (err) {
      console.error("🚨 로그아웃 실패:", err.response?.data || err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-sky-300 p-4 flex justify-between items-center shadow-md z-50">
      <Link to="/" className="text-2xl font-bold tracking-wide text-black">
        SteaMate
      </Link>

      <div className="hidden md:flex space-x-4">
        <Link to="/chatmate" className="button-style">ChatMate</Link>
        <Link to="/pickmate" className="button-style">PickMate</Link>
      </div>

      <div className="flex space-x-4">
        {isAuth ? (
          <>
            <Link to="/mypage" className="button-style">마이페이지</Link>
            <button onClick={handleLogout} className="button-highlight">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="button-style">로그인</Link>
            <Link to="/signup" className="button-highlight">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
