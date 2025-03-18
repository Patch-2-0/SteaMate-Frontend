import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8">
      {/* 타이틀 */}
      <h1 className="text-4xl font-bold text-neonBlue mb-8 font-pixel">
        Welcome to SteaMate
      </h1>

      {/* 게임 선택 UI */}
      <div className="flex justify-center gap-8 w-full max-w-6xl">
        <div className="card-pixel flex flex-col items-center">
          <img 
            src="/images/chatmate-placeholder.png" 
            alt="ChatMate Placeholder" 
            className="w-3/4 aspect-square object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold text-neonBlue font-pixel">ChatMate</h2>
          <p className="text-gray-300 mt-2">챗봇과의 대화를 통해 원하는 게임을 추천하는 서비스</p>
        </div>
        <div className="card-pixel flex flex-col items-center">
          <img 
            src="/images/pickmate-placeholder.png" 
            alt="PickMate Placeholder" 
            className="w-3/4 aspect-square object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold text-neonPurple font-pixel">PickMate</h2>
          <p className="text-gray-300 mt-2">머신러닝 기반의 게임 추천 서비스</p>
        </div>
      </div>
    </div>
  );
};

export default Home;