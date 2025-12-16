import { Building2, MessageCircle, Bell } from "lucide-react";

const features = [
  {
    icon: <Building2 size={40} />,
    title: "건물 관리",
    desc: "건물 등록부터 멤버 관리까지 한 번에",
  },
  {
    icon: <MessageCircle size={40} />,
    title: "실시간 채팅",
    desc: "이웃과 바로 소통하는 채팅 기능",
  },
  {
    icon: <Bell size={40} />,
    title: "즉시 알림",
    desc: "공지·메시지를 놓치지 마세요",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-24 bg-base-100">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl shadow-lg border border-base-300 bg-neutral/5 relative overflow-hidden"
          >
            <div className="text-primary mb-4">{f.icon}</div>

            {/* h3에 relative + group */}
            <h3 className="text-xl font-bold mb-2 relative group">
              {f.title}
              {/* span이 부모 h3에 붙어서 width transition */}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </h3>

            <p className="text-neutral/70">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}