import { useEffect } from "react";
import useModal from "../hooks/useModal.js";

/**
 * 전역 Modal 컴포넌트 (알림/확인용)
 *
 * - 앱 전체에서 단일 ModalProvider로 상태 공유
 * - open, message, onConfirm, onCancel, showCancel, closeModal 훅 사용
 * - ESC / Enter 키, Backdrop 클릭, 확인/취소 버튼으로 모달 닫기 가능
 *
 * 사용 예시:
 * const { showModal } = useModal();
 * showModal("로그아웃 되었습니다.", () => navigate("/"));
 * showModal("삭제하시겠습니까?", onConfirm, onCancel); // 확인/취소 모달
 */
export default function Modal() {
  // 전역 훅으로 모달 상태와 닫기 함수 가져오기
  const { modal, closeModal } = useModal();
  const { open, message, onConfirm, onCancel, showCancel } = modal;

  // --------------------------
  // 키보드 이벤트 처리 (ESC, Enter)
  // --------------------------
  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (onCancel) onCancel();
        closeModal();
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (onConfirm) onConfirm();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onConfirm, onCancel, closeModal]);

  if (!open) return null;

  return (
    <>
      {/* --------------------------
          Backdrop
          - 모달 뒤 검은 반투명 배경
          - 클릭하면 모달 닫기
      -------------------------- */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={closeModal}
      />

      {/* --------------------------
          Modal Box
          - 메시지 출력
          - 확인 / 취소 버튼
      -------------------------- */}
      <div className="fixed inset-0 flex items-center justify-center z-[10000]">
        <div className="bg-base-100 rounded-3xl max-w-sm w-[90%] p-6 text-center shadow-xl animate-scaleIn">
          {/* 모달 메시지 */}
          <p className="text-neutral text-base font-medium mb-4">{message}</p>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-4">
            {/* 확인 버튼 */}
            <button
              className="btn btn-primary rounded-xl w-20 py-1"
              onClick={() => {
                if (onConfirm) onConfirm(); // onConfirm 콜백 실행
                closeModal(); // 모달 닫기
              }}
            >
              확인
            </button>

            {/* 취소 버튼 */}
            {showCancel && (
              <button
                className="btn rounded-xl w-20 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
                onClick={() => {
                  if (onCancel) onCancel(); // onCancel 콜백 실행
                  closeModal();
                }}
              >
                취소
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------
          모달 등장 애니메이션
      -------------------------- */}
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
