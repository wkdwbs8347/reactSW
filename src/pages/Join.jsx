import { useState, useRef } from "react"; // 상태 저장
import api from "../api/axios"; // 만든 axios 파일 불러오기
import { useNavigate } from "react-router-dom"; // 페이지 이동 관리 라이브러리
import useModal from "../hooks/useModal"; // ⭐ 모달 훅 추가
import Modal from "../components/Modal"; // ⭐ 모달 컴포넌트 추가

export default function Join() {
  const navigate = useNavigate(); // 페이지 이동 관리 함수

  // =======================================================
  // ⭐ 중앙 모달 (분리된 훅 사용)
  const { modal, showModal, closeModal } = useModal();
  // =======================================================

  // 각 상태 초기값 ""
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginPwChk, setLoginPwChk] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [birth, setBirth] = useState("");
  const [isComposing, setIsComposing] = useState(false); // 이름 입력창에 숫자, 특수문자 입력방지용

  // 아이디 중복체크용
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  // 닉네임 중복체크용
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  // 이메일 인증 관련 상태
  const [emailSent, setEmailSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // 포커스 관련 ref
  const loginIdRef = useRef(null);
  const loginPwRef = useRef(null);
  const emailRef = useRef(null);
  const emailChkRef = useRef(null);
  const userNameRef = useRef(null);
  const nicknameRef = useRef(null);
  const birthRef = useRef(null);

  // ⭐ 인증번호 전송 처리
  const sendEmailCode = async () => {
    if (!email) {
      showModal("이메일을 입력해주세요.", () => {
        emailRef.current.focus();
      });
      return;
    }

    try {
      setEmailLoading(true);
      const res = await api.post("/user/emailSend", { email });
      if (res.status === 200) {
        showModal("인증번호가 전송되었습니다.", () => {
          emailChkRef.current.focus();
        });
        setEmailSent(true);
      }
    } catch (err) {
      console.error("이메일 전송 실패:", err);
      showModal("이메일 전송 실패");
    } finally {
      setEmailLoading(false);
    }
  };

  // ⭐ 인증번호 검증
  const verifyEmailCode = async () => {
    if (!emailCode) {
      showModal("인증번호를 입력해주세요.", () => {
        emailChkRef.current.focus();
      });
      return;
    }

    try {
      const res = await api.post("/user/emailVerify", {
        email,
        code: emailCode,
      });

      if (res.status === 200) {
        showModal("이메일 인증이 완료되었습니다.", () => {
          loginPwRef.current.focus();
        });
        setVerified(true);
      }
    } catch (err) {
      console.error("올바르지 않은 인증번호:", err);
      showModal("인증번호가 올바르지 않습니다.");
    }
  };

  // 아이디 중복 체크
  const checkLoginId = async () => {
    setIdCheckMessage("");
    setIsIdAvailable(false);

    if (!loginId || loginId.trim().length === 0) {
      setIdCheckMessage("아이디는 필수 입력 정보입니다.");
      return;
    }

    if (loginId.trim().length < 4) {
      setIdCheckMessage("아이디는 4글자 이상이어야 합니다.");
      loginIdRef.current.focus();
      return;
    }

    try {
      const res = await api.get("/user/checkId", { params: { loginId } });
      if (res.data.available) {
        setIdCheckMessage("사용 가능한 아이디입니다.");
        setIsIdAvailable(true);
      } else {
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
        setIsIdAvailable(false);
        loginIdRef.current.focus();
      }
    } catch (err) {
      console.error("아이디 체크 실패:", err);
      setIdCheckMessage("아이디 중복체크 중 오류가 발생했습니다.");
    }
  };

  // 닉네임 중복 체크
  const checkNickname = async () => {
    setNicknameCheckMessage("");
    setIsNicknameAvailable(false);

    if (!nickname || nickname.trim().length === 0) {
      setNicknameCheckMessage("닉네임은 필수 입력 정보입니다.");
      return;
    }

    if (nickname.trim().length < 2) {
      setNicknameCheckMessage("닉네임은 2글자 이상이어야 합니다.");
      nicknameRef.current.focus();
      return;
    }

    try {
      const res = await api.get("/user/checkNickname", {
        params: { nickname },
      });
      if (res.data.available) {
        setNicknameCheckMessage("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      } else {
        setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameAvailable(false);
        nicknameRef.current.focus();
      }
    } catch (err) {
      console.error("닉네임 체크 실패:", err);
      setNicknameCheckMessage("닉네임 중복체크 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isIdAvailable) {
      showModal("아이디 중복체크를 해주세요.", () => {
        loginIdRef.current.focus();
      });
      return;
    }

    if (!isNicknameAvailable) {
      showModal("닉네임 중복체크를 해주세요.", () => {
        nicknameRef.current.focus();
      });
      return;
    }

    if (!verified) {
      showModal("이메일 인증을 완료해야 합니다.", () => {
        emailRef.current.focus();
      });
      return;
    }

    if (!loginPw || loginPw.trim().length === 0) {
      showModal("비밀번호를 입력해주세요.", () => {
        loginPwRef.current.focus();
      });
      return;
    }

    if (loginPw !== loginPwChk) {
      showModal("비밀번호가 일치하지 않습니다.", () => {
        loginPwRef.current.focus();
      });
      setLoginPw("");
      setLoginPwChk("");
      return;
    }

    if (!userName || userName.trim().length === 0) {
      showModal("이름을 입력해주세요.", () => {
        userNameRef.current.focus();
      });
      return;
    }

    if (!birth || birth.trim().length !== 8) {
      showModal("생년월일 8자리를 정확히 입력해주세요 (YYYYMMDD).", () => {
        birthRef.current.focus();
      });
      return;
    }

    try {
      const userInput = {
        loginId,
        loginPw,
        nickname,
        email,
        userName,
        birth,
      };

      const res = await api.post("/user/join", userInput);

      if (res.status === 200 || res.status === 201) {
        showModal(`${loginId} 님의 회원가입이 완료되었습니다.`, () =>
          navigate("/")
        );
      } else {
        showModal("회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원가입 실패:", err);
      const msg =
        err.response?.data?.message || "서버 오류로 회원가입에 실패했습니다.";
      showModal(msg);
    }
  };

  return (
    <>
      {/* =======================================================
          ⭐ 중앙 모달 (분리된 컴포넌트)
      ======================================================== */}
      <Modal
        open={modal.open}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />

      {/* =======================================================
           회원가입 UI
      ======================================================== */}
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-white/20 p-5 rounded-3xl w-full max-w-sm shadow-md">
          <h1 className="text-2xl font-bold text-purple-600 mb-5 text-center">
            회원가입
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* 아이디 */}
            <input
              ref={loginIdRef}
              type="text"
              placeholder="아이디 │ 영문 / 숫자"
              value={loginId}
              maxLength={20}
              onChange={(e) =>
                setLoginId(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              onBlur={checkLoginId}
              className="p-2.5 rounded-2xl border shadow-sm"
            />
            <div className="h-5">
              <p
                className={`text-sm ${
                  isIdAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {idCheckMessage}
              </p>
            </div>

            {/* 닉네임 */}
            <input
              ref={nicknameRef}
              type="text"
              placeholder="닉네임 │ 한글 / 영문 / 숫자"
              value={nickname}
              maxLength={10}
              onCompositionStart={() => setIsComposing(true)} // 한글 조합 시작
              onCompositionEnd={(e) => {
                setIsComposing(false);
                // 조합이 끝난 문자열만 필터링
                setNickname(e.target.value.replace(/[^가-힣a-zA-Z0-9]/g, ""));
              }}
              onChange={(e) => {
                // 조합 중이면 필터링하지 않고 그대로 업데이트
                if (!isComposing) {
                  setNickname(e.target.value.replace(/[^가-힣a-zA-Z0-9]/g, ""));
                } else {
                  setNickname(e.target.value);
                }
              }}
              onBlur={checkNickname}
              className="p-2.5 rounded-2xl border shadow-sm"
            />
            <div className="h-5">
              <p
                className={`text-sm ${
                  isNicknameAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {nicknameCheckMessage}
              </p>
            </div>

            {/* 이메일 + 인증 버튼 */}
            <div className="flex gap-2">
              <input
                ref={emailRef}
                type="email"
                placeholder="이메일"
                value={email}
                maxLength={40}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setVerified(false);
                }}
                className="p-2.5 rounded-2xl border shadow-sm flex-1"
              />

              <button
                type="button"
                onClick={sendEmailCode}
                disabled={verified || emailLoading}
                className="bg-purple-400 text-white text-sm rounded-xl px-3 flex items-center gap-1"
              >
                {verified ? (
                  "인증완료"
                ) : emailLoading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : emailSent ? (
                  "재요청"
                ) : (
                  "인증요청"
                )}
              </button>
            </div>

            {/* 인증번호 입력칸 */}
            {emailSent && !verified && (
              <div className="flex gap-2">
                <input
                  ref={emailChkRef}
                  type="text"
                  placeholder="인증번호 입력"
                  value={emailCode}
                  maxLength={6}
                  onChange={(e) =>
                    setEmailCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="p-2.5 rounded-2xl border shadow-sm flex-1"
                />
                <button
                  type="button"
                  onClick={verifyEmailCode}
                  className="bg-green-500 text-white rounded-xl px-3"
                >
                  확인
                </button>
              </div>
            )}

            {/* 비밀번호 */}
            <input
              ref={loginPwRef}
              type="password"
              placeholder="비밀번호"
              value={loginPw}
              maxLength={20}
              onChange={(e) => setLoginPw(e.target.value)}
              className="p-2.5 rounded-2xl border shadow-sm"
            />

            {/* 비밀번호 확인 */}
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={loginPwChk}
              maxLength={20}
              onChange={(e) => setLoginPwChk(e.target.value)}
              className="p-2.5 rounded-2xl border shadow-sm"
            />

            {/* 이름 */}
            <input
              ref={userNameRef}
              type="text"
              placeholder="이름"
              value={userName}
              maxLength={20}
              onCompositionStart={() => setIsComposing(true)} // 한글 조합 시작
              onCompositionEnd={(e) => {
                setIsComposing(false);
                // 조합이 끝난 문자열만 필터링
                setUserName(e.target.value.replace(/[^가-힣a-zA-Z]/g, ""));
              }}
              onChange={(e) => {
                // 조합 중이면 필터링하지 않고 그대로 업데이트
                if (!isComposing) {
                  setUserName(e.target.value.replace(/[^가-힣a-zA-Z]/g, ""));
                } else {
                  setUserName(e.target.value);
                }
              }}
              className="p-2.5 rounded-2xl border shadow-sm"
            />

            {/* 생일 */}
            <input
              ref={birthRef}
              type="text"
              placeholder="생년월일 8자리 (YYYYMMDD)"
              value={birth}
              maxLength={8}
              onChange={(e) => setBirth(e.target.value.replace(/[^0-9]/g, ""))}
              className="p-2.5 rounded-2xl border shadow-sm"
            />

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 mt-1 rounded-3xl shadow-md"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
