import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import EditMessageModal from "./EditMessageModal";
import useBuildingChat from "../hooks/useBuildingChat";

export default function BuildingChatModal({ roomId, buildingName, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ⭐ UI 전용
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. DB에서 초기 메시지 가져오기
  useEffect(() => {
    api.get(`/building/chat/room/${roomId}`).then((res) => {
      setMessages(res.data);
    });
  }, [roomId]);

  // 2. 웹소켓 훅
  const { sendMessage, sendDeleteMessage, sendUpdateMessage } = useBuildingChat(
    roomId,
    user,
    (msg) => setMessages((prev) => [...prev, msg]),
    (deletedId) =>
      setMessages((prev) => prev.filter((m) => m.id !== deletedId)),
    (updatedMsg) =>
      setMessages((prev) =>
        prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m))
      )
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
    await api.delete(`/building/chat/delete/${msg.id}`);
    sendDeleteMessage(msg.id);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setEditModalOpen(true);
  };

const handleSaveEdit = async (newContent) => {
  if (!selectedMsg) return;

  const res = await api.put(
    `/building/chat/update/${selectedMsg.id}`,
    newContent
  );

  const updatedMsg = {
    ...selectedMsg,          // 기존 정보 유지
    content: newContent,     // 내용만 변경
    sentDate: res.data.sentDate ?? selectedMsg.sentDate, // 선택
  };

  sendUpdateMessage(updatedMsg);
  setEditModalOpen(false);
};

  const handleMessageClick = (msg) => {
    if (msg.userId !== user.id) return;
    setSelectedMsg(msg);
    setMenuOpen(true);
  };

  // ⭐ 참여자 목록 (중복 제거)
  const members = [...new Map(messages.map((m) => [m.userId, m])).values()];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg h-[70%] bg-base-100 rounded-xl shadow-lg flex flex-col z-50 overflow-hidden">
        {/* ===== 헤더 ===== */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-base-100">
          <button
            onClick={() => setShowMembers((prev) => !prev)}
            className="text-xl font-bold px-2"
          >
            ☰
          </button>

          <div className="flex-1 flex flex-col items-center justify-center leading-tight">
            <div className="font-semibold">{buildingName} 채팅방</div>
            <div className="text-xs text-gray-500">
              {members.length}명 참여중
            </div>
          </div>

          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="relative flex flex-1 overflow-hidden">
          {/* ===== 참여자 슬라이드 패널 ===== */}
          <div
            className={`absolute left-0 top-0 bottom-[58px] w-52 bg-base-200 border-r
  transform transition-transform duration-300 z-10
  ${showMembers ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="p-3 font-semibold border-b">참여자</div>
            <div className="p-2 space-y-2 overflow-y-auto">
              {members.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center gap-2 p-1 rounded hover:bg-base-300"
                >
                  <img
                    src={m.profileImage || "/images/defaultProfileImg.jpg"}
                    className="w-8 h-8 rounded-full"
                    alt={m.nickname}
                  />
                  <span className="text-sm">{m.nickname}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 채팅 영역 ===== */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-2 space-y-2 pr-2">
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <div
                    className={`flex items-start gap-2 ${
                      msg.userId === user.id ? "justify-end" : "justify-start"
                    }`}
                    onClick={() => handleMessageClick(msg)}
                  >
                    {msg.userId !== user.id && (
                      <img
                        src={
                          msg.profileImage || "/images/defaultProfileImg.jpg"
                        }
                        className="w-8 h-8 rounded-full"
                        alt={msg.nickname}
                      />
                    )}

                    <div
                      className={`p-2 rounded-lg max-w-xs ${
                        msg.userId === user.id
                          ? "bg-primary/20 text-neutral"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="text-xs font-semibold">
                        {msg.nickname}
                      </div>
                      <div>{msg.content}</div>
                      <div className="text-[10px] text-right text-gray-500">
                        {new Date(msg.sentDate).toLocaleTimeString()}
                      </div>
                    </div>

                    {msg.userId === user.id && (
                      <img
                        src={
                          msg.profileImage || "/images/defaultProfileImg.jpg"
                        }
                        className="w-8 h-8 rounded-full"
                        alt={msg.nickname}
                      />
                    )}
                  </div>

                  {menuOpen && selectedMsg?.id === msg.id && (
                    <div className="flex gap-1 mt-1 justify-end">
                      <button
                        onClick={handleEdit}
                        className="px-3 py-1 bg-primary text-neutral rounded text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(msg)}
                        className="px-3 py-1 bg-primary text-neutral rounded text-sm"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="px-3 py-1 bg-primary text-neutral rounded text-sm"
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="메시지를 입력하세요..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-primary text-neutral rounded"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>

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
