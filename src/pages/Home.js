import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); 

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full px-8 py-12 flex-1 gap-4">
      {/* 타이틀 */}
      <h1 className="text-4xl font-bold text-neonBlue mb-8 font-pixel">
        Welcome to SteaMate
      </h1>
  
      {/* 서비스 선택 UI */}
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {/* ChatMate 카드 */}
        <div
          className="card-pixel flex flex-col items-center w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate("/chatmate")} // ✅ 클릭 시 링크 이동
        >
          <img 
            src="/images/chatmate-placeholder.gif" 
            alt="ChatMate Placeholder" 
            className="w-full aspect-square object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold text-neonBlue font-pixel">ChatMate</h2>
          <p className="text-gray-300 mt-2 text-center">
            챗봇과의 대화를 통해<br />
            원하는 게임을 추천하는 서비스
          </p>
        </div>
  
        {/* PickMate 카드 */}
        <div
          className="card-pixel flex flex-col items-center w-1/2 md:w-1/3 lg:w-1/4 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate("/pickmate")} // ✅ 클릭 시 링크 이동
        >
          <img 
            src="/images/pickmate-placeholder.gif" 
            alt="PickMate Placeholder" 
            className="w-full aspect-square object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold text-neonPurple font-pixel">PickMate</h2>
          <p className="text-gray-300 mt-2 text-center">
            머신러닝 기반의<br />
            사용자 맞춤형 게임 추천 서비스
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;