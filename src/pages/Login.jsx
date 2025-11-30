import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState(""); // 아이디
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 데이터:", { username, password });
  };

  return (
    <div className="flex justify-center items-center py-16 px-4">
      <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl w-full max-w-md shadow-md">
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 아이디 */}
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-2xl border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-300 transition"
          />

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
  );
}