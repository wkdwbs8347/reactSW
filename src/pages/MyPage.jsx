import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import ProfileLeft from "../components/profile/ProfileLeft";
import useModal from "../hooks/useModal";

export default function MyPage() {
  const { loginUser, loading } = useContext(LoginChkContext);
  const navigate = useNavigate();
  const { showModal } = useModal();


  // 로그인 체크 완료 후 처리
  useEffect(() => {
    if (!loading && !loginUser) {
      showModal("로그인이 필요합니다.", () => navigate("/login"));  
    }
  }, [loading, loginUser, navigate, showModal]);

  if (loading) return <p>Loading...</p>; // 체크 중일 때 로딩 표시
  if (!loginUser) return null; // 로그인 안 됐으면 렌더링 안 함

  return (
    <div className="flex min-h-screen">
      {/* ---------------------------
          왼쪽 메뉴 영역
          - 헤더 아래부터 시작
          - 화면 왼쪽에 고정
      --------------------------- */}
      <aside className="w-72 bg-secondary shadow-md fixed top-16 left-0 h-[calc(100%-4rem)] p-6 flex flex-col">
        <h1 className="text-2xl font-bold mt-4 mb-6 text-neutral">
          마이페이지
        </h1>
        <ProfileLeft />
      </aside>

      {/* ---------------------------
          오른쪽 페이지 영역
          - 왼쪽 메뉴 너비만큼 margin-left
          - App 전체 배경과 자연스럽게 연결
      --------------------------- */}
      <main className="flex-1 ml-72 p-8">
        <Outlet context={{ userInfo: loginUser }} />
      </main>
    </div>
  );
}
