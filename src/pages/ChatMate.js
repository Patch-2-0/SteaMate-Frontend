import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { text: "안녕하세요! Steam 게임 추천 챗봇입니다. 어떤 게임을 찾고 계신가요?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      const response = generateGameRecommendation(input);
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
    }, 1000);
  };

  const generateGameRecommendation = (query) => {
    const recommendations = {
      "액션": "🎮 추천 게임: Doom Eternal, Sekiro, Devil May Cry 5",
      "RPG": "🧙 추천 게임: The Witcher 3, Cyberpunk 2077, Divinity: Original Sin 2",
      "전략": "🛡️ 추천 게임: Age of Empires IV, Civilization VI, XCOM 2",
      "호러": "👻 추천 게임: Resident Evil Village, Phasmophobia, Dead by Daylight",
      "멀티플레이": "👥 추천 게임: Among Us, Fall Guys, Left 4 Dead 2",
    };

    return recommendations[query] || "죄송합니다. 해당 장르의 추천 게임을 찾을 수 없습니다. 다른 장르를 입력해 주세요!";
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-lg mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <Card className="flex flex-col flex-1">
        <CardContent className="flex flex-col flex-1 p-4">
          {/* ✅ 채팅 메시지가 입력창 높이를 고려하고 자동으로 조절됨 */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-60px)]">
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
                    <img 
                      src="/robot-avatar.png" 
                      alt="Bot" 
                      className="w-8 h-8 rounded-full" 
                    />
                  )}
                  <div 
                    className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"}`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {/* ✅ 자동 스크롤을 위한 ref */}
              <div ref={scrollRef}></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* ✅ 입력창이 부모 안에서 자연스럽게 위치하도록 수정 */}
      <div className="p-3 flex items-center border-t bg-white relative w-full">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메세지를 입력해주세요..."
          className="flex-1"
        />
        <Button onClick={sendMessage} className="ml-2" size="icon">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
