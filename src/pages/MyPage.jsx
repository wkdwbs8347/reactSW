import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import ProfileLeft from "../components/profile/ProfileLeft";

export default function MyPage() {
  const { loginUser } = useContext(LoginChkContext);

  if (!loginUser) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* ---------------------------
          왼쪽 메뉴 영역
          - 헤더 아래부터 시작
          - 화면 왼쪽에 고정
      --------------------------- */}
      <aside className="w-72 bg-secondary shadow-md fixed top-16 left-0 h-[calc(100%-4rem)] p-6 flex flex-col">
        <h1 className="text-2xl font-bold mt-4 mb-6 text-neutral">마이페이지</h1>
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