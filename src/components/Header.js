import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(isLoggedIn);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ 햄버거 메뉴 상태 추가

  // ✅ isLoggedIn이 변경될 때마다 UI 업데이트
  useEffect(() => {
    setIsAuth(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
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
    }
  };

  const handlePickMateClick = (e) => {
    e.preventDefault();
    alert("PickMate 서비스는 현재 준비중입니다.");
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-transparent text-white px-6 flex justify-between items-center z-50">

      {/* 로고 (왼쪽) */}
      <Link to="/" className="text-3xl font-bold font-pixel tracking-tight">
        SteaMate
      </Link>


      {/* 햄버거 버튼 (모바일 전용) */}
      <button 
        className="md:hidden text-white text-3xl focus:outline-none" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* 중앙 메뉴 (화면이 클 때만 보이기) */}
      <div className="hidden md:flex space-x-6 font-semibold">
        <Link to="/chatmate" className="button-pixel">ChatMate</Link>
        <Link to="#" onClick={handlePickMateClick} className="button-pixel">PickMate</Link>
      </div>

      <div className="flex space-x-4">
        {isAuth ? (
          <>
            <Link to="/mypage" className="button-pixel">Mypage</Link>
            <button onClick={handleLogout} className="button-pixel">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="button-pixel">Login</Link>
            <Link to="/signup" className="button-pixel">Signup</Link>
          </>
        )}
      </div>

      {/* 모바일 메뉴 (햄버거 버튼을 눌렀을 때 나타남) */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-[#1b1b3a] text-white flex flex-col items-center py-4 space-y-4 md:hidden">
          <Link to="/chatmate" className="button-pixel w-3/4 text-center" onClick={() => setMenuOpen(false)}>ChatMate</Link>
          <Link to="#" className="button-pixel w-3/4 text-center" onClick={(e) => {
            setMenuOpen(false);
            handlePickMateClick(e);
          }}>PickMate</Link>
          {isAuth ? (
            <>
              <Link to="/mypage" className="button-pixel w-3/4 text-center" onClick={() => setMenuOpen(false)}>마이페이지</Link>
              <button onClick={handleLogout} className="button-pixel w-3/4">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button-pixel w-3/4 text-center" onClick={() => setMenuOpen(false)}>로그인</Link>
              <Link to="/signup" className="button-pixel w-3/4 text-center" onClick={() => setMenuOpen(false)}>회원가입</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
