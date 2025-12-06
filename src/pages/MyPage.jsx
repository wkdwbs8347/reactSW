import { useEffect, useState } from "react";
import api from "../api/axios";
import useModal from "../hooks/useModal";
import { useNavigate } from "react-router-dom";
import ProfileLeft from "../components/profile/ProfileLeft";
import ProfileRight from "../components/profile/ProfileRight";

export default function MyPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // 모달 상태
  const [setOpenModal] = useState(null);

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

  if (!userInfo) 
    return (
      <div className="flex justify-center items-center h-screen text-neutral text-lg">
        로딩 중...
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto bg-base-100 p-6 rounded-xl shadow-md text-neutral">
      <ProfileLeft userInfo={userInfo} setOpenModal={setOpenModal} />
      <ProfileRight userInfo={userInfo} setOpenModal={setOpenModal} />
    </div>
  );
}