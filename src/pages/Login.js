import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // AuthContext 사용

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/account/login/`, {
        username,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
  
      console.log("📌 로그인 응답 데이터:", data);  // ← 디버깅용 로그 추가
  
      if (data.access && data.refresh) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        console.log("✅ JWT 토큰 저장 완료!");
  
        login(data.access);  // 로그인 함수 호출
        navigate("/");       // 홈으로 이동
      } else {
        throw new Error("JWT 토큰이 응답에 없습니다.");
      }
    } catch (err) {
      console.error("🚨 로그인 실패:", err.response?.data || err);
      setError(err.response?.data?.detail || "로그인 실패. 아이디와 비밀번호를 확인하세요.");
    }
  };

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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* 회원가입 */}
        <p className="text-gray-300 text-right text-sm mb-4">
          <Link to="/signup" className="text-gray-300 hover:undefined">
            회원가입하러 가기
          </Link>
        </p>

        {/* 로그인 버튼 */}
        <button
          className="w-full p-3 text-black font-bold bg-yellow-400 rounded-md hover:bg-yellow-500"
          onClick={handleLogin}
        >
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
