import { useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

const SteamCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const fetchSteamCallback = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await axios.get(
          `${BASE_URL}/account/steam-callback${location.search}`,
          { withCredentials: true }
        );

        const { steam_id, new_user } = response.data;

        if (steam_id) {
          if (new_user) {
            navigate(`/steamsignup?steamid=${steam_id}`, { replace: true });
          } else {
            const tokenResponse = await axios.post(
                `${BASE_URL}/account/steamidlogin/`,
                { steam_id },
                { headers: { "Content-Type": "application/json" } }
              );
              
              // 🚨 응답 데이터 실제로 찍어 확인
              console.log("🚀 tokenResponse.data:", tokenResponse.data);
              
              const { access, refresh, user_id } = tokenResponse.data;
              
              if (access && refresh && user_id) {
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);
                localStorage.setItem("user_id", user_id);
              
                login(access, user_id);
                navigate("/", { replace: true });
              } else {
                throw new Error("Steam 로그인 토큰 없음");
              }
          }              
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Steam 로그인 처리 중 오류:", err);
        navigate("/login", { replace: true });
      }
    };

    fetchSteamCallback();
  }, [navigate, location, login]);

  return <div className="text-center text-gray-700">Steam 로그인 처리 중...</div>;
};

export default SteamCallback;