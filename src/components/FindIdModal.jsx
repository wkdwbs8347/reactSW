import { useState, useRef } from "react";
import api from "../api/axios";
import useModal from "../hooks/useModal"; // ⭐ 모달 훅 추가
import Modal from "./Modal"; // ⭐ 모달 컴포넌트 추가

export default function FindIdModal({ close, setLoginId, showGlobalModal }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'verify' | 'result'
  const [foundId, setFoundId] = useState(null);
  const [loading, setLoading] = useState(false); // 인증요청 로딩 상태

  const { modal, showModal, closeModal } = useModal();

  const sendBtnLabel =
    step === "input" ? "인증요청" : step === "verify" ? "재요청" : "인증완료";

  const codeRef = useRef(null);
  const sendBtnRef = useRef(null);
  const emailRef = useRef(null);
  const userNameRef = useRef(null);

  const sendCode = async () => {
    if (step === "result") return; // 인증완료 상태에서는 실행 불가

    if (!email) {
      showGlobalModal?.("이메일을 입력해주세요.", () =>
        emailRef.current.focus()
      );
      return;
    }

    if (!userName) {
      showGlobalModal?.("이름을 입력해주세요.", () =>
        userNameRef.current.focus()
      );
      return;
    }
    try {
      setLoading(true); // 로딩 시작
      await api.post("/user/emailSend", { email }); // 인증번호 전송 요청
      if (step !== "result") setStep("verify"); // 인증요청 성공 → step을 verify로 이동
      showModal("인증번호가 전송되었습니다.", () => codeRef.current?.focus());
    } catch (err) {
      console.error(err);
      showGlobalModal?.(err.response?.data || "인증번호 전송에 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const verifyCode = async () => {
    if (!code) {
      showGlobalModal?.("인증번호를 입력해주세요.");
      return;
    }
    try {
      setLoading(true); // 로딩 시작
      await api.post("/user/emailVerify", { email, code });
      // 인증 성공 시 -> 아이디 찾기 API 호출
      const res = await api.get("/user/find-id", {
        params: { userName, email },
      });
      setFoundId(res.data); // assume backend returns plain string (loginId)
      setStep("result"); // 인증완료 단계
    } catch (err) {
      console.error(err);
      showGlobalModal?.(
        err.response?.data || "인증 또는 아이디 조회에 실패했습니다."
      );
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const useThisId = () => {
    if (foundId) {
      setLoginId(foundId);
      close();
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

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative bg-base-100 rounded-2xl w-full max-w-md p-6 z-10 shadow-md text-neutral">
          <h2 className="text-xl font-semibold mb-4">아이디 찾기</h2>

          <div className="flex flex-col gap-3">
            <input
              ref={userNameRef}
              type="text"
              placeholder="이름"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            <div className="flex gap-2">
              <input
                ref={emailRef}
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                ref={sendBtnRef}
                onClick={sendCode}
                disabled={loading || step === "result"} // 인증완료 시 비활성화
                className="px-4 py-2 rounded-lg bg-primary text-neutral hover:bg-primary-focus transition"
              >
                {loading ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  sendBtnLabel // 문구 자동 변화
                )}
              </button>
            </div>

            {step === "verify" && (
              <div className="flex gap-2 items-center">
                <input
                  ref={codeRef}
                  type="text"
                  placeholder="인증번호 입력"
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  onClick={verifyCode}
                  disabled={loading} // 비활성화
                  className="px-4 py-2 rounded-lg bg-success text-white hover:bg-success-focus transition"
                >
                  인증확인
                </button>
              </div>
            )}

            {/* 결과 영역: 인증 성공 시 바로 표시 */}
            {step === "result" && foundId && (
              <div className="mt-4 p-3 rounded-lg bg-secondary border border-base-100">
                <p className="mb-2">
                  회원님의 아이디는{" "}
                  <strong className="text-primary">{foundId}</strong> 입니다.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={useThisId}
                    className="px-4 py-2 rounded-lg bg-primary text-neutral hover:bg-primary-focus transition"
                  >
                    이 아이디 사용하기
                  </button>
                  <button
                    onClick={close}
                    className="px-4 py-2 rounded-lg border border-base-100 hover:bg-base-200 transition"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={close}
                className="px-4 py-2 rounded-lg border border-base-100 hover:bg-base-200 transition"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}