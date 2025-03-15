import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Steamate</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* ChatMate Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <img 
            src="/images/chatmate-placeholder.png" 
            alt="ChatMate Placeholder" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold">ChatMate</h2>
          <p className="text-gray-600 mt-2">챗봇이 게임을 추천합니다.</p>
        </div>
        
        {/* PickMate Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <img 
            src="/images/pickmate-placeholder.png" 
            alt="PickMate Placeholder" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold">PickMate</h2>
          <p className="text-gray-600 mt-2">내 라이브러리를 참고한 게임 추천 서비스.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
