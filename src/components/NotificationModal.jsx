import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// 알림 리스트를 모달로 보여주는 컴포넌트
// props:
//  - notifications : 알림 배열
//  - onClose : 모달 닫기 함수
export default function NotificationModal({ notifications, onClose }) {

  const navigate = useNavigate();

  // 알림 항목을 클릭했을 때 실행되는 함수
  const handleClick = (n) => {
    let path = n.link.replace("/owner", "/mypage");

    // 1) 알림이 지정한 화면으로 이동
    navigate(path);

    // 2) 알림 읽음 처리 API 호출
    api.put(`/residence/notifications/mark-read/${n.id}`)
      .catch(console.error);

    // 3) 모달 닫기
    onClose();
  };

  return (
    <>
      {/* ================================
        클릭 시 모달 닫히는 배경
      ================================= */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* ================================
        모달 박스 위치 (가운데 정렬)
      ================================= */}
      <div className="fixed inset-0 flex justify-center items-center z-[10000]">

        {/* 모달 실제 UI 박스 */}
        <div className="bg-base-100 rounded-3xl max-w-xs w-[90%] p-6 shadow-xl animate-scaleIn">

          {/* 모달 제목 */}
          <h2 className="font-bold text-lg mb-3 text-center">알림</h2>

          {/* 알림 리스트 영역 */}
          <ul className="max-h-60 overflow-y-auto">
            {/* 알림 없을 때 UI */}
            {notifications.length === 0 && (
              <li className="text-center py-6 text-neutral-500">
                새 알림이 없습니다.
              </li>
            )}

            {/* 알림 리스트 표출 */}
            {notifications.map((n) => (
              <li
                key={n.id}
                // hover = 배경 변경
                className="p-3 border-b cursor-pointer text-neutral hover:bg-base-200 transition"

                // 클릭 시 링크 이동 + 읽음 처리 + 모달 닫기
                onClick={() => handleClick(n)}
              >
                {n.message}
              </li>
            ))}
          </ul>

          {/* 모달 닫기 버튼 */}
          <button
            className="btn btn-primary w-full rounded-xl mt-4"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>

      {/* ================================
        모달 열릴 때 scale-in 애니메이션
      ================================= */}
      <style>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}