import { useNavigate } from "react-router-dom";

export default function NotificationModal({
  notifications,
  onClose,
  markAsRead,
  markAllNotificationsAsRead,
}) {
  const navigate = useNavigate();

  const handleClick = (n) => {
    // 1) 알림 페이지 이동 (n.link가 이미 /mypage로 시작하므로 추가하지 않음)
    const path = n.link;  // n.link 그대로 사용

    navigate(path);  // 해당 경로로 이동

    // 2) 읽음 처리 후 목록에서 제거
    markAsRead(n.id);  // 알림의 id를 전달

    // 3) 모달 닫기
    onClose();
  };

  const handleMarkAllAsRead = () => {
    // "모두 읽음" 처리 후 목록에서 모두 제거
    markAllNotificationsAsRead();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex justify-center items-center z-[10000]">
        <div className="bg-base-100 rounded-3xl max-w-xs w-[90%] p-6 shadow-xl animate-scaleIn">
          <h2 className="font-bold text-lg mb-3 text-center">알림</h2>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="text-center py-6 text-neutral-500">새 알림이 없습니다.</li>
            )}
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-3 border-b cursor-pointer text-neutral hover:bg-base-200 transition ${n.isRead ? "text-neutral/50" : ""}`}
                onClick={() => handleClick(n)}  // 클릭 시 알림 id 전달
              >
                {n.message}
              </li>
            ))}
          </ul>

          {/* 버튼을 가로로 중앙 배치 */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="btn btn-primary w-1/2 rounded-xl"
              onClick={handleMarkAllAsRead}
            >
              모두 읽음
            </button>

            <button
              className="btn btn-secondary w-1/2 rounded-xl"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
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
    </>
  );
}