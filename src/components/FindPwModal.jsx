import { useState, useRef } from "react";
import api from "../api/axios";

export default function FindPwModal({ close, setLoginPw, showGlobalModal }) {
  const [loginId, setLoginIdLocal] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("input"); // 'input' | 'verify' | 'result'
  const [tempPw, setTempPw] = useState(null);
  const [loading, setLoading] = useState(false); // 인증요청 로딩 상태

  const codeRef = useRef(null);
  const emailRef = useRef(null);
  const loginIdRef = useRef(null);

  // 인증요청 버튼 문구 결정하는 변수
  const sendBtnLabel =
    step === "input" ? "인증요청" : step === "verify" ? "재요청" : "인증완료";

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
      await api.post("/user/emailSend", { email });
      if (step !== "result") setStep("verify"); // 인증요청 성공 → step을 verify로 이동
      // 포커스 이동
      setTimeout(() => codeRef.current?.focus(), 100);
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
      // 인증 성공 -> 임시 비밀번호 발급 API 호출
      const res = await api.post("/user/reset-password", {
        loginId,
        email,
      });
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

  const useThisPw = () => {
    if (tempPw) {
      setLoginPw(tempPw);
      close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 z-10 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">비밀번호 찾기</h2>

        <div className="flex flex-col gap-3">
          <input
            ref={loginIdRef}
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginIdLocal(e.target.value)}
            className="p-3 rounded-lg border"
          />

          <div className="flex gap-2">
            <input
              ref={emailRef}
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-3 rounded-lg border"
            />
            <button
              onClick={sendCode}
              disabled={loading || step === "result"} // 인증완료 시 비활성화
              className="px-4 py-2 rounded-lg bg-purple-500 text-white"
            >
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                sendBtnLabel // 상태에 따른 문구 자동 변화
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
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-3 rounded-lg border"
              />
              <button
                onClick={verifyCode}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-500 text-white"
              >
                {loading ? (
                  <span className="loading loading-dots loading-sm"></span>
                ) : (
                  "인증확인"
                )}
              </button>
            </div>
          )}

          {step === "result" && tempPw && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border">
              <p className="mb-2">
                임시 비밀번호는{" "}
                <strong className="text-purple-600">{tempPw}</strong> 입니다.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={useThisPw}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white"
                >
                  이 비밀번호 사용하기
                </button>
                <button onClick={close} className="px-4 py-2 rounded-lg border">
                  닫기
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={close} className="px-4 py-2 rounded-lg border">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
