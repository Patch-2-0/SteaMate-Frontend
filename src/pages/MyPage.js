import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

// BASE_URL 수정
const BASE_URL = "http://127.0.0.1:8000/api/v1";

export default function MyPage() {
  const { token, userId, logout, login } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: "",
  });
  const [error, setError] = useState(null);

  // 디버깅을 위한 콘솔 로그 추가
  console.log("Auth 상태:", { 
    token, 
    userId,
    storedToken: localStorage.getItem("access_token"),
    storedUserId: localStorage.getItem("user_id"),
    BASE_URL
  });

  const fetchUserData = useCallback(async () => {
    try {
      if (!token) {
        setError("토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }

      // userId가 없는 경우 토큰에서 추출 시도
      let currentUserId = userId;
      if (!currentUserId && token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            console.log("토큰 페이로드:", tokenPayload);
            currentUserId = tokenPayload.user_id;
            console.log("토큰에서 추출한 userId:", currentUserId);
            
            // userId를 찾았다면 AuthContext에 저장
            if (currentUserId && login) {
              login(token, currentUserId.toString());
            }
          }
        } catch (e) {
          console.error("토큰에서 userId 추출 실패:", e);
        }
      }

      if (!currentUserId) {
        setError("사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      // API 경로 수정
      const apiUrl = `${BASE_URL}/account/${currentUserId}/`;
      console.log("API 호출 시도:", apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API 응답:", {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("받은 사용자 데이터:", data);
      
      if (!data || typeof data !== 'object') {
        throw new Error("잘못된 응답 데이터 형식");
      }

      setUserData(data);
      setEditForm({
        nickname: data.nickname || '',
      });
    } catch (error) {
      console.error("사용자 데이터 로딩 실패:", error);
      setError(`❌ 사용자 정보를 불러올 수 없습니다: ${error.message}`);
      // 심각한 오류 발생 시 로그아웃
      if (error.message.includes("401") || error.message.includes("403")) {
        logout();
      }
    }
  }, [token, userId, login, logout]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // userId가 없는 경우 토큰에서 추출 시도
      let currentUserId = userId;
      if (!currentUserId && token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            currentUserId = tokenPayload.user_id;
          }
        } catch (e) {
          console.error("토큰에서 userId 추출 실패:", e);
          throw new Error("사용자 ID를 찾을 수 없습니다.");
        }
      }

      if (!currentUserId) {
        throw new Error("사용자 ID를 찾을 수 없습니다.");
      }

      // 수정된 부분: 닉네임만 전송
      const updateData = {
        nickname: editForm.nickname,
      };

      const response = await fetch(`${BASE_URL}/account/${currentUserId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`정보 수정 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
      setIsEditing(false);
      setError(null);
      // 데이터 새로고침
      await fetchUserData();
    } catch (error) {
      console.error("정보 수정 실패:", error);
      setError(`❌ 정보 수정에 실패했습니다: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    console.log("회원탈퇴 함수 실행됨");

    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

    try {
      let currentUserId = userId;
      if (!currentUserId && token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const tokenPayload = JSON.parse(atob(tokenParts[1]));
            currentUserId = tokenPayload.user_id;
          }
        } catch (e) {
          console.error("토큰에서 userId 추출 실패:", e);
          throw new Error("사용자 ID를 찾을 수 없습니다.");
        }
      }

      if (!currentUserId) {
        throw new Error("사용자 ID를 찾을 수 없습니다.");
      }

      const refreshToken = localStorage.getItem("refresh_token");
      console.log("[회원탈퇴] 리프레시 토큰:", refreshToken);

      if (!refreshToken) {
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
      }

      const requestData = {
        refresh: refreshToken  // refresh_token -> refresh로 다시 변경
      };

      console.log("[회원탈퇴] 요청 데이터:", requestData);

      const response = await fetch(`${BASE_URL}/account/${currentUserId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      console.log("[회원탈퇴] 응답 상태:", response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.log("[회원탈퇴] 에러 응답:", responseText);
        
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.detail || errorData.message;
        } catch (e) {
          errorMessage = responseText;
        }
        throw new Error(errorMessage || "회원 탈퇴 처리 중 오류가 발생했습니다.");
      }

      logout();
      window.location.href = '/';
    } catch (error) {
      console.error("[회원탈퇴] 에러 발생:", error);
      setError(`❌ 회원 탈퇴에 실패했습니다: ${error.message}`);
    }
  };

  // 장르 선택 핸들러
  const handleGenreChange = (genre) => {
    setEditForm(prev => ({
      ...prev,
      preferred_genre: prev.preferred_genre.includes(genre)
        ? prev.preferred_genre.filter(g => g !== genre)
        : [...prev.preferred_genre, genre]
    }));
  };

  // 게임 선택 핸들러
  const handleGameChange = (game) => {
    setEditForm(prev => ({
      ...prev,
      preferred_game: prev.preferred_game.includes(game)
        ? prev.preferred_game.filter(g => g !== game)
        : [...prev.preferred_game, game]
    }));
  };

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">로그인이 필요한 페이지입니다.</p>
      </div>
    );
  }

  if (!userData) return <div>로딩중...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">닉네임</label>
                <Input
                  value={editForm.nickname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nickname: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">저장</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">닉네임:</span>{" "}
                    {userData.nickname}
                  </p>
                </div>
              </div>

              {userData.steam_profile && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Steam 정보</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={userData.steam_profile.avatar}
                      alt="Steam Avatar"
                      className="w-16 h-16 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png'; // 기본 이미지로 대체
                      }}
                    />
                    <div>
                      <p>
                        <span className="font-medium">Steam 닉네임:</span>{" "}
                        {userData.steam_profile.personaname}
                      </p>
                      <a
                        href={userData.steam_profile.profileurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Steam 프로필 방문
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {userData.preferred_genre && userData.preferred_genre.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">선호 장르</h2>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferred_genre.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userData.preferred_game && userData.preferred_game.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">선호 게임</h2>
                  <div className="flex flex-wrap gap-2">
                    {userData.preferred_game.map((game, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded"
                      >
                        {game}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsEditing(true)}>정보 수정</Button>
                <Button variant="destructive" onClick={handleDelete}>
                  회원 탈퇴
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
