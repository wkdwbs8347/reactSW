import { useState, useRef } from "react";
import api from "../api/axios"; // axios 불러오기
import { useNavigate } from "react-router-dom"; // 페이지 이동 관리 라이브러리
import useModal from "../hooks/useModal"; // ⭐ modal hook추가
import Modal from "../components/modal"; // ⭐ modal 컴포넌트 추가

export default function Login() {
  const navigate = useNavigate(); // 페이지 이동 관리 함수
  const { modal, showModal, closeModal } = useModal(); // 모달 훅

  const [loginId, setLoginId] = useState(""); // 아이디
  const [loginPw, setLoginPw] = useState(""); // 비밀번호

  const loginIdRef = useRef(null);
  const loginPwRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출시 브라우저가 페이지 새로고침 하려는걸 막음 (비동기 처리를 위함)

    // 아이디 비밀번호 입력 안했을때 검증
    if (!loginId) {
      showModal("아이디를 입력해주세요.", () => {
        loginIdRef.current.focus();
      });
      return;
    }
    if (!loginPw) {
      showModal("비밀번호를 입력해주세요.", () => {
        loginPwRef.current.focus();
      });
      return;
    }

    try {
      // 백엔드 서버로 보낼 데이터 / 유저가 입력한 아이디와 비밀번호
      const userInput = {
        loginId,
        loginPw,
      };

      // 아이디와 패스워드를 백엔드 서버로 전송 / 서버에서 검증 후 boolean 타입 데이터 반환
      const res = await api.post("/user/login", userInput);
      if (
        (res.status === 200 || res.status === 201) &&
        res.data.loginChk === true
      ) {
        showModal("로그인 성공", () => navigate("/"));
      } else {
        showModal("아이디 또는 비밀번호가 일치하지 않습니다."); 
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      const msg =
        err.response?.data?.message || "서버 오류로 로그인에 실패했습니다.";
      showModal(msg);
    }
  };

  return (
    <>
      <Modal
        open={modal.open}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl w-full max-w-md shadow-md">
          <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
            로그인
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 아이디 */}
            <input
              ref={loginIdRef}
              type="text"
              placeholder="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="p-3 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
            />

            {/* 비밀번호 */}
            <input
              ref={loginPwRef}
              type="password"
              placeholder="비밀번호"
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              className="p-3 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
            />

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 mt-2 rounded-3xl shadow-md hover:scale-105 transition active:scale-95"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
