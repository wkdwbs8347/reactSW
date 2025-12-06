import { useState, useRef } from "react";
import api from "../api/axios";

export default function FindPwModal({ close, setLoginPw, showGlobalModal }) {
  // 입력값 상태
  const [loginId, setLoginIdLocal] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [code, setCode] = useState(""); 
  const [step, setStep] = useState("input"); // 'input' | 'verify' | 'result'
  const [tempPw, setTempPw] = useState(null); // 임시 비밀번호
  const [loading, setLoading] = useState(false); // 인증요청 로딩 상태

  // ref 설정
  const codeRef = useRef(null);
  const emailRef = useRef(null);
  const loginIdRef = useRef(null);

  // 인증요청 버튼 문구 결정하는 변수
  const sendBtnLabel =
    step === "input" ? "인증요청" : step === "verify" ? "재요청" : "인증완료";

  // 인증번호 요청
  const sendCode = async () => {
    if (step === "result") return; // 인증완료 상태에서는 실행 불가
    if (!email) {
      showGlobalModal?.("이메일을 입력해주세요.", () =>
        emailRef.current.focus()
      );
      return;
    }
    if (!loginId) {
      showGlobalModal?.("아이디를 입력해주세요.", () =>
        loginIdRef.current.focus()
      );
      return;
    }
    try {
      setLoading(true); // 로딩 시작
      await api.post("/user/emailSend", { email }); // 인증번호 전송 요청
      if (step !== "result") setStep("verify"); // 인증요청 성공 → step을 verify로 이동
      setTimeout(() => codeRef.current?.focus(), 100); // 포커스 이동
    } catch (err) {
      console.error(err);
      showGlobalModal?.(err.response?.data || "인증번호 전송에 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 인증번호 확인 및 임시 비밀번호 발급
  const verifyCode = async () => {
    if (!code) {
      showGlobalModal?.("인증번호를 입력해주세요.");
      return;
    }
    try {
      setLoading(true); // 로딩 시작
      await api.post("/user/emailVerify", { email, code }); // 인증번호 확인
      const res = await api.post("/user/reset-password", { loginId, email }); // 임시 비밀번호 발급
      const got = res.data?.tempPw ?? res.data?.temp_pw ?? null;
      setTempPw(got);
      setStep("result"); // 인증완료 단계
    } catch (err) {
      console.error(err);
      showGlobalModal?.(
        err.response?.data || "인증 또는 비밀번호 초기화에 실패했습니다."
      );
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 임시 비밀번호 사용
  const useThisPw = () => {
    if (tempPw) {
      setLoginPw(tempPw);
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 모달 배경 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 모달 본체 */}
      <div className="relative bg-base-100 rounded-2xl w-full max-w-md p-6 z-10 shadow-md text-neutral">
        <h2 className="text-xl font-semibold mb-4">비밀번호 찾기</h2>

        <div className="flex flex-col gap-3">
          {/* 아이디 입력 */}
          <input
            ref={loginIdRef}
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginIdLocal(e.target.value)}
            className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />

          {/* 이메일 입력 + 인증요청 버튼 */}
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
              onClick={sendCode}
              disabled={loading || step === "result"} // 인증완료 시 비활성화
              className="px-4 py-2 rounded-lg bg-primary text-neutral hover:bg-primary-focus transition"
            >
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                sendBtnLabel
              )}
            </button>
          </div>

          {/* 인증번호 입력 단계 */}
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
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-success text-white hover:bg-success-focus transition"
              >
                인증확인
              </button>
            </div>
          )}

          {/* 결과 단계 */}
          {step === "result" && tempPw && (
            <div className="mt-4 p-3 rounded-lg bg-secondary border border-base-100">
              <p className="mb-2">
                임시 비밀번호는{" "}
                <strong className="text-primary">{tempPw}</strong> 입니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={useThisPw}
                  className="px-4 py-2 rounded-lg bg-primary text-neutral hover:bg-primary-focus transition"
                >
                  이 비밀번호 사용하기
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

          {/* 취소 버튼 */}
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
  );
}