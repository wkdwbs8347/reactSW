import { useContext, useState } from "react";
import { LoginChkContext } from "../../context/LoginChkContext";
import MenuButton from "../MenuButton";
import { useNavigate } from "react-router-dom";

export default function ProfileLeft() {
  const { loginUser } = useContext(LoginChkContext);
  const navigate = useNavigate(); 
  const [openBuildingMenu, setOpenBuildingMenu] = useState(false);
  const [openResidentMenu, setOpenResidentMenu] = useState(false);

  const commonMenus = [
    "건물등록",
    "입주신청",
    "신청내역",
    "건물관리",
    "내 건물 정보"
  ];

  const buildingSubMenus = [{ title: "등록한 건물 목록", path: "/owner/building-list" }];
  const residentSubMenus = [{ title: "입주한 건물 목록", path: "/resident/building-list" }];

  const handleMenuClick = (menu) => {
    if (menu === "건물관리") setOpenBuildingMenu(!openBuildingMenu);
    else if (menu === "내 건물 정보") setOpenResidentMenu(!openResidentMenu);
    else if (menu === "건물등록") navigate("/building/register");
    else if (menu === "입주신청") navigate("/move-in");
    else if (menu === "신청내역") navigate("/apply-list"); 
  };

  return (
    <div className="w-full md:w-1/3 space-y-6">
      {/* 프로필 영역 */}
      <div className="bg-secondary rounded-xl shadow-md p-6 space-y-4 text-center text-neutral">
        <div className="relative w-28 h-28 mx-auto">
          <img
            src={loginUser?.profileImage ?? "/images/default_profile.png"}
            className="w-28 h-28 rounded-full object-cover border border-base-100"
          />
          <button className="absolute bottom-1 right-1 text-xs bg-base-100 px-2 py-1 rounded text-primary font-semibold">
            변경
          </button>
        </div>
        <p className="font-bold text-xl">{loginUser?.nickname ?? "Guest"}</p>
        <p className="text-sm text-neutral">{loginUser?.email ?? "-"}</p>
      </div>

      {/* 메뉴 버튼 */}
      <div className="bg-secondary rounded-xl shadow-md p-4 space-y-3">
        {commonMenus.map((menu, idx) =>
          menu === "건물관리" ? (
            <div key={idx}>
              <MenuButton title={menu} onClick={() => handleMenuClick(menu)} />
              {openBuildingMenu && (
                <div className="pl-4 mt-2 space-y-2">
                  {buildingSubMenus.map((sub, subIdx) => (
                    <MenuButton
                      key={subIdx}
                      title={sub.title}
                      onClick={() => navigate(sub.path)} // 경로 그대로 유지
                    />
                  ))}
                </div>
              )}
            </div>
          ) : menu === "내 건물 정보" ? (
            <div key={idx}>
              <MenuButton title={menu} onClick={() => handleMenuClick(menu)} />
              {openResidentMenu && (
                <div className="pl-4 mt-2 space-y-2">
                  {residentSubMenus.map((sub, subIdx) => (
                    <MenuButton
                      key={subIdx}
                      title={sub.title}
                      onClick={() => navigate(sub.path)} // 경로 그대로 유지
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <MenuButton key={idx} title={menu} onClick={() => handleMenuClick(menu)} />
          )
        )}
      </div>
    </div>
  );
}