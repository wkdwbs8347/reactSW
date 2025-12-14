import { useContext, useState, useEffect } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import useMessageWebSocket from "../hooks/useMessageWebSocket";
import { useNavigate } from "react-router-dom"; // useNavigate 추가

export default function MessageListPage() {
  const { loginUser } = useContext(LoginChkContext);
  const { messages, setMessages } = useMessageWebSocket(loginUser?.id);
  const navigate = useNavigate(); // navigate 훅 추가

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 페이지당 표시할 항목 수
  const buttonsPerBlock = 5; // 한 번에 보여줄 페이지 버튼 수

  // 전체 선택 상태와 선택된 메시지들을 저장하는 상태
  const [pageSelections, setPageSelections] = useState({}); // 각 페이지에 대한 선택된 메시지 상태

  // 페이징 처리
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = messages.slice(startIndex, startIndex + itemsPerPage);

  const currentBlock = Math.ceil(currentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  // 페이지에 선택된 메시지들을 하나로 합침
  const selectedMessages = Object.values(pageSelections).flat();

  const handleSelectMessage = (messageId) => {
    setPageSelections((prevSelections) => {
      const currentPageSelections = prevSelections[currentPage] || [];
      const updatedSelections = currentPageSelections.includes(messageId)
        ? currentPageSelections.filter((id) => id !== messageId)
        : [...currentPageSelections, messageId];

      return {
        ...prevSelections,
        [currentPage]: updatedSelections, // 해당 페이지의 선택된 메시지들만 업데이트
      };
    });
  };

  const handleSelectAll = () => {
    const currentPageSelections = currentItems.map((m) => m.id);
    setPageSelections((prevSelections) => {
      const newSelections =
        prevSelections[currentPage]?.length === currentPageSelections.length
          ? { ...prevSelections, [currentPage]: [] } // 전체 선택 해제
          : { ...prevSelections, [currentPage]: currentPageSelections }; // 새 페이지로 이동 시 전체 선택

      return newSelections;
    });
  };

  const handleDeleteSelected = () => {
    // 삭제 처리 로직: 서버에 삭제 요청 보내기 (여기서는 간단히 state에서 삭제 예시)
    setMessages((prevMessages) =>
      prevMessages.filter((m) => !selectedMessages.includes(m.id))
    );
    setPageSelections({}); // 전체 페이지에서 선택 상태 리셋
  };

  // 페이지 변경 시 선택 상태를 리셋
  const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 이동
    sessionStorage.setItem("currentPage", page); // 현재 페이지를 sessionStorage에 저장
  };

  // 메시지 상세페이지로 이동
  const handleMessageClick = (id, event) => {
    console.log(id);
    // 이벤트 전파 방지: 체크박스를 클릭할 때는 페이지 이동이 일어나지 않도록 막기
    if (event.target.type !== "checkbox") {
      // 클릭한 메시지의 ID를 이용해 상세페이지로 이동
      navigate(`/mypage/message/${id}`); // id = 메세지 고유 id
    }
  };

  // 컴포넌트가 처음 로드될 때, 이전에 저장된 페이지 정보를 가져옴
  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      setTimeout(() => {
        setCurrentPage(parseInt(savedPage, 10)); // 저장된 페이지로 설정
      }, 0); // 비동기적으로 상태 업데이트
    }
  }, []); // 빈 배열을 넣어서 첫 렌더링시에만 실행되도록 설정

  return (
    <div className="p-4 bg-brown_bg text-brown_text mx-auto">
      <h2 className="text-2xl font-semibold text-brown_accent mb-6">메시지</h2>

      {messages.length === 0 ? (
        <div className="text-neutral-500 text-center py-10">
          받은 메시지가 없습니다.
        </div>
      ) : (
        <div>
          {/* 테이블 헤더 */}
          <div className="flex items-center justify-between border-b py-3 mb-4">
            <input
              type="checkbox"
              checked={currentItems.length === (pageSelections[currentPage] || []).length}
              onChange={handleSelectAll}
              className="checkbox checkbox-primary ml-4"
            />
            <span className="w-1/3 font-semibold text-brown_accent ml-8">제목</span>
            <span className="w-1/3 font-semibold text-brown_accent ml-14">보낸사람</span>
            <span className="w-1/3 font-semibold text-brown_accent ml-6">날짜</span>
          </div>

          {/* 메시지 리스트 */}
          <ul className="space-y-3">
            {currentItems.map((m) => (
              <li
                key={m.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  m.isRead ? "bg-base-100" : "bg-primary/10"
                } hover:bg-primary/20 cursor-pointer`} // 호버 시 배경색 변경 및 손 모양 커서
                onClick={(event) => handleMessageClick(m.id, event)} // 메시지 항목 클릭 시 상세페이지로 이동
              >
                {/* 체크박스 */}
                <input
                  type="checkbox"
                  checked={pageSelections[currentPage]?.includes(m.id)}
                  onChange={() => handleSelectMessage(m.id)}
                  className="checkbox checkbox-accent mr-4"
                />
                {/* 제목 텍스트가 길어져도 영역이 고정됨 */}
                <div className="w-full max-w-[250px] font-medium text-brown_text ml-4 truncate flex-shrink-0">{m.title}</div>
                <div className="w-1/3 text-sm text-brown_accent ml-4">{m.senderName}</div>
                <div className="w-1/3 text-xs text-neutral-400 ml-4">{m.sentDate}</div>
              </li>
            ))}
          </ul>

          {/* 삭제 버튼 */}
          <button
            className="btn btn-danger w-full mt-4 rounded-xl bg-brown_accent text-white"
            onClick={handleDeleteSelected}
            disabled={selectedMessages.length === 0} // 선택된 메시지가 없으면 비활성화
          >
            선택된 메시지 삭제
          </button>
        </div>
      )}

      {/* 페이징 하단 고정 */}
      <div className="flex space-x-2 justify-center mt-4">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition"
          disabled={startPage === 1}
          onClick={() => handlePageChange(startPage - 1)} // 페이지 변경 시 선택 해제
        >
          ◀
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, idx) => startPage + idx
        ).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded-2xl transition-all ${
              page === currentPage
                ? "bg-primary text-white"
                : "bg-primary/20 text-neutral hover:bg-primary/40"
            }`}
            onClick={() => handlePageChange(page)} // 페이지 변경 시 선택 해제
          >
            {page}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition"
          disabled={endPage === totalPages}
          onClick={() => handlePageChange(endPage + 1)} // 페이지 변경 시 선택 해제
        >
          ▶
        </button>
      </div>
    </div>
  );
}