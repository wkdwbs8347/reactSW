import { Link } from "react-router-dom";
import { Home, Key, Edit3 } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-transparent shadow-none p-4 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="font-extrabold text-2xl text-purple-600 hover:text-pink-500 transition transform hover:scale-105"
      >
        Sweet Home 🏡
      </Link>

<nav className="flex gap-6 text-purple-500 font-medium">
  <Link
    to="/"
    className="flex items-center gap-1 p-1 rounded-full hover:bg-purple-100/30 transition transform hover:scale-105 shadow-sm"
  >
    <Home size={18} /> 홈
  </Link>

  <Link
    to="/login"
    className="flex items-center gap-1 p-1 rounded-full hover:bg-pink-100/30 transition transform hover:scale-105 shadow-sm"
  >
    <Key size={18} /> 로그인
  </Link>

  <Link
    to="/join"
    className="flex items-center gap-1 p-1 rounded-full hover:bg-indigo-100/30 transition transform hover:scale-105 shadow-sm"
  >
    <Edit3 size={18} /> 회원가입
  </Link>
</nav>
    </header>
  );
}