import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
