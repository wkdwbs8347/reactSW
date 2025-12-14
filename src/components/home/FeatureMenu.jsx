import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building2, MessageCircle } from "lucide-react";
import { LoginChkContext } from "../../context/LoginChkContext";
import useModal from "../../hooks/useModal";

export default function FeatureMenu() {
  const navigate = useNavigate();
  const { isLogin } = useContext(LoginChkContext);
  const { showModal } = useModal();

  const menus = [
    {
      id: 1,
      label: "건물등록",
      icon: <Building2 size={72} />,
      action: () => {
        if (!isLogin) {
          showModal("로그인이 필요한 서비스입니다.", () => navigate("/login"));
          return;
        }
        navigate("/buildingAdd");
      },
    },

    {
      id: 2,
      label: "멤버신청",
      icon: <Home size={72} />,
      action: () => {
        if (!isLogin) {
          showModal("로그인이 필요한 서비스입니다.", () => navigate("/login"));
          return;
        }
        navigate("/move-in"); 
      },
    },

    {
      id: 3,
      label: "채팅방",
      icon: <MessageCircle size={72} />,
      action: () => {},
    },
  ];

  return (
    <section className="flex justify-center gap-10 mt-12 flex-wrap">
      {menus.map((m) => (
        <div
          key={m.id}
          className="
            w-64 h-64
            bg-base-100
            rounded-3xl
            shadow-xl
            border border-base-300
            flex flex-col items-center justify-center
            cursor-pointer
            transition-all
            hover:bg-primary/20
            hover:scale-105
          "
          onClick={m.action}
        >
          <div className="text-primary mb-4">{m.icon}</div>
          <span className="font-bold text-xl text-neutral">{m.label}</span>
        </div>
      ))}
    </section>
  );
}
