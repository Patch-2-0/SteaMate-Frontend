import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Send, Plus } from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

// ✅ 챗봇 응답 포맷팅 함수
const formatChatbotResponse = (text) => {
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  return lines.map((line, index) => {
    if (line.startsWith("추천 게임")) {
      return (
        <p key={index} className="font-bold text-blue-600 mt-2">
          {line.replace("[", "").replace("]", " 🎮")}
        </p>
      );
    }
    return <p key={index} className="text-gray-800">{line}</p>;
  });
};

export default function ChatbotUI() {
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]); // 세션 목록
  const [activeSessionId, setActiveSessionId] = useState(null); // 현재 활성 세션
  const [messages, setMessages] = useState({});  // 세션별 메시지 저장
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

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
        setSessions(data.data);
        
        // 첫 번째 세션이 있다면 활성화하고 대화 내역 불러오기
        if (data.data.length > 0) {
          const firstSessionId = data.data[0].id;
          setActiveSessionId(firstSessionId);
          fetchSessionMessages(firstSessionId);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setError("❌ 세션 목록을 불러올 수 없습니다.");
      }
    };

    fetchSessions();
  }, [token]);

  // 세션 선택 시 이전 대화 내역 불러오기 함수 추가
  const fetchSessionMessages = async (sessionId) => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${sessionId}/message/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("대화 내역 조회 실패");

      const data = await response.json();
      // 서버에서 받은 메시지를 현재 형식에 맞게 변환하고 메시지 ID 포함
      const formattedMessages = [
        { text: "안녕하세요! Steam 게임 추천 챗봇입니다.", sender: "bot" },
        ...data.data.map(msg => ([
          { text: msg.user_message, sender: "user", messageId: msg.id },
          { text: msg.chatbot_message, sender: "bot" }
        ])).flat()
      ];
      
      setMessages(prev => ({
        ...prev,
        [sessionId]: formattedMessages
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
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
      
      setSessions(prev => [...prev, data.data]);
      setActiveSessionId(newSessionId);
      setMessages(prev => ({
        ...prev,
        [newSessionId]: [{ text: "안녕하세요! Steam 게임 추천 챗봇입니다.", sender: "bot" }]
      }));
    } catch (error) {
      console.error("Error creating session:", error);
      setError("❌ 세션을 생성할 수 없습니다.");
    }
  };

  const sendMessage = async () => {
    if (input.trim() === "" || !activeSessionId) {
      setError("❌ 세션이 없습니다. 새로고침 해주세요.");
      return;
    }

    const currentInput = input;
    setInput("");
    setError(null);
    setIsSending(true);

    // 사용자 메시지 즉시 UI에 추가
    setMessages(prev => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), 
        { text: currentInput, sender: "user" }
      ]
    }));

    try {
      const response = await fetch(`${BASE_URL}/chat/${activeSessionId}/message/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_message: currentInput }),
      });

      if (!response.ok) throw new Error("메시지 전송 실패");

      const data = await response.json();
      
      // 마지막 사용자 메시지를 업데이트하고 봇 응답 추가
      setMessages(prev => {
        const messages = [...prev[activeSessionId]];
        messages[messages.length - 1] = { 
          text: currentInput, 
          sender: "user", 
          messageId: data.data.id 
        };
        return {
          ...prev,
          [activeSessionId]: [...messages, 
            { text: data.data.chatbot_message, sender: "bot" }
          ]
        };
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), 
          { text: "❌ 응답을 받을 수 없습니다.", sender: "bot" }
        ]
      }));
    } finally {
      setIsSending(false);
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
      console.error("Error deleting session:", error);
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
      const response = await fetch(`${BASE_URL}/chat/${activeSessionId}/message/${messageId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_message: editInput }),
      });

      if (!response.ok) throw new Error("메시지 수정 실패");

      const data = await response.json();
      
      setMessages(prev => {
        const sessionMessages = [...prev[activeSessionId]];
        const messageIndex = sessionMessages.findIndex(
          msg => msg.sender === "user" && msg.messageId === messageId
        );
        
        if (messageIndex !== -1) {
          sessionMessages[messageIndex] = { 
            text: editInput, 
            sender: "user", 
            messageId: messageId 
          };
          sessionMessages[messageIndex + 1] = { 
            text: data.data.chatbot_message, 
            sender: "bot" 
          };
        }
        
        return {
          ...prev,
          [activeSessionId]: sessionMessages
        };
      });

      setEditingMessageId(null);
      setEditInput("");
    } catch (error) {
      console.error("Error editing message:", error);
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
      console.error("Error deleting message:", error);
      setError("❌ 메시지를 삭제할 수 없습니다.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* 세션 목록 사이드바 */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <Button onClick={createNewSession} className="w-full mb-4" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-lg cursor-pointer relative group ${
                activeSessionId === session.id ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
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
      <div className="flex flex-col flex-1">
        <Card className="flex flex-col flex-1">
          <CardContent className="flex flex-col flex-1 p-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-red-500 text-white rounded-lg text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 120px)" }}>
              <div className="flex flex-col gap-2">
                {activeSessionId && messages[activeSessionId]?.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <img src="/robot-avatar.png" alt="Bot" className="w-8 h-8 rounded-full" />
                    )}
                    <div className={`relative group ${msg.sender === "user" ? "self-end" : ""}`}>
                      {editingMessageId === msg.messageId && msg.sender === "user" ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            className="min-w-[200px]"
                            autoFocus
                            disabled={isEditing}
                          />
                          <Button 
                            onClick={() => saveEditedMessage(msg.messageId)}
                            size="sm"
                            disabled={isEditing}
                          >
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                질문중...
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
                            variant="outline"
                            size="sm"
                            disabled={isEditing}
                          >
                            취소
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`p-3 rounded-lg max-w-[80%] ${
                            msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {msg.sender === "bot" ? formatChatbotResponse(msg.text) : msg.text}
                          
                          {msg.sender === "user" && msg.messageId && (
                            <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <button
                                onClick={() => editMessage(msg.messageId, msg.text)}
                                className="text-gray-500 hover:text-blue-500"
                                disabled={isDeleting === msg.messageId}
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => deleteMessage(msg.messageId)}
                                className="text-gray-500 hover:text-red-500"
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
                <div ref={scrollRef}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ 입력창 하단 고정 */}
        <div className="p-3 flex items-center border-t bg-white w-full relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
            disabled={isSending}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isSending) {
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            className="ml-2" 
            size="icon"
            disabled={isSending}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
