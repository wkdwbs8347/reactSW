import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useModal from "../../hooks/useModal";
import { LoginChkContext } from "../../context/LoginChkContext";

export default function CallToAction() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { isLogin } = useContext(LoginChkContext);

  return (
    <section className="py-24 text-center">
      <h2 className="text-3xl font-bold mb-8">
        지금 바로 Sweet Home을 시작하세요
      </h2>

      <div className="flex justify-center gap-6">
        {/* 회원가입 */}
        <button
          onClick={() => {
            if (isLogin) {
              showModal("이미 로그인 상태입니다.");
              return;
            }
            navigate("/join");
          }}
          className="px-10 py-4 bg-primary text-white rounded-3xl text-lg font-semibold hover:scale-105 transition"
        >
          회원가입
        </button>

        {/* 로그인 */}
        <button
          onClick={() => {
            if (isLogin) {
              showModal("이미 로그인 상태입니다.");
              return;
            }
            navigate("/login");
          }}
          className="px-10 py-4 border-2 border-primary text-primary rounded-3xl text-lg font-semibold hover:bg-primary/10 transition"
        >
          로그인
        </button>
      </div>
    </section>
  );
}