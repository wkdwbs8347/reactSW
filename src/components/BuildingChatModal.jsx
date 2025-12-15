import { useState, useEffect, useRef } from "react";
import useBuildingChat from "../hooks/useBuildingChat";

export default function BuildingChatModal({ roomId, user, onClose }) {
  const { messages, sendMessage } = useBuildingChat(roomId, user);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 메시지 입력 후 전송
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // 메시지가 추가될 때 스크롤 아래로 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Chat Modal */}
      <div className="relative w-full max-w-lg h-[70%] bg-white rounded-xl shadow-lg flex flex-col p-4 z-50">
        
        {/* 상단: 참여자 프로필 */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {/* 메시지에서 유니크 참여자만 표시 */}
          {[...new Map(messages.map((msg) => [msg.userId, msg])).values()].map((msg) => (
            <img
              key={msg.userId}
              src={msg.profileImage || "/defaultProfile.png"}
              alt={msg.nickname}
              className="w-10 h-10 rounded-full border-2 border-blue-400 cursor-pointer"
              title={msg.nickname}
              // 클릭 시 간단 정보 모달 열기 가능
            />
          ))}
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto mb-2 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-xs ${
                msg.userId === user.id ? "ml-auto bg-blue-200" : "mr-auto bg-gray-200"
              }`}
            >
              <div className="text-xs text-gray-600">{msg.nickname}</div>
              <div>{msg.content}</div>
              <div className="text-[10px] text-gray-500">
                {new Date(msg.sentDate).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {/* 자동 스크롤용 빈 div */}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none"
            placeholder="메시지를 입력하세요..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            전송
          </button>
        </div>

      </div>
    </div>
  );
}