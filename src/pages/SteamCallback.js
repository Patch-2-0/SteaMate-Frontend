import { useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL;

const SteamCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetched = useRef(false);
  const { login, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchSteamCallback = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await axios.get(
          `${BASE_URL}/account/steam-callback${location.search}`,
          { 
            withCredentials: false  // true에서 false로 변경
          }
        );

        const { steam_id, new_user } = response.data;
        const returnToMyPage = sessionStorage.getItem('returnToMyPage');

        // 마이페이지에서 온 연동 요청 처리
        if (returnToMyPage === 'true' && steam_id) {
          sessionStorage.removeItem('returnToMyPage'); // 상태 초기화
          
          try {
            const linkResponse = await axios.post(
              `${BASE_URL}/account/steamlink/`,
              { steam_id },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              }
            );
            
            if (linkResponse.status === 201) {
              alert('스팀 계정이 성공적으로 연동되었습니다!');
              navigate('/mypage', { replace: true });
              return;
            }
          } catch (error) {
            alert(error.response?.data?.error || '스팀 계정 연동에 실패했습니다.');
            navigate('/mypage', { replace: true });
            return;
          }
        }

        // 일반 스팀 로그인/회원가입 처리
        if (steam_id) {
          if (new_user) {
            navigate(`/steamsignup?steamid=${steam_id}`, { replace: true });
          } else {
            const tokenResponse = await axios.post(
              `${BASE_URL}/account/steamidlogin/`,
              { steam_id },
              { headers: { "Content-Type": "application/json" } }
            );
              
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
        navigate("/login", { replace: true });
      }
    };

    fetchSteamCallback();
  }, [navigate, location, login, token]);

  return <div className="text-center text-gray-700">Steam 로그인 처리 중...</div>;
};

export default SteamCallback;