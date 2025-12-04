import { useEffect, useState } from "react";
import api from "../api/axios";
import useModal from "../hooks/useModal";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";

export default function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { showModal } = useModal();

  // 마운트 시 로그인한 유저 정보 불러오기
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
  }, [showModal, navigate]);

  if (!userInfo)
    return <div className="text-white text-lg">로딩 중...</div>;

  return (
    <div className="bg-white/20 p-8 rounded-2xl shadow-lg backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-6">마이페이지</h1>

      {/* 프로필 이미지 */}
      <div className="mb-4">
        <img
          src={userInfo.profileImage || "/images/default-profile.png"}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
      </div>

      <div className="space-y-2">
        <p><b>아이디:</b> {userInfo.loginId}</p>
        <p><b>이메일:</b> {userInfo.email}</p>
        <p><b>닉네임:</b> {userInfo.nickname}</p>
        <p><b>가입일:</b> {userInfo.regDate}</p>
      </div>

      <button
        onClick={() => {
          // 추후 업데이트 API가 준비되면 setOpenEditModal(true)로 대체
          setOpenEditModal(true);
        }}
        className="mt-6 px-5 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
      >
        회원정보 수정
      </button>

      {/* 닉네임/비밀번호 수정 모달 (추후 완성 예정) */}
      {openEditModal && (
        <EditProfileModal
          userInfo={userInfo}
          onClose={() => setOpenEditModal(false)}
        />
      )}
    </div>
  );
}