import { useNavigate } from "react-router-dom";
import MenuButton from "../MenuButton";

export default function ProfileLeft() {
  const navigate = useNavigate();

  const menus = [
    { title: "프로필", path: "/mypage" },
    { title: "건물등록", path: "/mypage/building/register" },
    { title: "멤버신청", path: "/mypage/move-in" },
    { title: "신청내역", path: "/mypage/apply-list" },
    { title: "건물관리", path: "/mypage/buildings" },
    { title: "내 건물 정보", path: "/mypage/resident" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {menus.map((menu, idx) => (
        <MenuButton
          key={idx}
          title={menu.title}
          onClick={() => navigate(menu.path)}
        />
      ))}
    </div>
  );
}
