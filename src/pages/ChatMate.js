import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Send, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;
const WS_URL = process.env.REACT_APP_WS_URL;

// 초기 인사말 포맷팅 함수 수정
const formatInitialGreeting = () => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium mb-4">
        안녕하세요! Steam 게임 추천 챗봇입니다. 
        <br />
        MyPage에서 라이브러리를 연동하면 더 좋은 추천을 받을 수 있어요!
      </p>

    {/* ✅ Steam 연동 버튼 추가 */}
    <Link to="/mypage" className="ml-auto">
      <button className="bg-blue-950 text-white py-2 px-6 rounded-lg hover:bg-blue-900 text-center leading-tight shadow-md">
        스팀 계정 연동 혹은 라이브러리 연동하러 가기
      </button>
      </Link>
      
      <p className="font-medium text-blue-950 mb-2">다음과 같이 물어보세요! 👇</p>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <p className="font-medium text-blue-950">이전에 했던 게임과 관련해서 질문하기</p>
              <p className="text-gray-600 text-sm mt-1">예시) 나 구스구스덕 좋아해 비슷한 게임 추천해줘!</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-medium text-blue-950">스팀 라이브러리 기반 추천</p>
              <p className="text-gray-600 text-sm mt-1">예시) 내가 좋아할만한 게임 추천해줘!</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤔</span>
            <div>
              <p className="font-medium text-blue-950">복잡한 질문도 가능해요</p>
              <p className="text-gray-600 text-sm mt-1">예시) 중세시대에 대검을 들고 몬스터들과 싸우는 게임 하고 싶어</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ 챗봇 응답 포맷팅 함수 수정
