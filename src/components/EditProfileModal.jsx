import { useState } from "react";
import useModal from "../hooks/useModal";

export default function EditProfileModal({ userInfo, onClose }) {
  const [nickname, setNickname] = useState(userInfo.nickname);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { showModal } = useModal();

  const handleSubmit = () => {
    // 비밀번호 입력 시 확인 필수
    if (password !== "" || passwordConfirm !== "") {
      if (password !== passwordConfirm) {
        showModal("비밀번호가 일치하지 않습니다.", () => {});
        return; // 저장 중단
      }
    }

    // 추후 수정 API와 연결될 예정
    showModal("수정 기능은 준비 중입니다 👨‍🔧", onClose);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">회원정보 수정</h2>

        {/* 수정 가능: 닉네임 */}
        <label className="block mb-2">닉네임</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        {/* 수정 가능: 비밀번호 */}
        <label className="block mb-2">비밀번호 변경</label>
        <input
          type="password"
          placeholder="새 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        {/* 비밀번호 확인 */}
        <label className="block mb-2">비밀번호 확인</label>
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}