import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400 && data.error === "Invalid or expired token.") {
          console.warn("🚨 로그아웃 실패: 토큰이 유효하지 않거나 만료됨.");
        } else {
          console.error("🚨 로그아웃 실패:", data.error || "알 수 없는 오류.");
        }
      } else {
        console.error("🚨 네트워크 오류 또는 서버 응답 없음.");
      }
    }
  };
  

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-sky-300 p-4 flex justify-between items-center shadow-md z-50">
      {/* 로고 */}
      <Link to="/" className="text-2xl font-bold tracking-wide text-black">
        SteaMate
      </Link>

      {/* 네비게이션 메뉴 */}
      <div className="hidden md:flex space-x-4">
        <Link to="/chatmate" className="button-style">ChatMate</Link>
        <Link to="/pickmate" className="button-style">PickMate</Link>
      </div>

      {/* 로그인 여부에 따른 버튼 표시 */}
      <div className="flex space-x-4">
        {isLoggedIn ? (
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
