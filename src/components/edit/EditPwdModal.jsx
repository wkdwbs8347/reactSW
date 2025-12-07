import { useState, useRef } from "react";
import api from "../../api/axios";
import useModal from "../../hooks/useModal";

export default function EditPwdModal({ onClose }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const { showModal } = useModal();

  const currentPwRef = useRef(null);
  const newPwRef = useRef(null);
  const newPw2Ref = useRef(null);

  const onSave = async () => {
    if (!currentPw) {
      showModal("현재 비밀번호를 입력해주세요", () =>
        currentPwRef.current.focus()
      );
      return;
    } else if (currentPw === newPw) {
      showModal("같은 비밀번호로는 변경할 수 없습니다", () =>
        newPwRef.current.focus()
      );
      setNewPw("");
      setNewPw2("");
      return;
    }

    if (!newPw) {
      showModal("새 비밀번호를 입력해주세요", () => newPwRef.current.focus());
      return;
    }

    if (newPw !== newPw2) {
      showModal("새 비밀번호가 일치하지 않습니다", () =>
        newPw2Ref.current.focus()
      );
      return;
    }

    try {
      const res = await api.put("/user/updatePassword", {
        currentPw,
        newPw,
      });

      showModal(res.data.message, onClose);
    } catch (err) {
      showModal(err.response?.data?.message || "변경 실패", () =>
        currentPwRef.current.focus()
      );
      setCurrentPw("");
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center z-[9999]">
        <div className="pointer-events-auto bg-base-100 p-6 rounded-2xl w-full max-w-md shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">비밀번호 변경</h1>

          <input
            ref={currentPwRef}
            type="password"
            placeholder="현재 비밀번호"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="flex-1 p-3 w-full rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-3"
          />

          <input
            ref={newPwRef}
            type="password"
            placeholder="새 비밀번호"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="flex-1 p-3 w-full rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-3"
          />

          <input
            ref={newPw2Ref}
            type="password"
            placeholder="새 비밀번호 확인"
            value={newPw2}
            onChange={(e) => setNewPw2(e.target.value)}
            className="flex-1 p-3 w-full rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-6"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              취소
            </button>

            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
