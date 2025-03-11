import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* 로그인 컨테이너 */}
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-96">
        {/* 제목 */}
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Welcome !
        </h2>

        {/* 아이디 입력 */}
        <input
          type="text"
          placeholder="아이디"
          className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* 회원가입 */}
        <p className="text-gray-300 text-right text-sm mb-4">
          <Link to="/signup" className="text-gray-300 hover:undefined">
            회원가입하러 가기
          </Link>
        </p>

        {/* 로그인 버튼 */}
        <button className="w-full p-3 text-black font-bold bg-yellow-400 rounded-md hover:bg-yellow-500">
          로그인
        </button>

        {/* Steam 로그인 버튼 */}
        <button className="w-full p-3 mt-3 text-white font-bold bg-gray-700 rounded-md hover:bg-gray-800 flex items-center justify-center">
          <img src="/steam-logo.png" alt="Steam Logo" className="w-6 h-6 mr-2" /> 
          Steam으로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;
