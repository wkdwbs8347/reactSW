import { useContext, useState } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import useMessageWebSocket from "../hooks/useMessageWebSocket";
import { useNavigate } from "react-router-dom";
import { FiMail, FiInbox } from "react-icons/fi"; 
import api from "../api/axios";

export default function MessageListPage() {
  const { loginUser } = useContext(LoginChkContext);
  const { messages, setMessages } = useMessageWebSocket(loginUser?.id);
  const navigate = useNavigate();

  const itemsPerPage = 4;
  const buttonsPerBlock = 5;

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem("currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [pageSelections, setPageSelections] = useState({});

  // 현재 totalPages 계산
  const totalPages = Math.ceil(messages.length / itemsPerPage);

  // currentPage가 totalPages보다 크면 렌더링 시 안전하게 조정
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentItems = messages.slice(startIndex, startIndex + itemsPerPage);

  const currentBlock = Math.ceil(safeCurrentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  const selectedMessages = Object.values(pageSelections).flat();

  const handleSelectMessage = (messageId) => {
    setPageSelections((prev) => {
      const currentSelections = prev[safeCurrentPage] || [];
      const updated = currentSelections.includes(messageId)
        ? currentSelections.filter((id) => id !== messageId)
        : [...currentSelections, messageId];
      return { ...prev, [safeCurrentPage]: updated };
    });
  };

  const handleSelectAll = () => {
    const currentPageSelections = currentItems.map((m) => m.id);
    setPageSelections((prev) => {
      const newSelections =
        prev[safeCurrentPage]?.length === currentPageSelections.length
          ? { ...prev, [safeCurrentPage]: [] }
          : { ...prev, [safeCurrentPage]: currentPageSelections };
      return newSelections;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedMessages.length === 0) return;

    try {
      await api.delete("/message/delete/batch", { data: selectedMessages }); // Axios DELETE + body
      setMessages((prev) =>
        prev.filter((m) => !selectedMessages.includes(m.id))
      );
      setPageSelections({});

      // 삭제 후 currentPage 조정 (안전하게)
      const newTotalPages = Math.ceil(
        (messages.length - selectedMessages.length) / itemsPerPage
      );
      if (safeCurrentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    } catch (err) {
      console.error("메시지 삭제 실패:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    sessionStorage.setItem("currentPage", page);
  };

  const handleMessageClick = async (id, event) => {
    if (event.target.type !== "checkbox") {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: 1 } : m))
      );

      try {
        await api.patch(`/message/read/${id}`);
      } catch (err) {
        console.error("메시지 읽음 처리 실패:", err);
      }

      navigate(`/mypage/message/${id}`);
    }
  };

  return (
    <div className="p-4 bg-brown_bg text-brown_text mx-auto rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-neutral mb-6">메시지</h2>

      {messages.length === 0 ? (
        <div className="text-neutral-500 text-center py-10">
          받은 메시지가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {/* 테이블 헤더 */}
          <div className="flex items-center border-b border-brown-200 py-3 px-2 mb-4 rounded-t-lg bg-brown_bg/50">
            <input
              type="checkbox"
              checked={
                currentItems.length ===
                  (pageSelections[safeCurrentPage] || []).length &&
                currentItems.length > 0
              }
              onChange={handleSelectAll}
              className="checkbox checkbox-primary mr-4 flex-shrink-0"
            />
            <div className="w-[200px] font-semibold text-neutral truncate">
              제목
            </div>
            <div className="flex-1 font-semibold text-neutral ml-16 truncate">
              보낸사람
            </div>
            <div className="w-32 font-semibold text-neutral ml-4 truncate">
              날짜
            </div>
          </div>

          {/* 메시지 리스트 */}
          <ul className="space-y-3">
            {currentItems.map((m) => (
              <li
                key={m.id}
                className={`
                  flex items-center p-4 rounded-xl border border-brown-200 shadow-sm transition-all cursor-pointer
                  ${m.isRead ? "bg-base-100 text-gray-400" : "bg-primary/10 text-brown_text font-bold"}
                  hover:shadow-lg hover:bg-primary/20
                `}
                onClick={(event) => handleMessageClick(m.id, event)}
              >
                <input
                  type="checkbox"
                  checked={pageSelections[safeCurrentPage]?.includes(m.id) || false}
                  onChange={() => handleSelectMessage(m.id)}
                  className="checkbox checkbox-accent mr-4 flex-shrink-0"
                />

                {/* 제목 + 아이콘 */}
                <div className="flex items-center w-[200px] min-w-0 mr-4">
                  {m.isRead ? (
                    <FiInbox className="text-gray-400 mr-2 flex-shrink-0" size={20} />
                  ) : (
                    <FiMail className="text-red-500 mr-2 animate-pulse flex-shrink-0" size={20} />
                  )}
                  <span className="truncate">{m.title}</span>
                </div>

                {/* 보낸사람 */}
                <div className="flex-1 text-sm text-brown_accent truncate ml-12">
                  {m.senderName}
                </div>

                {/* 날짜 */}
                <div className="w-32 text-xs text-neutral-400 ml-4">
                  {m.sentDate}
                </div>
              </li>
            ))}
          </ul>

          <button
            className="btn btn-danger w-full mt-4 rounded-xl bg-brown_accent text-white"
            onClick={handleDeleteSelected}
            disabled={selectedMessages.length === 0}
          >
            선택된 메시지 삭제
          </button>
        </div>
      )}

      {/* 페이징 */}
      <div className="flex space-x-2 justify-center mt-4">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition"
          disabled={startPage === 1}
          onClick={() => handlePageChange(startPage - 1)}
        >
          ◀
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx).map(
          (page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-2xl transition-all ${
                page === safeCurrentPage
                  ? "bg-primary text-white"
                  : "bg-primary/20 text-neutral hover:bg-primary/40"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition"
          disabled={endPage === totalPages}
          onClick={() => handlePageChange(endPage + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}