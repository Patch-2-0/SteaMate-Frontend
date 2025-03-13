import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

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
  const [messages, setMessages] = useState([
    { text: "안녕하세요! Steam 게임 추천 챗봇입니다. 어떤 게임을 찾고 계신가요?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const createSession = async () => {
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

        if (!response.ok) {
          throw new Error("세션 생성 실패");
        }

        const data = await response.json();
        setSessionId(data.data.id);
      } catch (error) {
        console.error("Error creating session:", error);
        setError("❌ 세션을 생성할 수 없습니다.");
      }
    };

    createSession();
  }, [token]);

  const sendMessage = async () => {
    if (input.trim() === "" || !sessionId) {
      setError("❌ 세션이 없습니다. 새로고침 해주세요.");
      return;
    }

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/chat/${sessionId}/message/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_message: input }),
      });

      if (!response.ok) {
        throw new Error("메시지 전송 실패");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: data.data.chatbot_message, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "❌ 응답을 받을 수 없습니다.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-lg mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
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

          {/* ✅ 채팅 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 120px)" }}>
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
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
                  <div className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-100 text-gray-900"
                  }`}>
                    {msg.sender === "bot" ? formatChatbotResponse(msg.text) : msg.text}
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
        />
        <Button onClick={sendMessage} className="ml-2" size="icon">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
