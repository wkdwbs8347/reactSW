import { useState } from "react";

export default function Join() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("회원가입 데이터:", { username, password, email, name, birth, phone });
  };

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="bg-white/20 backdrop-blur-sm p-5 rounded-3xl w-full max-w-sm shadow-md">
        <h1 className="text-2xl font-bold text-purple-600 mb-5 text-center">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
            />
            <button
              type="button"
              className="bg-purple-300 text-white px-4 rounded-xl hover:bg-purple-400 transition active:scale-95"
            >
              인증
            </button>
          </div>

          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          <input
            type="text"
            placeholder="생년월일 (YYYYMMDD)"
            value={birth}
            maxLength={8}
            onChange={(e) => setBirth(e.target.value.replace(/[^0-9]/g, ""))}
            className="p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          <input
            type="tel"
            placeholder="핸드폰번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2.5 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 mt-1 rounded-3xl shadow-md hover:scale-105 transition active:scale-95"
          >
            가입하기 💖
          </button>
        </form>
      </div>
    </div>
  );
}