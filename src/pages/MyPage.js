import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

// BASE_URL 수정
const BASE_URL = process.env.REACT_APP_API_URL;

export default function MyPage() {
  const { token, userId, logout, login } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
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

  // 스팀 라이브러리 동기화 함수 수정
  const syncSteamLibrary = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      // steamlibrary 엔드포인트 사용
      const response = await fetch(`${BASE_URL}/account/steamlibrary/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // 응답이 JSON이 아닌 경우 처리
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('서버 응답 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        
        // Steam 프로필 비공개 에러
        if (errorData.message && errorData.message.includes('공개 설정')) {
          throw new Error('Steam 프로필이 비공개 상태입니다. Steam 프로필 설정에서 "게임 세부 정보"를 공개로 설정해주세요.');
        }
        
        // 기타 에러
        throw new Error(errorData.message || '라이브러리 동기화에 실패했습니다.');
      }

      await fetchUserData(); // 사용자 데이터 새로고침
      // 연동 과정 중 자동 동기화인 경우 alert를 표시하지 않도록 수정
      // 개별적으로 동기화 버튼을 클릭한 경우에만 alert 표시
      const isAutoSync = new URLSearchParams(window.location.search).get('steam_id');
      if (!isAutoSync) {
        alert('스팀 라이브러리가 성공적으로 동기화되었습니다!');
      }
    } catch (error) {
      console.error('스팀 라이브러리 동기화 실패:', error);
      setSyncError(error.message);
    } finally {
      setIsSyncing(false);
    }
  }, [token, fetchUserData]);

  // 자동 동기화를 위한 useEffect 추가
  useEffect(() => {
    if (userData?.steam_profile) {
      // 마지막 동기화 시간을 localStorage에서 가져옴
      const lastSyncTime = localStorage.getItem('lastSteamLibrarySync');
      const now = new Date().getTime();
      
      // 마지막 동기화로부터 24시간이 지났거나, 동기화 기록이 없는 경우
      if (!lastSyncTime || (now - parseInt(lastSyncTime)) > 24 * 60 * 60 * 1000) {
        syncSteamLibrary().then(() => {
          // 동기화 성공 시 시간 저장
          localStorage.setItem('lastSteamLibrarySync', now.toString());
        });
      }
    }
  }, [userData?.steam_profile]); // steam_profile이 변경될 때마다 실행

  // Steam 계정 연동 함수 수정
  const handleSteamLink = async () => {
    try {
      // 스팀 로그인 URL 요청
      const response = await fetch(`${BASE_URL}/account/steamlogin/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('스팀 로그인 요청 실패');
      }

      const data = await response.json();
      
      // 현재 URL을 state로 저장
      sessionStorage.setItem('returnToMyPage', 'true');
      
      // 스팀 로그인 페이지로 리다이렉트
      window.location.href = data.steam_login_url;
    } catch (error) {
      console.error('스팀 계정 연동 실패:', error);
      alert('스팀 계정 연동에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 콜백 처리 및 스팀 ID 연동
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamId = params.get('steam_id');

    if (steamId && token) {  // token 체크 추가
      const linkSteamAccount = async () => {
        try {
          // 바로 steamlink API 호출
          const response = await fetch(`${BASE_URL}/account/steamlink/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ steam_id: steamId })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '스팀 계정 연동 실패');
          }

          // URL 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // 사용자 데이터 새로고침
          await fetchUserData();
          
          // 스팀 계정 연동 후 바로 라이브러리 동기화 실행
          await syncSteamLibrary();
          
          alert('스팀 계정이 성공적으로 연동되고 라이브러리가 동기화되었습니다!');
        } catch (error) {
          console.error('스팀 계정 연동 실패:', error);
          alert(error.message || '스팀 계정 연동에 실패했습니다. 다시 시도해주세요.');
        }
      };

      linkSteamAccount();
    }
  }, [token, fetchUserData, syncSteamLibrary]);

  if (!token) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">로그인이 필요한 페이지입니다.</p>
      </div>
    );
  }

  if (!userData) return <div>로딩중...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-gray-200 rounded-lg shadow-lg">
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

              {userData.steam_profile ? (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Steam 정보</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={userData.steam_profile.avatar}
                      alt="Steam Avatar"
                      className="w-16 h-16 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div className="space-y-2">
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
                      {/* 라이브러리가 없는 경우에만 동기화 버튼 표시 */}
                      {(!userData.preferred_game || userData.preferred_game.length === 0) && (
                        <div className="mt-2">
                          <Button 
                            onClick={syncSteamLibrary}
                            disabled={isSyncing}
                            variant="secondary"
                            className="w-full"
                          >
                            {isSyncing ? "동기화 중..." : "스팀 라이브러리 동기화"}
                          </Button>
                          {syncError && (
                            <div className="mt-2">
                              <p className="text-red-500 text-sm">
                                {syncError}
                              </p>
                              {syncError.includes('Steam 프로필이 비공개') && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <p>Steam 프로필을 공개로 설정하는 방법:</p>
                                  <ol className="list-decimal list-inside mt-1">
                                    <li>Steam 프로필 페이지로 이동</li>
                                    <li>프로필 수정 버튼 클릭</li>
                                    <li>프라이버시 설정에서 "게임 세부 정보"를 "공개"로 변경</li>
                                    <li>변경사항 저장</li>
                                  </ol>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Steam 계정 연동</h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Steam 계정을 연동하면 게임 라이브러리를 자동으로 가져올 수 있습니다.
                    </p>
                    <Button 
                      onClick={handleSteamLink}
                      variant="secondary"
                      className="w-full"
                    >
                      Steam 계정 연동하기
                    </Button>
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
                <Button className=' bg-blue-950 hover:bg-blue-900' onClick={() => setIsEditing(true)}>정보 수정</Button>
                <Button className=' bg-blue-950 hover:bg-blue-900' variant="destructive" onClick={handleDelete}>
                  회원 탈퇴
                </Button>
              </div>
            </div>
          )}
        </CardContent>
    </div>
  );
}
