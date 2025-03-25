import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

// BASE_URL 수정
const BASE_URL = process.env.REACT_APP_API_URL;

export default function MyPage() {
  const { token, userId, logout, login } = useContext(AuthContext);
  const [selectedGames, setSelectedGames] = useState([]);
  const toggleGameSelection = (title) => {
    setSelectedGames(prev =>
      prev.includes(title)
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };
  const handleSavePreferredGames = async () => {
    try {
      const response = await fetch(`${BASE_URL}/account/${userId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferred_game: selectedGames }),
      });
  
      if (!response.ok) throw new Error("선호 게임 저장 실패");
  
      alert("선호 게임이 저장되었습니다.");
      fetchUserData();
      setIsSelectingPreferredGame(false); // ✅ 수정 모드 종료
    } catch (error) {
      alert("저장 중 오류 발생: " + error.message);
    }
  };
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectingPreferredGame, setIsSelectingPreferredGame] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [editForm, setEditForm] = useState({
    nickname: "",
  });
  const [error, setError] = useState(null);

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
            currentUserId = tokenPayload.user_id;
            
            // userId를 찾았다면 AuthContext에 저장
            if (currentUserId && login) {
              login(token, currentUserId.toString());
            }
          }
        } catch (e) {
        }
      }

      if (!currentUserId) {
        setError("사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      // API 경로 수정
      const apiUrl = `${BASE_URL}/account/${currentUserId}/`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error("잘못된 응답 데이터 형식");
      }

      setUserData(data);
      setEditForm({
        nickname: data.nickname || '',
      });
    } catch (error) {
      setError(`❌ 사용자 정보를 불러올 수 없습니다: ${error.message}`);
      // 심각한 오류 발생 시 로그아웃
      if (error.message.includes("401") || error.message.includes("403")) {
        logout();
      }
    }
  }, [token, userId, login, logout]);
  const startPolling = () => {
    const poll = async () => {
      try {
        const res = await fetch(`${BASE_URL}/account/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (res.ok) {
          const updatedUser = await res.json();
          setUserData(updatedUser);
  
          if (updatedUser.is_syncing) {
            setTimeout(poll, 3000);  // 다시 시도
          } else {
            setIsSyncing(false);     // 끝났으면 해제
          }
        }
      } catch (err) {
        console.error("동기화 상태 체크 실패:", err);
      }
    };
  
    poll(); // 첫 실행
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  useEffect(() => {
    if (!userData?.is_syncing) return;
  
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}/account/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (res.ok) {
          const updatedUser = await res.json();
          setUserData(updatedUser);
  
          if (!updatedUser.is_syncing) {
            clearInterval(interval); // 동기화 완료되면 중지
          }
        }
      } catch (err) {
        console.error("동기화 상태 체크 실패:", err);
      }
    }, 3000);
  
    return () => clearInterval(interval); // 컴포넌트 unmount 시 중지
  }, [userData?.is_syncing]);
  useEffect(() => {
    if (userData?.preferred_game) {
      setSelectedGames(userData.preferred_game);
    }
  }, [userData]);
  useEffect(() => {
    if (userData?.is_syncing !== undefined) {
      setIsSyncing(userData.is_syncing);
    }
  }, [userData?.is_syncing]);

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
      setError(`❌ 정보 수정에 실패했습니다: ${error.message}`);
    }
  };

  const handleDelete = async () => {
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
          throw new Error("사용자 ID를 찾을 수 없습니다.");
        }
      }

      if (!currentUserId) {
        throw new Error("사용자 ID를 찾을 수 없습니다.");
      }

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
      }

      const requestData = {
        refresh: refreshToken  // refresh_token -> refresh로 다시 변경
      };

      const response = await fetch(`${BASE_URL}/account/${currentUserId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const responseText = await response.text();
        
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
      const response = await fetch(`${BASE_URL}/account/steamlibrary/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '라이브러리 동기화에 실패했습니다.');
      }
  
      // ✅ 바로 폴링 시작
      startPolling();
    } catch (error) {
      setSyncError(error.message);
      setIsSyncing(false);
    }
  }, [token, userId]);

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
    <main className="flex-grow w-full flex px-6 pb-6 h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-8xl h-full mx-auto">
        
        {/* 좌측: 프로필 정보 (고정된 높이) */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md flex flex-col h-full">
          <h1 className="text-2xl font-bold mb-4">프로필</h1>
          
          {/* 기본 정보 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">기본 정보</h2>
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
              <p className="text-gray-700">
                <span className="font-medium">닉네임:</span> {userData.nickname}
              </p>
            )}
          </div>
  
          {/* Steam 정보 */}
          {userData.steam_profile ? (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3">Steam 정보</h2>
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <img
                  src={userData.steam_profile.avatar}
                  alt="Steam Avatar"
                  className="w-16 h-16 rounded-full border border-gray-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="flex flex-col">
                  <p className="text-gray-800 font-bold">
                    {userData.steam_profile.personaname}
                  </p>
                  <button
                    onClick={() => window.open(userData.steam_profile.profileurl, "_blank", "noopener")}
                    className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition duration-200 w-full sm:w-auto"
                    aria-label="Steam 프로필 방문하기"
                  >
                    Steam 프로필 방문하기
                  </button>
                </div>
              </div>
          {/* Steam 라이브러리 동기화 버튼 */}
          {userData.steam_profile && (
            <div className="mt-4">
              <Button 
                onClick={syncSteamLibrary}
                disabled={isSyncing}
                variant="secondary"
                className="w-full bg-blue-950 hover:bg-blue-900"
              >
                {isSyncing ? "동기화 중..." : "스팀 라이브러리 동기화"}
              </Button>
              {isSyncing && (
                <p className="mt-2 text-blue-800 text-sm font-semibold">
                  Steam 라이브러리를 불러오는 중입니다. 최대 30초 정도 걸릴 수 있어요.
                </p>
              )}

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

  
          {/* 버튼: 정보 수정 & 회원 탈퇴 */}
          <div className="flex gap-2 mt-auto">
            {!isEditing && (
              <Button className="bg-blue-950 hover:bg-blue-900 w-full" onClick={() => setIsEditing(true)}>
                정보 수정
              </Button>
            )}
            <Button className="bg-red-600 hover:bg-red-700 w-full" variant="destructive" onClick={handleDelete}>
              회원 탈퇴
            </Button>
          </div>
        </div>
  
        {/* 우측: 선호 장르 & 선호 게임 (가변 높이 + 스크롤) */}
        <div className="w-full md:w-2/3 bg-gray-100 p-6 rounded-lg shadow-md flex flex-col h-full overflow-y-auto custom-scrollbar">
          
          {/* 선호 장르 */}
          {userData.preferred_genre && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">선호 장르</h2>
              <div className="flex flex-wrap gap-3">
                {userData.preferred_genre.map((genre, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
  
          {/* 선호 게임 */}
          {/* 선호 게임 섹션 */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">선호 게임</h2>

              {/* 항상 보이게 하기 */}
              <Button
                className="mt-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={() => setIsSelectingPreferredGame(!isSelectingPreferredGame)}
              >
                {isSelectingPreferredGame ? "선호 게임 선택 취소" : "선호 게임 수정"}
              </Button>

              {/* 선호 게임이 있을 때 목록 보여줌 */}
              {userData.preferred_game && userData.preferred_game.length > 0 ? (
                <div className="flex flex-wrap gap-3 mt-2">
                  {userData.preferred_game.map((game, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md">
                      {game}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-700 font-medium bg-red-100 border border-red-300 px-4 py-2 rounded-md mt-2">
                  🚨 선호 게임이 없습니다. 보유 게임에서 선택해 저장해보세요!
                </p>
              )}
            </div>

          {/* 보유 게임 선택 UI */}
          {userData.library_games && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">보유 게임</h2>
              {isSelectingPreferredGame && (
                <Button
                  onClick={handleSavePreferredGames}
                  className="mt-4 px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900"
                >
                  선택한 게임을 선호 게임으로 저장
                </Button>
              )}
              <div className="flex flex-wrap gap-3">
                {[...userData.library_games]
                  .sort((a, b) => b.playtime - a.playtime)
                  .map((game, index) => {
                    const isSelected = selectedGames.includes(game.title);
                    return (
                      <button
                        key={index}
                        onClick={
                          isSelectingPreferredGame
                            ? () => toggleGameSelection(game.title)
                            : undefined // 선택 중이 아닐 땐 클릭 무시
                        }
                        className={`px-3 py-1.5 rounded-md border transition ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-700"
                            : "bg-purple-100 text-purple-800 border-purple-300"
                        } ${isSelectingPreferredGame ? "cursor-pointer" : "cursor-default opacity-60"}`}
                      >
                        {game.title} ({game.playtime}분)
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
          </div>
  
      </div>
    </main>
  );
}  