// 홈화면 하단 메뉴들
import { Home, Building2, MessageCircle } from "lucide-react";

export default function FeatureMenu() {
  const menus = [
    { id: 1, label: "건물등록", icon: <Building2 size={72} /> },
    { id: 2, label: "입주신청", icon: <Home size={72} /> },
    { id: 3, label: "채팅방", icon: <MessageCircle size={72} /> },
  ];

  return (
    <section className="flex justify-center gap-10 mt-12 flex-wrap">
      {menus.map((m) => (
        <div
          key={m.id}
          className="
            w-64 h-64
            bg-base-100             /* Header 배경색과 통일 */
            rounded-3xl
            shadow-xl
            border border-base-300
            flex flex-col items-center justify-center
            cursor-pointer
            transition-all
            hover:bg-primary/20       /* 호버시 색 변경 */
            hover:scale-105
          "
        >
          <div className="text-primary mb-4">{m.icon}</div>
          <span className="font-bold text-xl text-neutral">{m.label}</span>
        </div>
      ))}
    </section>
  );
}