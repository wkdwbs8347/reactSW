import { Link, useNavigate } from "react-router-dom";
import { Home, Key, Edit3 } from "lucide-react";
import { LivelyCuteHouse } from "./LivelyCuteHouse";
import api from "../api/axios";
import useModal from "../hooks/useModal";
import Modal from "./Modal";
import { useContext } from "react";
import { LoginChkContext } from "../context/LoginChkContext";

export default function Header() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, loginUserNickname, setLoginUserNickname } =
    useContext(LoginChkContext);
  // useModal 훅 사용
  const { modal, showModal, closeModal } = useModal();

  // 1. 로그아웃 처리 함수 정의
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/doLogout");

      if (res.data.success) {
        setIsLogin(false);
        setLoginUserNickname("");

        // onConfirm에는 모달 확인 버튼 클릭 시 실행할 함수(페이지 이동)를 넣습니다.
        showModal("로그아웃 되었습니다.", () => {
          navigate("/");
        });
      } else {
        // success가 false일 때의 처리
        showModal("로그아웃 처리에 실패했습니다. (응답 오류)", () => {
          navigate("/");
        });
      }
    } catch (err) {
      console.error("로그아웃 실패:", err);
      showModal("서버 오류로 로그아웃에 실패했습니다.", () => {
        navigate("/"); // 실패 시 홈으로 이동
      });
    }
  };

  return (
    <>
      <header className="bg-transparent shadow-none p-4 flex justify-between items-center sticky top-0 z-50">
        <Link
          to="/"
          className="font-extrabold text-2xl text-purple-600 hover:text-pink-500 transition transform hover:scale-105"
        >
          Sweet Home <LivelyCuteHouse />
        </Link>
        {isLogin && <span>안녕하세요, {loginUserNickname}님!</span>}
        <nav className="flex gap-6 text-purple-500 font-medium">
          <Link
            to="/"
            className="flex items-center font-bold gap-1 p-1 rounded-full hover:bg-purple-100/30 transition transform hover:scale-105 shadow-sm"
          >
            <Home size={18} /> 홈
          </Link>
          {!isLogin && (
            <>
              <Link
                to="/login"
                className="flex items-center font-bold gap-1 p-1 rounded-full hover:bg-pink-100/30 transition transform hover:scale-105 shadow-sm"
              >
                <Key size={18} /> 로그인
              </Link>

              <Link
                to="/join"
                className="flex items-center font-bold gap-1 p-1 rounded-full hover:bg-indigo-100/30 transition transform hover:scale-105 shadow-sm"
              >
                <Edit3 size={18} /> 회원가입
              </Link>
            </>
          )}
          {/* 로그아웃 버튼: onClick 이벤트로 POST 요청 실행 */}
          {isLogin && (
            <>
              <Link
                to="/mypage"
                className="flex items-center font-bold gap-1 p-1 rounded-full hover:bg-indigo-100/30 transition transform hover:scale-105 shadow-sm"
              >
                <Edit3 size={18} /> 마이페이지
              </Link>
              <Link
                to="#" // 라우팅을 막기 위해 '#' 사용
                onClick={handleLogout} // ⬅️ 클릭 시 로그아웃 로직 실행
                className="flex items-center font-bold gap-1 p-1 rounded-full hover:bg-pink-100/30 transition transform hover:scale-105 shadow-sm"
              >
                <Key size={18} /> 로그아웃
              </Link>
            </>
          )}
        </nav>
      </header>

      <Modal
        open={modal.open}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </>
  );
}
