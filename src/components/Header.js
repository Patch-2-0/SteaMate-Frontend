import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-sky-300 p-4 flex justify-between items-center">
      {/* 로고 */}
      <Link to="/" className="text-2xl font-bold tracking-wide text-black">
        SteaMate
      </Link>

      {/* 네비게이션 메뉴 */}
      <div className="hidden md:flex space-x-4">
        <Link to="/chatmate" className="button-style">ChatMate</Link>
        <Link to="/pickmate" className="button-style">PickMate</Link>
      </div>

      {/* 로그인 / 회원가입 버튼 */}
      <div className="flex space-x-4">
        <Link to="/login" className="button-style">로그인</Link>
        <Link to="/signup" className="button-highlight">회원가입</Link>
      </div>
    </nav>
  );
};

export default Header;
