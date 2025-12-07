import { useState } from "react";
import ProfileField from "./ProfileField";
import EditIdModal from "../edit/EditIdModal"; // 아이디 수정 모달
import EditNicknameModal from "../edit/EditNicknameModal"; // 닉네임 수정 모달
import EditEmailModal from "../edit/EditEmailModal"; // 이메일 수정 모달
import EditPwdModal from "../edit/EditPwdModal"; // 비밀번호 수정 모달

export default function ProfileRight({ userInfo, setUserInfo }) {
  const [openModal, setOpenModal] = useState(null); // 현재 열린 모달 상태

  return (
    <div className="w-full md:w-2/3 bg-secondary rounded-xl shadow-md p-8 space-y-6 text-neutral">
      <h1 className="text-xl font-bold">프로필</h1>

      {/* ==================== 아이디 ==================== */}
      <ProfileField
        label="아이디"
        value={userInfo.loginId}
        editable
        onEdit={() => setOpenModal("editId")}
      />
      {openModal === "editId" && (
        <EditIdModal
          currentId={userInfo.loginId}
          onClose={() => setOpenModal(null)}
          onUpdate={(newId) => setUserInfo({ ...userInfo, loginId: newId })}
        />
      )}

      {/* ==================== 닉네임 ==================== */}
      <ProfileField
        label="닉네임"
        value={userInfo.nickname}
        editable
        onEdit={() => setOpenModal("editNickname")}
      />
      {openModal === "editNickname" && (
        <EditNicknameModal
          currentNickname={userInfo.nickname}
          onClose={() => setOpenModal(null)}
          onUpdate={(newNickname) =>
            setUserInfo({ ...userInfo, nickname: newNickname })
          }
        />
      )}

      {/* ==================== 이메일 ==================== */}
      <ProfileField
        label="이메일"
        value={userInfo.email}
        editable
        onEdit={() => setOpenModal("editEmail")}
      />
      {openModal === "editEmail" && (
        <EditEmailModal
          currentEmail={userInfo.email}
          onClose={() => setOpenModal(null)}
          onUpdate={(newEmail) => setUserInfo({ ...userInfo, email: newEmail })}
        />
      )}

      {/* ==================== 비밀번호 ==================== */}
      <ProfileField
        label="비밀번호"
        value="********"
        editable
        onEdit={() => setOpenModal("editPwd")}
      />
      {openModal === "editPwd" && (
        <EditPwdModal onClose={() => setOpenModal(null)} />
      )}

      {/* ==================== 가입일 ==================== */}
      <ProfileField label="가입일" value={userInfo.regDate} />

      {/* ==================== 생년월일 ==================== */}
      <ProfileField label="생년월일" value={userInfo.birth} />
    </div>
  );
}
