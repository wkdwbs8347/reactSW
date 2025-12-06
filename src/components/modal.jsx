import { useEffect } from "react";
import useModal from "../hooks/useModal.js";

/**
 * 전역 Modal 컴포넌트 (알림/확인용)
 *
 * - 앱 전체에서 단일 ModalProvider로 상태 공유
 * - open, message, onConfirm, closeModal 훅 사용
 * - ESC / Enter 키, Backdrop 클릭, 확인 버튼으로 모달 닫기 가능
 *
 * 사용 예시:
 * const { showModal } = useModal();
 * showModal("로그아웃 되었습니다.", () => navigate("/"));
 */
export default function Modal() {
  // 전역 훅으로 모달 상태와 닫기 함수 가져오기
  const { modal, closeModal } = useModal();
  const { open, message, onConfirm } = modal;

  // --------------------------
  // 키보드 이벤트 처리 (ESC, Enter)
  // --------------------------
  useEffect(() => {
    // 모달이 열려있을 때만 키 이벤트 처리
    const handleKey = (e) => {
      if ((e.key === "Escape" || e.key === "Enter") && open) {
        e.preventDefault(); // Enter 눌러서 form submit되는 걸 막음

        // Enter 또는 ESC 키 눌렀을 때 onConfirm 실행
        if (onConfirm) onConfirm();

        // 모달 닫기
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKey);

    // Cleanup: 컴포넌트 언마운트 시 이벤트 제거
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onConfirm, closeModal]);

  // 모달이 닫혀있으면 렌더링하지 않음
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
          - 확인 버튼
      -------------------------- */}
      <div className={`fixed inset-0 flex items-center justify-center z-[10000]`}>
        <div className="bg-base-100 rounded-3xl max-w-sm w-[90%] p-6 text-center shadow-xl animate-scaleIn">
          {/* 모달 메시지 */}
          <p className="text-neutral text-base font-medium mb-4">{message}</p>

          {/* 확인 버튼 */}
          <button
            className="btn btn-primary rounded-xl"
            onClick={() => {
              if (onConfirm) onConfirm(); // onConfirm 콜백 실행
              closeModal();    // 모달 닫기
            }}
          >
            확인
          </button>
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