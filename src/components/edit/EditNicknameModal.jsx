import { useState, useRef } from "react";
import api from "../../api/axios";
import useModal from "../../hooks/useModal";

export default function EditNicknameModal({
  currentNickname,
  onClose,
  onUpdate,
}) {
  const { showModal } = useModal();

  const [nickname, setNickname] = useState(currentNickname);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [isComposing, setIsComposing] = useState(false);

  const nicknameRef = useRef(null);

  // ==========================
  // 닉네임 중복체크
  // ==========================
  const checkNickname = async () => {
    setNicknameCheckMessage("");
    setIsNicknameAvailable(null);

    if (!nickname || nickname.trim().length === 0) {
      setNicknameCheckMessage("닉네임은 필수 입력 정보입니다.");
      setIsNicknameAvailable(false);
      return;
    }

    if (nickname.trim().length < 2) {
      setNicknameCheckMessage("닉네임은 2글자 이상이어야 합니다.");
      setIsNicknameAvailable(false);
      return;
    }

    try {
      const res = await api.get("/user/checkNickname", {
        params: { nickname },
      });
      if (res.data.available) {
        setNicknameCheckMessage("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      } else {
        setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameAvailable(false);
      }
    } catch (err) {
      console.error("닉네임 체크 실패:", err);
      setNicknameCheckMessage("닉네임 중복체크 중 오류가 발생했습니다.");
      setIsNicknameAvailable(false);
    }
  };

  // ==========================
  // 수정 submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNicknameAvailable) {
      showModal("닉네임 중복체크를 해주세요.", () => {
        nicknameRef.current.focus();
      });
      return;
    }

    try {
      const res = await api.put("/user/updateNickname", { nickname });

      if (res.status === 200) {
        onUpdate(nickname);
        onClose();
        showModal(res.data.message);
      } else {
        showModal("닉네임 수정에 실패했습니다.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "서버 오류로 닉네임 수정에 실패했습니다.";
      showModal(msg);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/30">
      <form
        className="bg-base-100 p-6 rounded-2xl w-full max-w-md shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-6">닉네임 수정</h1>

        <div className="flex gap-2">
          <input
            ref={nicknameRef}
            type="text"
            value={nickname}
            maxLength={10}
            placeholder="닉네임"
            onFocus={() => {
              setNicknameCheckMessage("한글 / 영문 / 숫자 입력 가능");
              setIsNicknameAvailable(null);
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              setNickname(e.target.value.replace(/[^가-힣a-zA-Z0-9]/g, ""));
            }}
            onChange={(e) => {
              if (!isComposing) {
                setNickname(e.target.value.replace(/[^가-힣a-zA-Z0-9]/g, ""));
              } else {
                setNickname(e.target.value);
              }
            }}
            onBlur={checkNickname}
            className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />

          <button
            type="button"
            onClick={checkNickname}
            className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus"
          >
            중복체크
          </button>
        </div>

        <p
          className={`text-sm mt-2 ${
            isNicknameAvailable == null
              ? "text-gray-500"
              : isNicknameAvailable
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {nicknameCheckMessage}
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700"
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
  );
}
