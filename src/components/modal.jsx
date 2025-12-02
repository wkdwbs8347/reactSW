import { useEffect } from "react";
export default function Modal({ open, message, onConfirm, onClose }) {
  {
    /*
    showModal()을 호출하면 open이 true가 되면서 모달창이 뜨고
    확인버튼 누르면 버튼클릭 이벤트로 onClose()가 호출되는데 onClose() 안에는 모달 훅의
    const closeModal = () => {
      setModal({
        open: false,
        message: "",
        onConfirm: null,
      });
    }; 가 들어 있다
    */
  }
  // ESC 또는 Enter 키로 모달 닫기
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.key === "Escape" || e.key === "Enter") && open) {
        e.preventDefault(); // 엔터키 눌렀을때 다시 submit 이벤트 발생하는거 막음
        onConfirm();  // Enter이나 Esc로 꺼도 포커스 이동
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onConfirm, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-[90%] p-6 text-center transform animate-scaleIn">
          <p className="text-gray-800 text-base font-medium mb-4">{message}</p>

          <div className="flex justify-center gap-4">
            <button
              className="px-5 py-2 rounded-xl bg-purple-400 hover:bg-fuchsia-500 text-white font-semibold transition"
              onClick={() => {
                onClose();
                if (onConfirm) onConfirm();
              }}
            >
              확인
            </button>
          </div>
        </div>
      </div>

      {/* 애니메이션 */}
      <style jsx>{`
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
