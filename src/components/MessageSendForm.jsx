import { useState } from "react";
import api from "../api/axios";
import useModal from "../hooks/useModal";

export default function MessageSendForm({ recipient, onClose }) {
  const { showModal } = useModal();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title || !content) {
      showModal("제목과 내용을 입력해주세요.");
      return;
    }

    setSending(true);
    try {
      await api.post("/message/send", {
        receiverId: recipient.userId,
        title,
        content,
      });

      showModal("메시지가 전송되었습니다.", onClose);
    } catch (err) {
      console.error(err);
      showModal("메시지 전송 실패");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-base-100 rounded-3xl max-w-sm w-[90%] p-6 flex flex-col gap-4 shadow-xl animate-scaleIn z-[10001]">
        <h2 className="text-lg font-bold text-neutral">To: {recipient.nickname}</h2>

        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-secondary text-neutral border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-secondary text-neutral border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
        />

        <div className="flex justify-end gap-3 mt-2">
          <button className="btn rounded-xl w-24 py-1 bg-brown_card text-brown_text hover:bg-brown_accent" onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary rounded-xl w-24 py-1" onClick={handleSend} disabled={sending}>
            {sending ? "전송중..." : "전송"}
          </button>
        </div>
      </div>
      <style>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}