const formatChatbotResponse = (text) => {
  // text가 undefined인 경우 빈 배열 반환
  if (!text) return [];

  // 초기 인사말인 경우 새로운 포맷팅 적용
  if (text.startsWith("안녕하세요!")) {
    return formatInitialGreeting();
  }

  const lines = text.split("\n").filter((line) => line && line.trim() !== "");
  const result = [];
  let gameCards = [];
  let currentGame = null;
  let currentDescription = [];
  let currentGameLink = null;
  let currentImageLink = null;
  let currentAppId = null;
  let finalMessage = null;

  lines.forEach((line, idx) => {
    // 빈 라인 무시
    if (!line || !line.trim()) return;

    // 게임 제목 처리 - [게임이름] :: appid 형식 파싱
    if (line.match(/^\[.*\](\s*)::\s*\d+$/) || line.match(/^\*\*\[.*\]\*\*(\s*)::\s*\d+$/)) {
      // 이전 게임 정보가 있으면 먼저 추가
      if (currentGame && currentDescription.length > 0) {
        // appid가 있으면 Steam 링크 생성
        if (currentAppId) {
          currentGameLink = `https://store.steampowered.com/app/${currentAppId}`;
          currentImageLink = `https://cdn.akamai.steamstatic.com/steam/apps/${currentAppId}/header.jpg`;
        }
        
        gameCards.push(
          <div key={`game-${gameCards.length}`} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col cursor-default">
              {currentImageLink && currentGameLink && (
                <a 
                  href={currentGameLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:opacity-90 transition-opacity aspect-[460/215] overflow-hidden bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={currentImageLink} 
                    alt={currentGame} 
                    className="w-full h-full object-contain cursor-pointer"
                    loading="lazy"
                  />
                </a>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-blue-950 mb-2">
                  <a 
                    href={currentGameLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {currentGame}
                  </a>
                </h3>
                <p className="text-gray-700 text-sm mt-1">{currentDescription.join(" ")}</p>
              </div>
            </div>
          </div>
        );
      }
      
      // 새 게임 시작 - 게임명과 appid 분리
      const parts = line.split(/\s*::\s*/);
      // 마크다운 강조(**) 와 대괄호([]) 제거
      currentGame = parts[0].replace(/[\[\]\*]/g, "").trim();
      currentAppId = parts.length > 1 ? parts[1].trim() : null;
      currentDescription = [];
      currentGameLink = null;
      currentImageLink = null;
      
      // appid가 있으면 Steam 링크 생성
      if (currentAppId) {
        currentGameLink = `https://store.steampowered.com/app/${currentAppId}`;
        currentImageLink = `https://cdn.akamai.steamstatic.com/steam/apps/${currentAppId}/header.jpg`;
      }
    } 
    // 바로가기 링크 처리 (appid가 없을 경우를 위한 백업)
    else if (line.includes("바로가기 링크 :")) {
      currentGameLink = line.split(": ")[1]?.trim() || currentGameLink;
    }
    // 이미지 링크 처리 (appid가 없을 경우를 위한 백업)
    else if (line.includes("이미지 링크 :")) {
      currentImageLink = line.split(": ")[1]?.trim() || currentImageLink;
    }
    // 추천 이유 및 설명 처리
    else if (line.includes("추천 이유 및 설명")) {
      const description = line.includes(":") 
        ? line.split(":")[1]?.trim()
        : line.trim();
      if (description) {
        currentDescription.push(description);
      }
    }
    // 추천 이유 없이 하이픈(-)으로 시작하는 설명 처리
    else if (line.trim().startsWith("-") && currentGame) {
      currentDescription.push(line.trim().substring(1).trim());
    }
    // "추천 게임" 텍스트 처리
    else if (line.startsWith("추천 게임")) {
      result.push(
        <p key={`title-${idx}`} className="font-bold text-blue-600 text-lg mt-2 mb-3">
          {line} 🎮
        </p>
      );
    }
    // 일반 텍스트는 마지막 멘트로 저장
    else if (!line.includes("이미지 링크 :") && !line.includes("바로가기 링크 :")) {
      finalMessage = line;
    }
  });

  // 마지막 게임 정보 추가
  if (currentGame && currentDescription.length > 0) {
    // appid가 있으면 Steam 링크 생성
    if (currentAppId) {
      currentGameLink = `https://store.steampowered.com/app/${currentAppId}`;
      currentImageLink = `https://cdn.akamai.steamstatic.com/steam/apps/${currentAppId}/header.jpg`;
    }
    
    gameCards.push(
      <div key={`game-${gameCards.length}`} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col cursor-default">
          {currentImageLink && currentGameLink && (
            <a 
              href={currentGameLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity aspect-[460/215] overflow-hidden bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={currentImageLink} 
                alt={currentGame} 
                className="w-full h-full object-contain cursor-pointer"
                loading="lazy"
              />
            </a>
          )}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-blue-950 mb-2">
              <a 
                href={currentGameLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {currentGame}
              </a>
            </h3>
            <p className="text-gray-700 text-sm mt-1">{currentDescription.join(" ")}</p>
          </div>
        </div>
      </div>
    );
  }

  // 게임 카드가 있으면 그리드로 추가
  if (gameCards.length > 0) {
    result.push(
      <div key="game-cards-container" className="flex flex-wrap gap-4 mb-6">
        {gameCards}
      </div>
    );
  }

  // 마지막 멘트가 있다면 마지막에 추가
  if (finalMessage) {
    result.push(
      <p key="final-message" className="text-gray-800 mt-4">{finalMessage}</p>
    );
  }

  return result;
};

export default function ChatbotUI() {
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]); // 세션 목록
  const [activeSessionId, setActiveSessionId] = useState(null); // 현재 활성 세션
  const [messages, setMessages] = useState({});  // 세션별 메시지 저장
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const messagesEndRef = useRef(null);  // 새로운 ref 추가
  const sessionCreated = useRef(false); // ✅ 세션 생성 여부 추적
  const wsRef = useRef(null);  // 웹소켓 연결 참조
  const [isConnected, setIsConnected] = useState(false);  // 웹소켓 연결 상태
  const [isBotResponding, setIsBotResponding] = useState(false);  // 상태 추가

  // 세션 목록 불러오기
  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) {
        setError("❌ 로그인 후 이용해주세요.");
        return;
      }
  
      try {
        const response = await fetch(`${BASE_URL}/chat/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error("세션 목록 조회 실패");
  
        const data = await response.json();
        const sortedSessions = data.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
  
        setSessions(sortedSessions);
  
        if (sortedSessions.length > 0) {
          // ✅ 기존 세션이 있다면 첫 번째 세션을 활성화
          const firstSessionId = sortedSessions[0].id;
          setActiveSessionId(firstSessionId);
          fetchSessionMessages(firstSessionId);
        } else if (!sessionCreated.current) {
          // ✅ 세션이 없고, 한 번도 생성되지 않았다면 새 세션 생성
          sessionCreated.current = true; // ✅ 중복 실행 방지
          createNewSession();
        }
      } catch (error) {
        setError("❌ 세션 목록을 불러올 수 없습니다.");
      }
    };
  
    fetchSessions();
  }, [token]);

  // 세션 선택 시 이전 대화 내역 불러오기 함수 추가
  const fetchSessionMessages = async (sessionId) => {
    try {
      // 세션 변경 시 isBotResponding 상태를 초기화
      setIsBotResponding(false);
      
      const response = await fetch(`${BASE_URL}/chat/${sessionId}/message/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("대화 내역 조회 실패");

      const data = await response.json();
      // 서버에서 받은 메시지를 시간순으로 정렬
      const sortedMessages = data.data.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      
      // 정렬된 메시지를 현재 형식에 맞게 변환
      const formattedMessages = [
        { 
          text: "안녕하세요! Steam 게임 추천 챗봇입니다.\nMyPage에서 라이브러리를 연동하면 더 좋은 추천을 받을 수 있어요! \n\n다음과 같이 물어보세요! \n- 이전에 했던 게임과 관련해서 질문하기 ex)나 구스구스덕 좋아해 비슷한 게임 추천해줘! \n - 스팀 라이브러리 기반 추천 ex)내가 좋아할만한 게임 추천해줘! \n - 복잡한 질문 가능 ex)중세시대에 대검을 들고 몬스터들과 싸우는 게임 하고 싶어", 
          sender: "bot" 
        },
        ...sortedMessages.map(msg => ([
          { text: msg.user_message, sender: "user", messageId: msg.id },
          { text: msg.chatbot_message, sender: "bot" }
        ])).flat()
      ];
      
      setMessages(prev => ({
        ...prev,
        [sessionId]: formattedMessages
      }));
    } catch (error) {
      setError("❌ 대화 내역을 불러올 수 없습니다.");
    }
  };

  // 새 세션 생성
  const createNewSession = async () => {
    if (!token) {
      setError("❌ 로그인 후 이용해주세요.");
      return;
    }
  
    try {
      // 새 세션 생성 시 isBotResponding 상태를 초기화
      setIsBotResponding(false);
      
      const response = await fetch(`${BASE_URL}/chat/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("세션 생성 실패");
  
      const data = await response.json();
      const newSessionId = data.data.id;
  
      setSessions(prev => [data.data, ...prev]); // 세션 리스트 업데이트
      setActiveSessionId(newSessionId); // ✅ 생성된 세션을 활성화
      setMessages(prev => ({
        ...prev,
        [newSessionId]: [{ 
          text: "안녕하세요! Steam 게임 추천 챗봇입니다.\nMyPage에서 라이브러리를 연동하면 더 좋은 추천을 받을 수 있어요! \n\n다음과 같이 물어보세요! \n- 이전에 했던 게임과 관련해서 질문하기 ex)나 구스구스덕 좋아해 비슷한 게임 추천해줘! \n - 스팀 라이브러리 기반 추천 ex)내가 좋아할만한 게임 추천해줘! \n - 복잡한 질문 가능 ex)중세시대에 대검을 들고 몬스터들과 싸우는 게임 하고 싶어", 
          sender: "bot" 
        }]
      }));
    } catch (error) {
      setError("❌ 세션을 생성할 수 없습니다.");
    }
  };
  
  // 웹소켓 연결 설정
  useEffect(() => {
    if (activeSessionId && token) {
      // 기존 연결 종료
      if (wsRef.current) {
        wsRef.current.close();
      }

      try {
        // 웹소켓 URL에 토큰을 포함
        const wsUrl = `${WS_URL}${activeSessionId}/?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.status === 'error') {
              setError(data.message);
              setIsBotResponding(false);
              return;
            }

            if (data.type === 'pong') {
              return;
            }

            if (data.response !== undefined) {
              setMessages(prev => {
                const sessionMessages = [...(prev[activeSessionId] || [])];
                const messageIndex = sessionMessages.findIndex(msg => 
                  msg.sender === 'bot' && (msg.isProcessing || msg.isStreaming)
                );

                if (messageIndex !== -1) {
                  // 처리 중이거나 스트리밍 중인 메시지를 찾아서 업데이트
                  sessionMessages[messageIndex] = {
                    text: data.response,
                    sender: 'bot',
                    isStreaming: data.is_streaming
                  };

                  if (!data.is_streaming) {
                    setIsBotResponding(false);
                  }
                } else if (data.is_streaming) {
                  // 처리 중인 메시지를 찾지 못했다면 새로 추가
                  sessionMessages.push({
                    text: data.response,
                    sender: 'bot',
                    isStreaming: true
                  });
                } else {
                  // 스트리밍이 아닌 일반 메시지
                  sessionMessages.push({
                    text: data.response,
                    sender: 'bot'
                  });
                  setIsBotResponding(false);
                }

                return {
                  ...prev,
                  [activeSessionId]: sessionMessages
                };
              });
            }
          } catch (error) {
            setError('메시지 처리 중 오류가 발생했습니다.');
            setIsBotResponding(false);
          }
        };

        ws.onclose = (event) => {
          setIsConnected(false);
          
          // 비정상 종료 코드에 따른 에러 메시지
          if (event.code === 4003) {
            setError('인증에 실패했습니다. 다시 로그인해주세요.');
          } else if (event.code !== 1000) {
            setError('연결이 종료되었습니다. 페이지를 새로고침해주세요.');
          }
        };

        ws.onerror = (error) => {
          setError('연결 중 오류가 발생했습니다.');
        };

        wsRef.current = ws;

        // 연결 유지를 위한 ping (30초마다)
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);

        return () => {
          clearInterval(pingInterval);
          if (ws.readyState === WebSocket.OPEN) {
            ws.close(1000, '정상 종료');
          }
        };
      } catch (error) {
        setError('웹소켓 연결을 설정할 수 없습니다.');
      }
    }
  }, [activeSessionId, token]);

  // sendMessage 함수 수정
  const sendMessage = async () => {
    if (isBotResponding) {
      return;  // 봇이 응답 중일 때는 메시지 전송 불가
    }

    if (input.trim() === "" || !activeSessionId || !isConnected) {
      setError("❌ 연결 상태를 확인해주세요.");
      return;
    }

    const currentInput = input;
    setInput("");
    setError(null);
    setIsSending(true);
    setIsBotResponding(true);  // 봇 응답 시작

    // 사용자 메시지 즉시 UI에 추가
    setMessages(prev => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), 
        { text: currentInput, sender: "user" },
        { text: "게임을 찾고 있어요. 잠시만 기다려주세요! 🎮", sender: "bot", isProcessing: true }
      ]
    }));

    try {
      // 웹소켓으로 메시지 전송
      wsRef.current.send(JSON.stringify({
        message: currentInput
      }));
    } catch (error) {
      setError("❌ 메시지 전송에 실패했습니다.");
      setIsSending(false);
      setIsBotResponding(false);  // 에러 시 봇 응답 종료
      // 처리 중 메시지 제거
      setMessages(prev => ({
        ...prev,
        [activeSessionId]: prev[activeSessionId].filter(msg => !msg.isProcessing)
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return; // 쉬프트+엔터는 기본 동작 유지 (줄바꿈)
      } else {
        e.preventDefault(); // 일반 엔터는 기본 동작 방지
        if (!isBotResponding) {
          sendMessage();
        }
      }
    }
  };

  // 세션 삭제 함수 추가
  const deleteSession = async (sessionId, e) => {
    e.stopPropagation(); // 세션 클릭 이벤트가 발생하지 않도록 방지

    try {
      const response = await fetch(`${BASE_URL}/chat/${sessionId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("세션 삭제 실패");

      // 세션 목록에서 삭제된 세션 제거
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // 삭제된 세션의 메시지도 제거
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[sessionId];
        return newMessages;
      });

      // 현재 활성 세션이 삭제된 경우 다른 세션으로 전환
      if (activeSessionId === sessionId) {
        const remainingSessions = sessions.filter(session => session.id !== sessionId);
        if (remainingSessions.length > 0) {
          setActiveSessionId(remainingSessions[0].id);
          fetchSessionMessages(remainingSessions[0].id);
        } else {
          setActiveSessionId(null);
        }
      }
    } catch (error) {
      setError("❌ 세션을 삭제할 수 없습니다.");
    }
  };

  // 메시지 수정 함수 추가
  const editMessage = async (messageId, originalMessage) => {
    setEditingMessageId(messageId);
    setEditInput(originalMessage);
  };

  // 수정된 메시지 저장 함수
  const saveEditedMessage = async (messageId) => {
    if (!editInput.trim()) return;
    setIsEditing(true);

    try {
      // 현재 세션의 모든 메시지 가져오기
      const sessionMessages = [...messages[activeSessionId]];
      const messageIndex = sessionMessages.findIndex(
        msg => msg.sender === "user" && msg.messageId === messageId
      );

      if (messageIndex !== -1) {
        // 수정하려는 메시지 이후의 모든 메시지 ID 수집
        const messagesToDelete = sessionMessages
          .slice(messageIndex + 2) // 현재 메시지와 봇 응답 다음부터
          .filter(msg => msg.sender === "user" && msg.messageId) // 사용자 메시지만 필터링
          .map(msg => msg.messageId);

        // 수집된 메시지들 삭제 요청
        await Promise.all(messagesToDelete.map(msgId => 
          fetch(`${BASE_URL}/chat/${activeSessionId}/message/${msgId}/`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ));

        // 웹소켓으로 메시지 수정 요청 전송
        wsRef.current.send(JSON.stringify({
          type: 'message_modify',
          message_id: messageId,
          new_message: editInput
        }));

        // UI 업데이트
        setMessages(prev => {
          const updatedMessages = sessionMessages.slice(0, messageIndex);
          
          updatedMessages.push(
            { 
              text: editInput, 
              sender: "user", 
              messageId: messageId 
            },
            { 
              text: "메시지를 수정하고 있어요. 잠시만 기다려주세요! 🎮", 
              sender: "bot",
              isProcessing: true 
            }
          );

          return {
            ...prev,
            [activeSessionId]: updatedMessages
          };
        });
      }

      setEditingMessageId(null);
      setEditInput("");
    } catch (error) {
      setError("❌ 메시지를 수정할 수 없습니다.");
    } finally {
      setIsEditing(false);
    }
  };

  // 메시지 삭제 함수 추가
  const deleteMessage = async (messageId) => {
    setIsDeleting(messageId);
    try {
      const response = await fetch(`${BASE_URL}/chat/${activeSessionId}/message/${messageId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("메시지 삭제 실패");

      // 메시지 목록에서 삭제된 메시지와 그에 대한 봇 응답 제거
      setMessages(prev => {
        const sessionMessages = [...prev[activeSessionId]];
        const messageIndex = sessionMessages.findIndex(
          msg => msg.sender === "user" && msg.messageId === messageId
        );
        
        if (messageIndex !== -1) {
          // 사용자 메시지와 그 다음의 봇 응답을 함께 제거
          sessionMessages.splice(messageIndex, 2);
        }
        
        return {
          ...prev,
          [activeSessionId]: sessionMessages
        };
      });

    } catch (error) {
      setError("❌ 메시지를 삭제할 수 없습니다.");
    } finally {
      setIsDeleting(null);
    }
  };

  // 스크롤 함수 추가
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 메시지가 변경될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeSessionId]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full max-w-[88rem] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* 세션 목록 사이드바 */}
      <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
        <Button onClick={createNewSession} className="w-full mb-4 bg-blue-950 hover:bg-blue-900 text-white rounded-lg" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg cursor-pointer relative group ${
                activeSessionId === session.id ? "bg-blue-950 hover:bg-blue-900 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div
                onClick={() => {
                  setActiveSessionId(session.id);
                  fetchSessionMessages(session.id);
                }}
              >
                채팅 {new Date(session.created_at).toLocaleDateString()}
              </div>
              
              {/* 삭제 버튼 추가 */}
              <button
                onClick={(e) => deleteSession(session.id, e)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
                  ${activeSessionId === session.id ? "text-white hover:text-red-200" : "text-red-500 hover:text-red-700"}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 mb-6 bg-red-500 text-white rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6 pb-6">
              {activeSessionId && messages[activeSessionId]?.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <img src="/robot-avatar.gif" alt="Bot" className="w-12 h-12 rounded-xl flex-shrink-0 mt-1" />
                  )}
                  <div className={`relative group ${msg.sender === "user" ? "max-w-[80%]" : "max-w-[85%] w-full"}`}>
                    {editingMessageId === msg.messageId && msg.sender === "user" ? (
                      <div className="flex flex-col gap-2 w-[400px]">
                        <Input
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          className="w-full"
                          autoFocus
                          disabled={isEditing}
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => saveEditedMessage(msg.messageId)}
                            size="sm"
                            disabled={isEditing}
                            className="bg-blue-950 hover:bg-blue-900 text-white min-w-[60px]"
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                수정중...
                              </div>
                            ) : (
                              "수정"
                            )}
                          </Button>
                          <Button 
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditInput("");
                            }}
                            size="sm"
                            disabled={isEditing}
                            className="bg-gray-500 hover:bg-gray-600 text-white min-w-[60px]"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-lg break-words ${
                          msg.sender === "user" ? "bg-blue-950 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {msg.sender === "bot" ? (
                          <div className="flex items-start gap-2">
                            <div className="w-full">{formatChatbotResponse(msg.text)}</div>
                          </div>
                        ) : (
                          msg.text
                        )}
                        
                        {msg.sender === "user" && msg.messageId && (
                          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                            <button
                              onClick={() => editMessage(msg.messageId, msg.text)}
                              className="text-gray-500 hover:text-blue-950 bg-white rounded-full p-1"
                              disabled={isDeleting === msg.messageId}
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.messageId)}
                              className="text-gray-500 hover:text-red-500 bg-white rounded-full p-1"
                              disabled={isDeleting === msg.messageId}
                            >
                              {isDeleting === msg.messageId ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                              ) : (
                                "🗑"
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} /> {/* 스크롤 위치 지정을 위한 요소 */}
            </div>
          </div>
        </div>

        {/* 입력창 */}
        <div className="flex-shrink-0 p-4 border-none bg-white">
          <div className="flex items-center gap-3 max-w-[98%] mx-auto">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (!isBotResponding) {
                  sendMessage(); 
                }
              }} 
              className="relative flex items-center w-full max-w-5xl border border-gray-300 rounded-2xl px-4 py-2 bg-white shadow-md"
            >
              {/* ✅ 입력창 (textarea) */}
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={handleKeyDown} 
                placeholder={isBotResponding ? "챗봇이 응답하는 중입니다..." : "메시지를 입력하세요..."}
                disabled={isBotResponding}
                className="flex-1 border-none focus:ring-0 focus:outline-none px-3 resize-none min-h-[50px] max-h-[200px] overflow-y-auto py-3 leading-normal pr-16 text-base placeholder-gray-500 text-gray-900"
                rows="1"
                style={{ height: 'auto' }}
              />

                      {/* ✅ 버튼을 입력창 내부 우측 하단에 고정 */}
                      <button 
                type="submit" 
                disabled={isBotResponding}
                className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-lg shadow-md ${
                  isBotResponding ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-blue-900 text-white'
                }`}
                      >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}