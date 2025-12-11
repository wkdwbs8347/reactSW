import { useState, useContext } from "react";
import ProfileField from "./ProfileField"; // 기존 컴포넌트 가정
import ProfileImageModal from "./ProfileImageModal";
import EditIdModal from "../edit/EditIdModal";
import EditNicknameModal from "../edit/EditNicknameModal";
import EditEmailModal from "../edit/EditEmailModal";
import EditPwdModal from "../edit/EditPwdModal";
import { LoginChkContext } from "../../context/LoginChkContext";

export default function ProfileRight() {
  const { loginUser, setLoginUser } = useContext(LoginChkContext);
  const [openModal, setOpenModal] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

  if (!loginUser) return <div>Loading...</div>;

  return (
    <div className="bg-secondary rounded-xl shadow-md p-8 space-y-6 text-neutral">
      {/* 프로필 상단 */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="relative">
          <img
            src={loginUser.profileImage || "/images/default_profile.png"}
            className="w-20 h-20 rounded-full object-cover border"
            alt="프로필"
          />
          <button
            className="absolute bottom-0 right-0 bg-primary rounded-full p-1"
            onClick={() => setOpenImageModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M16 3a2.828 2.828 0 114 4L7 21H3v-4L16 3z" />
            </svg>
          </button>
        </div>

        <div>
          <div className="font-bold text-xl ml-7">{loginUser.nickname}</div>
          <div className="text-sm text-neutral ml-7">{loginUser.email}</div>
        </div>
      </div>

      {/* ProfileImageModal */}
      {openImageModal && (
        <ProfileImageModal
          currentImage={loginUser.profileImage}
          onClose={() => setOpenImageModal(false)}
          onSave={(newImageUrl) => setLoginUser({ ...loginUser, profileImage: newImageUrl })}
        />
      )}

      {/* 나머지 ProfileField, 수정 모달 */}
      <ProfileField label="아이디" value={loginUser.loginId} editable onEdit={() => setOpenModal("editId")} />
      {openModal === "editId" && (
        <EditIdModal
          currentId={loginUser.loginId}
          onClose={() => setOpenModal(null)}
          onUpdate={(newId) => setLoginUser({ ...loginUser, loginId: newId })}
        />
      )}

      <ProfileField label="닉네임" value={loginUser.nickname} editable onEdit={() => setOpenModal("editNickname")} />
      {openModal === "editNickname" && (
        <EditNicknameModal
          currentNickname={loginUser.nickname}
          onClose={() => setOpenModal(null)}
          onUpdate={(newNickname) => setLoginUser({ ...loginUser, nickname: newNickname })}
        />
      )}

      <ProfileField label="이메일" value={loginUser.email} editable onEdit={() => setOpenModal("editEmail")} />
      {openModal === "editEmail" && (
        <EditEmailModal
          currentEmail={loginUser.email}
          onClose={() => setOpenModal(null)}
          onUpdate={(newEmail) => setLoginUser({ ...loginUser, email: newEmail })}
        />
      )}

      <ProfileField label="비밀번호" value="********" editable onEdit={() => setOpenModal("editPwd")} />
      {openModal === "editPwd" && <EditPwdModal onClose={() => setOpenModal(null)} />}

      <ProfileField label="가입일" value={loginUser.regDate} />
      <ProfileField label="생년월일" value={loginUser.birth} />
    </div>
  );
}