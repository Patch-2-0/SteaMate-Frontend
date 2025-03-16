import React, { useState, useContext, useEffect } from "react";
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
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      if (data.access && data.refresh) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        login(data.access, data.user_id);
        navigate("/"); // 홈으로 이동
      } else {
        throw new Error("JWT 토큰이 응답에 없습니다.");
      }
    } catch (err) {
      console.error("🚨 로그인 실패:", err.response?.data || err);
      setError(err.response?.data?.detail || "로그인 실패. 아이디와 비밀번호를 확인하세요.");
    }
  };

  const handleSteamLogin = async () => {
    try {
      const accessToken = localStorage.getItem("access_token"); // ✅ JWT 토큰 가져오기
  
      const headers = {
        "Content-Type": "application/json",
      };
  
      // ✅ 로그인된 사용자는 Authorization 헤더 포함
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
  
      const response = await axios.get(`${BASE_URL}/account/steamlogin/`, {
        headers: headers, // ✅ JWT 포함된 헤더 추가
      });
  
      const { steam_login_url } = response.data;
  
      if (steam_login_url) {
        console.log("🚀 Steam 로그인 URL:", steam_login_url);
        window.location.href = steam_login_url; // Steam 로그인 페이지로 이동
      } else {
        throw new Error("Steam 로그인 URL이 응답에 없습니다.");
      }
    } catch (err) {
      console.error("🚨 Steam 로그인 실패:", err.response?.data || err);
    }
  };

  // ✅ Steam Callback 처리 (로그인 상태 업데이트)
  const handleSteamCallback = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const steamId = params.get("steamid"); // ✅ Steam 로그인 후 받은 steamid 가져오기

      if (!steamId) {
        throw new Error("Steam ID를 찾을 수 없습니다.");
      }

      // ✅ Steam ID를 사용하여 JWT 토큰 요청
      const response = await axios.post(`${BASE_URL}/account/steamlogin/`, { steam_id: steamId });

      const { access, refresh, user_id } = response.data;

      if (access && refresh) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        // ✅ AuthContext의 로그인 함수 호출 (우측 상단 UI 변경)
        login(access, user_id);

        console.log("✅ Steam 로그인 완료, JWT 저장됨");
        navigate("/"); // 홈으로 이동
      } else {
        throw new Error("JWT 토큰이 응답에 없습니다.");
      }
    } catch (err) {
      console.error("🚨 Steam 로그인 처리 실패:", err.response?.data || err);
      navigate("/login"); // 로그인 실패 시 로그인 페이지로 이동
    }
  };

  // ✅ Steam Callback 페이지에서 자동 실행
  useEffect(() => {
    if (window.location.pathname === "/steam-callback") {
      handleSteamCallback();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Welcome !
        </h2>

        <input
          type="text"
          placeholder="아이디"
          className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <p className="text-gray-300 text-right text-sm mb-4">
          <Link to="/signup" className="text-gray-300 hover:undefined">
            회원가입하러 가기
          </Link>
        </p>

        <button
          className="w-full p-3 text-black font-bold bg-yellow-400 rounded-md hover:bg-yellow-500"
          onClick={handleLogin}
        >
          로그인
        </button>

        {/* Steam 로그인 버튼 */}
        <button
          className="w-full p-3 mt-3 text-white font-bold bg-gray-700 rounded-md hover:bg-gray-800 flex items-center justify-center"
          onClick={handleSteamLogin}
        >
          <img src="/steam-logo.png" alt="Steam Logo" className="w-6 h-6 mr-2" />
          Steam으로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Login;
