import { Link, useNavigate } from "react-router-dom";
import { Home, Key, Edit3, Bell } from "lucide-react"; // ⬅️ Bell 추가
import { LivelyCuteHouse } from "./LivelyCuteHouse";
import api from "../api/axios";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import { useContext, useEffect, useState } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import NotificationModal from "./NotificationModal"; // ⬅️ 알림 모달 import

export default function Header() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, loginUserNickname, setLoginUserNickname, loginUser } =
    useContext(LoginChkContext);
  const { modal, showModal, closeModal } = useModal();

  // -------------------------------
  // ✅ 추가: 알림 관련 state
  // -------------------------------
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (isLogin && loginUser) {
      api.get(`/residence/notifications/${loginUser.id}`)
        .then(res => setNotifications(res.data))
        .catch(() => showModal("알림 조회 중 오류가 발생했습니다."));
    }
  }, [isLogin, loginUser]);

  // -------------------------------
  // 기존 로그아웃 처리 함수
  // -------------------------------
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/doLogout");

      if (res.data.success) {
        setIsLogin(false);
        setLoginUserNickname("");

        showModal("로그아웃 되었습니다.", () => {
          navigate("/");
        });
      } else {
        showModal("로그아웃 처리에 실패했습니다. (응답 오류)", () => {
          navigate("/");
        });
      }
    } catch (err) {
      console.error("로그아웃 실패:", err);
      showModal("서버 오류로 로그아웃에 실패했습니다.", () => {
        navigate("/");
      });
    }
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

              {/* -------------------------------
                  ✅ 추가: 알림 버튼
              ------------------------------- */}
              <button
                className="relative px-3 py-1 rounded-full hover:bg-secondary transition"
                onClick={() => setShowNotif(true)}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 text-xs bg-red-500 text-white rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>
      </header>

      {/* -------------------------------
          ✅ 추가: 알림 모달
      ------------------------------- */}
      {showNotif && (
        <NotificationModal 
          notifications={notifications} 
          onClose={() => setShowNotif(false)} 
        />
      )}

      <Modal
        open={modal.open}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </>
  );
}