// 마이페이지 아이디 수정 모달
import { useState, useRef } from "react";
import api from "../../api/axios";
import useModal from "../../hooks/useModal";

export default function EditIdModal({ currentId, onClose, onUpdate }) {
  const { showModal } = useModal();

  const [loginId, setLoginId] = useState(currentId);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(null);

  const loginIdRef = useRef(null);

  // ==========================
  // 아이디 중복체크
  // ==========================
  const checkLoginId = async () => {
    setIdCheckMessage("");
    setIsIdAvailable(null);

    if (!loginId || loginId.trim().length === 0) {
      setIdCheckMessage("아이디는 필수 입력 정보입니다.");
      setIsIdAvailable(false);
      return;
    }

    if (loginId.trim().length < 4) {
      setIdCheckMessage("아이디는 4글자 이상이어야 합니다.");
      setIsIdAvailable(false);
      return;
    }

    try {
      const res = await api.get("/user/checkId", { params: { loginId } });
      if (res.data.available) {
        setIdCheckMessage("사용 가능한 아이디입니다.");
        setIsIdAvailable(true);
      } else {
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
        setIsIdAvailable(false);
      }
    } catch (err) {
      console.error("아이디 체크 실패:", err);
      setIdCheckMessage("아이디 중복체크 중 오류가 발생했습니다.");
    }
  };

  // ==========================
  // 아이디 수정 제출
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdAvailable) {
      showModal("아이디 중복체크를 해주세요.", () => {
        loginIdRef.current.focus();
      });
      return;
    }

    try {
      const res = await api.put("/user/updateId", { loginId });
      if (res.status === 200) {
        onUpdate(loginId); // 상위 상태 업데이트
        onClose(); // EditIdModal 닫기
        showModal("아이디가 수정되었습니다."); // 전역 알림
      } else {
        showModal("아이디 수정에 실패했습니다.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "서버 오류로 아이디 수정에 실패했습니다.";
      showModal(msg);
    }
  };

  return (
    <>
      {/* 모달 배경 영향 최소화 */}
      <div className="fixed inset-0 flex justify-center items-center z-[9999] pointer-events-auto">
        <div className="pointer-events-auto bg-base-100 p-6 rounded-2xl w-full max-w-md shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">아이디 수정</h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                ref={loginIdRef}
                type="text"
                placeholder="아이디"
                value={loginId}
                maxLength={20}
                onFocus={() => {
                  setIdCheckMessage("영문 / 숫자 입력 가능");
                  setIsIdAvailable(null);
                }}
                onChange={(e) =>
                  setLoginId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
                className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={checkLoginId}
                className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus"
              >
                중복체크
              </button>
            </div>

            <p
              className={`text-sm ${
                isIdAvailable === null
                  ? "text-gray-500"
                  : isIdAvailable
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {idCheckMessage}
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus"
              >
                수정
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
