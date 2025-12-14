import { Link, useNavigate } from "react-router-dom";
import { Home, Key, Edit3, Bell } from "lucide-react";
import { LivelyCuteHouse } from "./LivelyCuteHouse";
import api from "../api/axios";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import { useContext, useState } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import NotificationModal from "./NotificationModal";
import useNotificationWebSocket from "../hooks/useNotificationWebSocket";

export default function Header() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, loginUserNickname, setLoginUserNickname, loginUser } =
    useContext(LoginChkContext);
  const { modal, showModal, closeModal } = useModal();
  const [showNotif, setShowNotif] = useState(false);

  // WebSocket 알림 Hook
  const { notifications, markAsRead, markAllNotificationsAsRead } = useNotificationWebSocket(
    isLogin && loginUser ? loginUser.id : null
  );

  // 실시간 안 읽은 알림 수
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/doLogout");
      if (res.data.success) {
        setIsLogin(false);
        setLoginUserNickname("");
        showModal("로그아웃 되었습니다.", () => navigate("/"));
      } else {
        showModal("로그아웃 처리에 실패했습니다.", () => navigate("/"));
      }
    } catch (err) {
      console.error(err);
      showModal("서버 오류로 로그아웃에 실패했습니다.", () => navigate("/"));
    }
  };

  const handleOpenNotifications = () => {
    setShowNotif(true);
  };

  return (
    <>
      <header className="bg-base-100 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <Link
          to="/"
          className="font-extrabold text-2xl text-neutral hover:text-primary transition transform hover:scale-105"
        >
          Sweet Home <LivelyCuteHouse />
        </Link>

        {isLogin && <span className="text-neutral font-medium">안녕하세요, {loginUserNickname}님!</span>}

        <nav className="flex gap-6 text-neutral font-medium items-center">
          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-secondary transition"
          >
            <Home size={18} /> 홈
          </Link>

          {!isLogin && (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-secondary transition"
              >
                <Key size={18} /> 로그인
              </Link>
              <Link
                to="/join"
                className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-secondary transition"
              >
                <Edit3 size={18} /> 회원가입
              </Link>
            </>
          )}

          {isLogin && (
            <>
              <Link
                to="/mypage"
                className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-secondary transition"
              >
                <Edit3 size={18} /> 마이페이지
              </Link>
              <Link
                to="#"
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-secondary transition"
              >
                <Key size={18} /> 로그아웃
              </Link>

              <button
                className="relative px-3 py-1 rounded-full hover:bg-secondary transition"
                onClick={handleOpenNotifications}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 text-xs bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>
      </header>

      {showNotif && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotif(false)}
          markAsRead={markAsRead}
          markAllNotificationsAsRead={markAllNotificationsAsRead}
        />
      )}

      <Modal open={modal.open} message={modal.message} onConfirm={modal.onConfirm} onClose={closeModal} />
    </>
  );
}