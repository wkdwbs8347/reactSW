import MenuButton from "../MenuButton";   
import BuildingRegisterModal from "../../pages/BuildingRegisterPage";

export default function ProfileLeft({ userInfo, setOpenModal, openModal }) {
  return (
    <div className="w-full md:w-1/3 space-y-6">
      {/* 프로필 영역 */}
      <div className="bg-secondary rounded-xl shadow-md p-6 space-y-4 text-center text-neutral">
        <div className="relative w-28 h-28 mx-auto">
          <img 
            src={userInfo.profileImage ?? "/images/Gemini_Generated_Image_h2232ih2232ih223 (1)-1024x576.png"}
            className="w-28 h-28 rounded-full object-cover border border-base-100"
          />
          <button className="absolute bottom-1 right-1 text-xs bg-base-100 px-2 py-1 rounded text-primary font-semibold">
            변경
          </button>
        </div>
        <p className="font-bold text-xl">{userInfo.nickname}</p>
        <p className="text-sm text-neutral">{userInfo.email}</p>
      </div>

      {/* 메뉴 버튼 */}
      <div className="bg-secondary rounded-xl shadow-md p-4 space-y-3">
        <MenuButton title="건물 관리" onClick={() => setOpenModal("building")} />
        <MenuButton title="입주 정보" onClick={() => setOpenModal("movein")} />
        <MenuButton title="입주 취소" onClick={() => setOpenModal("moveout")} />
        <MenuButton title="채팅방 관리" onClick={() => setOpenModal("chat")} />
        <MenuButton title="신고 내역" onClick={() => setOpenModal("reported")} />
        <MenuButton title="신고받은 내역" onClick={() => setOpenModal("reportedToMe")} />
      </div>

      {/* 건물 등록 모달 */}
      {openModal === "building" && (
        <BuildingRegisterModal
          userInfo={userInfo}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}