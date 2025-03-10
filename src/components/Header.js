import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* 로고 */}
        <Link to="/" className="text-3xl font-bold tracking-wide text-black">
          TEMHA
        </Link>

        {/* 네비게이션 메뉴 */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <Link to="/chatmate" className="hover:text-gray-600">ChatMate</Link>
          <Link to="/pickmate" className="hover:text-gray-600">PickMate</Link>
        </div>

        {/* 로그인 / 회원가입 */}
        <div className="hidden md:block text-lg font-medium">
          <Link to="/login" className="hover:text-gray-600">로그인</Link> /
          <Link to="/signup" className="hover:text-gray-600 ml-2">회원가입</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;