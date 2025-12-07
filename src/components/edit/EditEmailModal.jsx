import { useState, useRef } from "react";
import api from "../../api/axios";
import useModal from "../../hooks/useModal";

export default function EditEmailModal({ currentEmail, onClose, onUpdate }) {
  const { showModal } = useModal();

  const [email, setEmail] = useState(currentEmail || "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("input"); // input | verify | result
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const codeRef = useRef(null);

  const sendBtnLabel =
    step === "input" ? "인증요청" : step === "verify" ? "재요청" : "인증완료";

  // helper: 공백 제거하고 소문자로 정규화 (비교용)
  const normalize = (s) => (s ? s.trim().toLowerCase() : "");

  // 인증번호 전송
  // 추가: 입력한 이메일이 기존 이메일과 동일하면 전송 불가
  const sendCode = async () => {
    if (step === "result") return;

    if (!email) {
      showModal("이메일을 입력해주세요.", () => emailRef.current.focus());
      return;
    }

    // 기존 이메일과 변경이 없는 경우 인증 요청을 막음
    if (normalize(email) === normalize(currentEmail)) {
      showModal("변경된 이메일을 입력해주세요."); // 사용자에게 안내
      return;
    }

    try {
      setLoading(true);
      await api.post("/user/emailSend", { email });
      showModal("인증번호가 전송되었습니다.", () => codeRef.current?.focus());
      setStep("verify");
    } catch (err) {
      // err.response?.data?.message가 있으면 그것을 우선 보여주도록 처리
      const msg = err?.response?.data?.message || "메일 전송에 실패했습니다 😢";
      showModal(msg);
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const verifyCode = async () => {
    if (!code) return showModal("인증번호를 입력해주세요!");

    try {
      setLoading(true);
      await api.post("/user/emailVerify", { email, code });
      // 인증 성공 → step만 변경 (UI로 인증완료 표시)
      setStep("result");
    } catch (err) {
      const msg = err?.response?.data?.message || "인증 실패";
      showModal(msg);
    } finally {
      setLoading(false);
    }
  };

  // 이메일 변경 API
  const handleUpdate = async () => {
    if (step !== "result") {
      showModal("이메일 인증을 먼저 완료해주세요!");
      return;
    }

    try {
      const res = await api.put("/user/updateEmail", { email });

      onUpdate(email);
      // 성공 메시지: 서버 메시지가 있으면 사용
      showModal(res?.data?.message || "이메일이 변경되었습니다");
      onClose(); // 모달 닫기
    } catch (err) {
      const msg = err?.response?.data?.message || "이메일 변경 실패";
      showModal(msg);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center z-[9999]">
        <div className="pointer-events-auto bg-base-100 p-6 rounded-2xl w-full max-w-md shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">이메일 수정</h1>

          {/* 이메일 */}
          <div className="flex gap-2 mb-3">
            <input
              ref={emailRef}
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStep("input");
              }}
              className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />

            <button
              onClick={sendCode}
              disabled={loading || step === "result"}
              className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus"
            >
              {loading ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                sendBtnLabel
              )}
            </button>
          </div>

          {step === "verify" && (
            <div className="flex gap-2 mb-3">
              <input
                ref={codeRef}
                type="text"
                placeholder="인증번호 입력"
                value={code}
                maxLength={6}
                onChange={
                  (e) => setCode(e.target.value.replace(/[^0-9]/g, "")) // 숫자만
                }
                className="flex-1 p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />

              <button
                type="button"
                onClick={verifyCode}
                className="px-4 py-2 bg-success text-white rounded-lg font-semibold hover:bg-success-focus">
                확인
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus"
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
