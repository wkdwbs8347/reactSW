import { useState, useRef, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";
import Modal from "../components/Modal";
import { LoginChkContext } from "../context/LoginChkContext";
import FindIdModal from "../components/FindIdModal";
import FindPwModal from "../components/FindPwModal";

export default function Login() {
  const navigate = useNavigate();
  const { modal, showModal, closeModal } = useModal();
  const { setIsLogin, setterLoginId, setLoginUserNickname } =
    useContext(LoginChkContext);

  // 아이디, 비밀번호
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // DOM 접근용
  const loginIdRef = useRef(null);
  const loginPwRef = useRef(null);

  // 아이디/비밀번호 찾기 모달
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginId) {
      showModal("아이디를 입력해주세요.", () => loginIdRef.current.focus());
      return;
    }
    if (!loginPw) {
      showModal("비밀번호를 입력해주세요.", () => loginPwRef.current.focus());
      return;
    }

    try {
      const res = await api.post("/user/login", { loginId, loginPw });

      if (res.data.loginChk === true) {
        setIsLogin(true);
        setterLoginId(loginId);
        setLoginUserNickname(res.data.loginUser.nickname);
        showModal("로그인 성공!", () => navigate("/"));
      } else {
        showModal("아이디 또는 비밀번호가 일치하지 않습니다.");
        setLoginPw("");
      }
    } catch (err) {
      console.error(err);
      showModal("서버 오류로 로그인 실패");
    }
  };

  return (
    <>
      {/* 공용 모달 */}
      <Modal
        open={modal.open}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />

      {/* 아이디 찾기 모달 */}
      {showFindId && (
        <FindIdModal
          close={() => setShowFindId(false)}
          setLoginId={setLoginId}
          showGlobalModal={(msg, cb) => showModal(msg, cb)}
        />
      )}

      {/* 비밀번호 찾기 모달 */}
      {showFindPw && (
        <FindPwModal
          close={() => setShowFindPw(false)}
          setLoginPw={setLoginPw}
          showGlobalModal={(msg, cb) => showModal(msg, cb)}
        />
      )}

      {/* 로그인 폼 */}
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-base-100 p-6 rounded-3xl w-full max-w-md shadow-md text-neutral">
          {/* 타이틀 */}
          <h1 className="text-3xl font-bold mb-6 text-center">로그인</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 아이디 */}
            <input
              ref={loginIdRef}
              type="text"
              placeholder="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            {/* 비밀번호 */}
            <input
              ref={loginPwRef}
              type="password"
              placeholder="비밀번호"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="
    px-6 py-3
    mt-2
    bg-primary text-neutral
    rounded-2xl
    font-semibold
    shadow-lg
    transition
    transform
    hover:scale-105
    hover:bg-primary-focus
  "
            >
              로그인
            </button>
          </form>

          {/* 메뉴 */}
          <div className="flex justify-center gap-4 mt-4 text-sm text-neutral">
            <button
              onClick={() => setShowFindId(true)}
              className="transition-transform duration-200 hover:text-primary hover:scale-105"
            >
              아이디 찾기
            </button>
            <span>|</span>
            <button
              onClick={() => setShowFindPw(true)}
              className="transition-transform duration-200 hover:text-primary hover:scale-105"
            >
              비밀번호 찾기
            </button>
            <span>|</span>
            <button
              onClick={() => navigate("/join")}
              className="transition-transform duration-200 hover:text-primary hover:scale-105"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
