import { useNavigate, useLocation } from "react-router-dom";
import MenuButton from "../MenuButton";

export default function ProfileLeft() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 가져오기

  const menus = [
    { title: "프로필", path: "/mypage" },
    { title: "건물등록", path: "/mypage/building/register" },
    { title: "멤버신청", path: "/mypage/move-in" },
    { title: "건물관리", path: "/mypage/buildings" },
    { title: "내 건물 정보", path: "/mypage/resident" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {menus.map((menu, idx) => {
        const isActive = location.pathname === menu.path; // 현재 경로와 비교
        return (
          <MenuButton
            key={idx}
            title={menu.title}
            onClick={() => navigate(menu.path)}
            isActive={isActive} // 활성화 상태 전달
          />
        );
      })}
    </div>
  );
}
