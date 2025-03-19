import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PickMate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 로드 시 알림 표시 후 홈으로 리다이렉트
    alert("PickMate 서비스는 현재 준비중입니다!");
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-blue-950 to-indigo-900 text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">🎮 PickMate 서비스 준비중 🎮</h1>
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-xl">
          <p className="text-xl mb-4">
            스팀 게임 매칭 서비스 PickMate는 현재 개발 중입니다.
          </p>
          <p className="text-lg mb-8">
            곧 여러분의 게임 경험에 맞는 게임들을 매칭해 드릴 예정입니다. 
            조금만 기다려주세요!
          </p>
          <div className="animate-pulse flex justify-center">
            <div className="h-2 w-24 bg-blue-400 rounded mx-1"></div>
            <div className="h-2 w-24 bg-blue-400 rounded mx-1"></div>
            <div className="h-2 w-24 bg-blue-400 rounded mx-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickMate;
