import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import EditMessageModal from "./EditMessageModal";
import useBuildingChat from "../hooks/useBuildingChat";

export default function BuildingChatModal({ roomId, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // 1. DB에서 초기 메시지 가져오기
  useEffect(() => {
    api.get(`/building/chat/room/${roomId}`).then(res => {
      setMessages(res.data);
    });
  }, [roomId]);

  // 2. 웹소켓 훅
  const { sendMessage, sendDeleteMessage, sendUpdateMessage } = useBuildingChat(
    roomId,
    user,
    (msg) => setMessages(prev => [...prev, msg]),                          // 새 메시지
    (deletedId) => setMessages(prev => prev.filter(m => m.id !== deletedId)), // 삭제
    (updatedMsg) => setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m)) // 수정
  );

  // 3. 스크롤 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleDelete = async (msg) => {
    await api.delete(`/building/chat/${msg.id}`);
    sendDeleteMessage(msg.id);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (newContent) => {
    if (!selectedMsg) return;
    const updated = await api.put(`/building/chat/${selectedMsg.id}`, newContent);
    sendUpdateMessage(updated.data || updated);
    setEditModalOpen(false);
  };

  const handleMessageClick = (msg) => {
    if (msg.userId !== user.id) return;
    setSelectedMsg(msg);
    setMenuOpen(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg h-[70%] bg-base-100 rounded-xl shadow-lg flex flex-col p-4 z-50">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* 참여자 프로필 */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {[...new Map(messages.map((msg) => [msg.userId, msg])).values()].map(msg => (
            <img
              key={msg.userId}
              src={msg.profileImage || "/images/defaultProfileImg.jpg"}
              alt={msg.nickname}
              className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer"
              title={msg.nickname}
            />
          ))}
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto mb-2 space-y-2 relative">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              <div
                className={`flex items-start gap-2 ${msg.userId === user.id ? "justify-end" : "justify-start"}`}
                onClick={() => handleMessageClick(msg)}
              >
                {msg.userId !== user.id && (
                  <img
                    src={msg.profileImage || "/images/defaultProfileImg.jpg"}
                    alt={msg.nickname}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    msg.userId === user.id
                      ? "ml-auto bg-primary/20 text-neutral"
                      : "mr-auto bg-gray-200 text-gray-800"
                  }`}
                >
                  <div className="text-xs font-semibold">{msg.nickname}</div>
                  <div>{msg.content}</div>
                  <div className="text-[10px] text-gray-500 text-right">
                    {new Date(msg.sentDate).toLocaleTimeString()}
                  </div>
                </div>
                {msg.userId === user.id && (
                  <img
                    src={msg.profileImage || "/images/defaultProfileImg.jpg"}
                    alt={msg.nickname}
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>

              {/* 수정/삭제/취소 버튼 */}
              {menuOpen && selectedMsg?.id === msg.id && (
                <div className="flex gap-1 mt-1 justify-end">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 bg-primary text-neutral rounded-lg text-sm hover:bg-primary/80"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(msg)}
                    className="px-3 py-1 bg-primary text-neutral rounded-lg text-sm hover:bg-primary/80"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-1 bg-primary text-neutral rounded-lg text-sm hover:bg-primary/80"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 */}
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
            className="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/80 transition"
          >
            전송
          </button>
        </div>
      </div>

      {/* 메시지 수정 모달 */}
      {editModalOpen && selectedMsg && (
        <EditMessageModal
          message={selectedMsg}
          onSave={handleSaveEdit}
          onCancel={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}