import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Link를 추가하여 페이지 이동 관리

const BASE_URL = process.env.REACT_APP_API_URL;

const PickMate = () => {
  const [gamesList, setGamesList] = useState([]);
  const [error, setError] = useState(null);

  // 로컬 스토리지에서 JWT 토큰 가져오기
  const token = localStorage.getItem("access_token");

  // 추천 게임 목록 API 호출
  const fetchRecommendations = async () => {
    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/pick/recommend`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.recommendations) {
        setGamesList(response.data.recommendations);
      } else {
        setError("추천 데이터를 가져올 수 없습니다.");
      }
    } catch (err) {
      setError("추천 게임 목록을 가져오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchRecommendations(); // 컴포넌트가 마운트될 때 API 호출
  }, [token]); // 토큰이 변경될 때마다 호출

  // 포스터 이미지 URL을 앱 ID에 맞게 생성하는 함수
  const generateImageUrl = (appid) => {
    return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`;
  };

  // 장르를 태그 형식으로 변환하는 함수
  const renderGenresAsTags = (genres) => {
    const genresArray = genres.split(","); // 쉼표를 기준으로 장르를 분리
    return (
      <div className="flex flex-wrap gap-3 mt-4">
        {genresArray.map((genre, index) => (
          <span
            key={index}
            className="bg-blue-950 text-white text-xs px-3 py-1 rounded-md"
          >
            {genre.trim()} {/* 장르 이름에서 공백을 제거하고 표시 */}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 상단에 설명 카드 추가 */}
      <div className="bg-gray-200 text-black p-6 rounded-lg shadow-lg mb-8 flex items-center">
        <img
          src="/images/pickmate-placeholder.gif"  // 좌측에 이미지를 추가
          alt="PickMate"
          className="w-20 h-20 mr-6"  // 이미지 크기 및 우측 텍스트와의 여백
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">PickMate는 사용자의 게임 데이터를 기반으로 한 추천 시스템입니다.</h2>
          <p className="text-sm mb-4">
            더 정확한 추천을 받고 싶으시면 <strong>My Page</strong>에서 스팀 연동 혹은 라이브러리 연동을 해주세요!
          </p>
        </div>
        {/* "스팀 계정 혹은 라이브러리 연동하기" 버튼 */}
        <Link to="/mypage">
          <button className="bg-blue-950 text-white py-2 px-6 rounded-lg hover:bg-blue-900">
            스팀 계정 연동 혹은 <br />
            라이브러리 연동하러 가기
          </button>
        </Link>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* 모든 게임을 카드형으로 표시 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
        {gamesList.map((game) => (
          <div key={game.appid} className="bg-gray-700 text-white p-6 rounded-lg shadow-lg">
            {/* 게임 이미지 상단에 배치 */}
            <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noopener noreferrer">
              <div className="relative w-full mb-6"> {/* 이미지와 제목 사이에 마진 추가 */}
                <div style={{ paddingTop: "46.5%" }} className="relative w-full">
                  <img
                    src={generateImageUrl(game.appid)}
                    alt={game.name}
                    className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-left">{game.name}</h4> {/* 제목과 장르 사이의 공백 추가 */}
            </a>
            
            {/* 장르 태그 카드 하단에 가로로 나열 */}
            {renderGenresAsTags(game.genres)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickMate;
