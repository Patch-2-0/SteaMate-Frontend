import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL

const Signup = () => {
  const [customEmail, setCustomEmail] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm_password: "",
    nickname: "",
    email: "",
    customDomain: "naver.com",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "1",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "customDomain") {
      if (value === "custom") {
        setCustomEmail(true);
        setFormData((prev) => ({
          ...prev,
          customDomain: "", // 직접 입력을 위해 비워두기
        }));
      } else {
        setCustomEmail(false);
        setFormData((prev) => ({
          ...prev,
          customDomain: value, // 선택한 도메인 적용
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 이메일 조합 (직접 입력 여부 확인)
    let finalEmail;
    if (customEmail) {
      if (!formData.customDomain.trim()) {
        setError("도메인을 입력해주세요.");
        return;
      }
      finalEmail = `${formData.email}@${formData.customDomain.trim()}`;
    } else {
      finalEmail = `${formData.email}@${formData.customDomain}`;
    }

    // 생년월일 조합
    const birth = `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`;

    try {
      await axios.post(`${BASE_URL}/account/signup/`, {
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirm_password,
        nickname: formData.nickname,
        email: finalEmail,
        birth: birth,
        gender: formData.gender,
      });

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "회원가입 실패");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[550px]">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">회원가입</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 font-medium">아이디</label>
          <input
            type="text"
            name="username"
            placeholder="아이디 입력(5~20자)"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-700 font-medium mt-4">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-700 font-medium mt-4">비밀번호 확인</label>
          <input
            type="password"
            name="confirm_password"
            placeholder="비밀번호 재입력"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-700 font-medium mt-4">닉네임</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해주세요"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block text-gray-700 font-medium mt-4">이메일 주소</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="px-2 flex items-center">@</span>
            <select
              name="customDomain"
              value={customEmail ? "custom" : formData.customDomain}
              className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>

          {customEmail && (
            <input
              type="text"
              name="customDomain"
              placeholder="도메인 직접 입력"
              value={formData.customDomain}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customDomain: e.target.value, // ✅ 입력한 값이 정상적으로 적용되도록 설정
                }))
              }
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <label className="block text-gray-700 font-medium mt-4">생년월일</label>
          <div className="flex space-x-2">
            <select name="birthYear" onChange={handleChange} className="w-1/3 p-3 border rounded-md">
              <option>년도</option>
              {Array.from({ length: 50 }, (_, i) => (
                <option key={i} value={1975 + i}>{1975 + i}</option>
              ))}
            </select>
            <select name="birthMonth" onChange={handleChange} className="w-1/3 p-3 border rounded-md">
              <option>월</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select name="birthDay" onChange={handleChange} className="w-1/3 p-3 border rounded-md">
              <option>일</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <label className="block text-gray-700 font-medium mt-4">성별</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-md">
            <option value="1">남성</option>
            <option value="2">여성</option>
            <option value="3">비공개</option>
          </select>

          <button type="submit" className="w-full mt-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
