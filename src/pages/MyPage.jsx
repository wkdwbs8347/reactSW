import { useEffect, useState } from "react";
import api from "../api/axios";
import useModal from "../hooks/useModal";
import { useNavigate } from "react-router-dom";

// 모달들 import
import BuildingRegisterModal from "../components/BuildingRegisterModal";
import MoveInModal from "../components/MoveInModal";
import MoveOutModal from "../components/MoveOutModal";
import ChatRoomModal from "../components/ChatRoomModal";
import ReportedListModal from "../components/ReportedListModal";
import ReportedToMeModal from "../components/ReportedToMeModal";
import EditProfileModal from "../components/EditProfileModal";

export default function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // 모달 상태
  const [openModal, setOpenModal] = useState(null);

  const { showModal } = useModal();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/user/loginCheck");

        if (res.data.isLogin) {
          setUserInfo(res.data.loginUser);
        } else {
          showModal("로그인이 필요합니다.", () => navigate("/login"));
        }
      } catch (err) {
        console.error(err);
        showModal("회원 정보를 가져오는 데 실패했습니다.");
      }
    }
    fetchUser();
  }, [navigate, showModal]);

  if (!userInfo) return <div className="text-white text-lg">로딩 중...</div>;

  return (
    <div className="bg-white/20 p-8 rounded-2xl shadow-lg backdrop-blur-md max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{userInfo.nickname} 님</h1>

        <button
          onClick={() => setOpenModal("edit")}
          className="text-sm px-4 py-2 bg-purple-400 text-white rounded-lg shadow hover:bg-purple-600 transition"
        >
          회원정보 수정
        </button>
      </div>

      {/* 프로필 이미지 */}
      <div className="mb-4">
        <img
          src={userInfo.profileImage || "/images/default-profile.png"}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
      </div>

      {/* 유저 정보 */}
      <div className="space-y-2 mb-6">
        <p>
          <b>아이디:</b> {userInfo.loginId}
        </p>
        <p>
          <b>이메일:</b> {userInfo.email}
        </p>
        <p>
          <b>닉네임:</b> {userInfo.nickname}
        </p>
        <p>
          <b>가입일:</b> {userInfo.regDate}
        </p>
      </div>

      {/* 메뉴 버튼들 */}
      <div className="grid grid-cols-2 gap-4 mt-8 text-center">
        <MenuButton title="건물 등록" onClick={() => setOpenModal("building")}/>
        <MenuButton title="입주 신청" onClick={() => setOpenModal("movein")} />
        <MenuButton title="입주 취소" onClick={() => setOpenModal("moveout")} />
        <MenuButton title="채팅방 입장" onClick={() => setOpenModal("chat")} />
        <MenuButton title="신고 내역" onClick={() => setOpenModal("reported")}/>
        <MenuButton title="신고받은 내역" onClick={() => setOpenModal("reportedToMe")}/>
      </div>

      {/* 선택된 모달 렌더링 */}
      {openModal === "building" && (
        <BuildingRegisterModal
          userInfo={userInfo}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === "movein" && (
        <MoveInModal userInfo={userInfo} onClose={() => setOpenModal(null)} />
      )}

      {openModal === "moveout" && (
        <MoveOutModal userInfo={userInfo} onClose={() => setOpenModal(null)} />
      )}

      {openModal === "chat" && (
        <ChatRoomModal userInfo={userInfo} onClose={() => setOpenModal(null)} />
      )}

      {openModal === "reported" && (
        <ReportedListModal
          userInfo={userInfo}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === "reportedToMe" && (
        <ReportedToMeModal
          userInfo={userInfo}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === "edit" && (
        <EditProfileModal
          userInfo={userInfo}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}

function MenuButton({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/30 text-black p-4 rounded-xl shadow hover:bg-white/50 transition font-semibold"
    >
      {title}
    </button>
  );
}
