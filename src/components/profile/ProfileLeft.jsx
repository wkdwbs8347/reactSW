import { useNavigate, useLocation } from "react-router-dom";
import MenuButton from "../MenuButton";

export default function ProfileLeft() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 가져오기

  const menus = [
    { title: "프로필", path: "/mypage" },
    { title: "건물등록", path: "/mypage/buildingAdd" },
    { title: "멤버신청", path: "/mypage/move-in" },
    { title: "건물관리", path: "/mypage/building" },
    { title: "소속건물", path: "/mypage/resident" },
    { title: "우편함", path: "/mypage/message" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {menus.map((menu, idx) => {
        const isActive =
          menu.path === "/mypage"
            ? location.pathname === menu.path // 프로필은 정확히 일치
            : location.pathname === menu.path ||
              location.pathname.startsWith(menu.path + "/");
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
