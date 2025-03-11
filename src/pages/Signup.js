import React, { useState } from "react";

const Signup = () => {
  const [customEmail, setCustomEmail] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* 회원가입 컨테이너 */}
      <div className="bg-white p-10 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.2)] w-[550px]">
        {/* 제목 */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">회원가입</h2>

        {/* 아이디 입력 */}
        <label className="block text-gray-700 font-medium">아이디</label>
        <input
          type="text"
          placeholder="아이디 입력(5~20자)"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 비밀번호 입력 */}
        <label className="block text-gray-700 font-medium mt-4">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호 입력"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 비밀번호 확인 */}
        <label className="block text-gray-700 font-medium mt-4">비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 재입력"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 닉네임 입력 */}
        <label className="block text-gray-700 font-medium mt-4">닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 이메일 입력 */}
        <label className="block text-gray-700 font-medium mt-4">이메일 주소</label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="이메일 주소"
            className="w-2/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="px-2 flex items-center">@</span>
          <select
            className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setCustomEmail(e.target.value === "custom")}
          >
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
            <option value="custom">직접 입력</option>
          </select>
        </div>

        {/* 직접 입력 */}
        {customEmail && (
          <input
            type="text"
            placeholder="도메인 직접 입력"
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* 생년월일 */}
        <label className="block text-gray-700 font-medium mt-4">생년월일</label>
        <div className="flex space-x-2">
          <select className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>년도</option>
            {Array.from({ length: 50 }, (_, i) => (
              <option key={i}>{1975 + i}</option>
            ))}
          </select>
          <select className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>월</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
          <select className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>일</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* 성별 입력 */}
        <label className="block text-gray-700 font-medium mt-4">성별</label>
        <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>남성</option>
          <option>여성</option>
          <option>비공개</option>
        </select>

        {/* 가입하기 버튼 (긴 버튼) */}
        <button className="w-full mt-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
          가입하기
        </button>
      </div>
    </div>
  );
};

export default Signup;
