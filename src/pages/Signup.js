import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL

const Signup = () => {
  const [customEmail, setCustomEmail] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // 각 필드별 오류 메시지를 관리하는 상태
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
    confirm_password: "",
    nickname: "",
    email: "",
    customDomain: "",
    birth: "",
  });
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 유효성 검사 함수
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "username":
        if (value.length === 0) {
          error = "아이디를 입력해주세요.";
        } else if (value.length < 5 || value.length > 20) {
          error = "아이디는 5~20자 사이여야 합니다.";
        }
        break;
      case "password":
        if (value.length === 0) {
          error = "비밀번호를 입력해주세요.";
        } else if (value.length < 8) {
          error = "비밀번호는 최소 8자 이상이어야 합니다.";
        }
        break;
      case "confirm_password":
        if (value !== formData.password) {
          error = "비밀번호가 일치하지 않습니다.";
        }
        break;
      case "nickname":
        if (value.length === 0) {
          error = "닉네임을 입력해주세요.";
        }
        break;
      case "email":
        if (value.length === 0) {
          error = "이메일을 입력해주세요.";
        }
        break;
      case "customDomain":
        if (value.length === 0) {
          error = "도메인을 입력해주세요.";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

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
    
    // 입력값 변경 시 해당 필드의 유효성 검사 실행
    const errorMessage = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    // 비밀번호 변경 시 비밀번호 확인 필드도 검증
    if (name === "password") {
      const confirmError = formData.confirm_password 
        ? (value !== formData.confirm_password ? "비밀번호가 일치하지 않습니다." : "") 
        : "";
      setFieldErrors((prev) => ({
        ...prev,
        confirm_password: confirmError,
      }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    let errors = {};
    
    // 각 필드 유효성 검사
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "gender") {
        const error = validateField(key, value);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    });
    
    // 생년월일 유효성 검사
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      errors.birth = "생년월일을 완전히 선택해주세요.";
      isValid = false;
    }
    
    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // 폼 전체 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    // 이메일 조합 (직접 입력 여부 확인)
    let finalEmail;
    if (customEmail) {
      if (!formData.customDomain.trim()) {
        setFieldErrors((prev) => ({
          ...prev,
          customDomain: "도메인을 입력해주세요."
        }));
        setLoading(false);
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

      // 성공 메시지와 이메일 인증 안내
      alert("회원가입이 완료되었습니다. 이메일로 전송된 인증 링크를 클릭하여 계정 인증을 완료해주세요.");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        // 서버에서 반환된 필드별 오류 처리
        const responseData = error.response.data;
        const newFieldErrors = { ...fieldErrors };
        
        // 서버에서 반환된 필드별 오류 메시지 설정
        if (typeof responseData === 'object') {
          Object.entries(responseData).forEach(([key, value]) => {
            let errorMessage = "";
            if (Array.isArray(value)) {
              errorMessage = value[0];
            } else if (typeof value === 'string') {
              errorMessage = value;
            }
            
            // 영어 에러 메시지를 한글로 변환
            if (errorMessage.includes("A user with that username already exists")) {
              errorMessage = "이미 사용 중인 아이디입니다.";
            } else if (errorMessage.includes("This password is too common")) {
              errorMessage = "너무 흔한 비밀번호입니다.";
            } else if (errorMessage.includes("This password is too short")) {
              errorMessage = "비밀번호가 너무 짧습니다.";
            } else if (errorMessage.includes("This password is entirely numeric")) {
              errorMessage = "비밀번호는 숫자로만 구성될 수 없습니다.";
            } else if (errorMessage.includes("Enter a valid email address")) {
              errorMessage = "유효한 이메일 주소를 입력하세요.";
            } else if (errorMessage.includes("The password is too similar to the")) {
              errorMessage = "비밀번호가 개인정보와 너무 유사합니다.";
            } else if (errorMessage.includes("The two password fields")) {
              errorMessage = "비밀번호가 일치하지 않습니다.";
            } else if (errorMessage.includes("This field is required")) {
              errorMessage = "필수 입력 항목입니다.";
            } else if (errorMessage.includes("User with this Email already exists")) {
              errorMessage = "이미 사용 중인 이메일 주소입니다.";
            } else if (errorMessage.includes("User with this Nickname already exists") || errorMessage.includes("user with this nickname already exists")) {
              errorMessage = "이미 사용 중인 닉네임입니다.";
            }
            
            newFieldErrors[key] = errorMessage;
          });
        } else {
          setError(error.response.data.error || "회원가입 실패");
        }
        
        setFieldErrors(newFieldErrors);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[550px]">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">회원가입</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 font-medium">아이디</label>
          <input
            type="text"
            name="username"
            placeholder="아이디 입력(5~20자)"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-3 border ${fieldErrors.username ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900`}
          />
          {fieldErrors.username && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
          )}

          <label className="block text-gray-700 font-medium mt-4">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border ${fieldErrors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900`}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}

          <label className="block text-gray-700 font-medium mt-4">비밀번호 확인</label>
          <input
            type="password"
            name="confirm_password"
            placeholder="비밀번호 재입력"
            value={formData.confirm_password}
            onChange={handleChange}
            className={`w-full p-3 border ${fieldErrors.confirm_password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900`}
          />
          {fieldErrors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.confirm_password}</p>
          )}

          <label className="block text-gray-700 font-medium mt-4">닉네임</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해주세요"
            value={formData.nickname}
            onChange={handleChange}
            className={`w-full p-3 border ${fieldErrors.nickname ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900`}
          />
          {fieldErrors.nickname && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.nickname}</p>
          )}

          <label className="block text-gray-700 font-medium mt-4">이메일</label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              className={`w-1/2 p-3 border ${fieldErrors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900`}
            />
            <span className="flex items-center">@</span>
            <input
              type="text"
              name="customDomain"
              value={formData.customDomain}
              onChange={handleChange}
              className={`w-1/4 p-3 border ${fieldErrors.customDomain ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900`}
            />
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value !== "direct") {
                  setFormData(prev => ({
                    ...prev,
                    customDomain: value
                  }));
                  // 도메인 선택 시 에러 제거
                  setFieldErrors(prev => ({
                    ...prev,
                    customDomain: ""
                  }));
                } else {
                  setFormData(prev => ({
                    ...prev,
                    customDomain: ""
                  }));
                }
              }}
              className="w-1/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="direct">직접입력</option>
            </select>
          </div>
          {(fieldErrors.email || fieldErrors.customDomain) && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.email || fieldErrors.customDomain}
            </p>
          )}

          <label className="block text-gray-700 font-medium mt-4">생년월일</label>
          <div className="flex space-x-2">
            <select 
              name="birthYear" 
              onChange={handleChange} 
              className={`w-1/3 p-3 border ${fieldErrors.birth ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-blue-900`}
            >
              <option value="">년도</option>
              {Array.from({ length: 50 }, (_, i) => (
                <option key={i} value={1975 + i}>{1975 + i}</option>
              ))}
            </select>
            <select 
              name="birthMonth" 
              onChange={handleChange} 
              className={`w-1/3 p-3 border ${fieldErrors.birth ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-blue-900`}
            >
              <option value="">월</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select 
              name="birthDay" 
              onChange={handleChange} 
              className={`w-1/3 p-3 border ${fieldErrors.birth ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-blue-900`}
            >
              <option value="">일</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          {fieldErrors.birth && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.birth}</p>
          )}

          <label className="block text-gray-700 font-medium mt-4">성별</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-md">
            <option value="1">남성</option>
            <option value="2">여성</option>
            <option value="3">비공개</option>
          </select>

          <button 
            type="submit" 
            className={`w-full mt-6 py-3 text-white font-bold rounded-md ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-900"
            }`}
            disabled={loading}
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
