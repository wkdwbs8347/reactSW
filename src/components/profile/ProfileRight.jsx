import { useState, useContext } from "react";
import ProfileField from "./ProfileField";
import EditIdModal from "../edit/EditIdModal";
import EditNicknameModal from "../edit/EditNicknameModal";
import EditEmailModal from "../edit/EditEmailModal";
import EditPwdModal from "../edit/EditPwdModal";
import { LoginChkContext } from "../../context/LoginChkContext";

export default function ProfileRight() {
  const { loginUser, setLoginUser } = useContext(LoginChkContext);
  const [openModal, setOpenModal] = useState(null);

  if (!loginUser) return <div>Loading...</div>; // 안전하게 렌더링

  return (
    <div className="bg-secondary rounded-xl shadow-md p-8 space-y-6 text-neutral">

      {/* 프로필 상단 */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <img
          src={loginUser.profileImage ?? "/images/default_profile.png"}
          className="w-20 h-20 rounded-full object-cover border"
          alt="프로필"
        />
        <div>
          <div className="font-bold text-xl">{loginUser.nickname}</div>
          <div className="text-sm text-neutral">{loginUser.email}</div>
        </div>
      </div>

      {/* 아이디 */}
      <ProfileField
        label="아이디"
        value={loginUser.loginId}
        editable
        onEdit={() => setOpenModal("editId")}
      />
      {openModal === "editId" && (
        <EditIdModal
          currentId={loginUser.loginId}
          onClose={() => setOpenModal(null)}
          onUpdate={(newId) =>
            setLoginUser({ ...loginUser, loginId: newId })
          }
        />
      )}

      {/* 닉네임 */}
      <ProfileField
        label="닉네임"
        value={loginUser.nickname}
        editable
        onEdit={() => setOpenModal("editNickname")}
      />
      {openModal === "editNickname" && (
        <EditNicknameModal
          currentNickname={loginUser.nickname}
          onClose={() => setOpenModal(null)}
          onUpdate={(newNickname) =>
            setLoginUser({ ...loginUser, nickname: newNickname })
          }
        />
      )}

      {/* 이메일 */}
      <ProfileField
        label="이메일"
        value={loginUser.email}
        editable
        onEdit={() => setOpenModal("editEmail")}
      />
      {openModal === "editEmail" && (
        <EditEmailModal
          currentEmail={loginUser.email}
          onClose={() => setOpenModal(null)}
          onUpdate={(newEmail) =>
            setLoginUser({ ...loginUser, email: newEmail })
          }
        />
      )}

      {/* 비밀번호 */}
      <ProfileField
        label="비밀번호"
        value="********"
        editable
        onEdit={() => setOpenModal("editPwd")}
      />
      {openModal === "editPwd" && (
        <EditPwdModal onClose={() => setOpenModal(null)} />
      )}

      {/* 가입일 */}
      <ProfileField label="가입일" value={loginUser.regDate} />

      {/* 생년월일 */}
      <ProfileField label="생년월일" value={loginUser.birth} />
    </div>
  );
}