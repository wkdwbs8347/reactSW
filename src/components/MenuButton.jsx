export default function MenuButton({ title, onClick, isActive }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={onClick}
        className={`
          p-4 rounded-3xl shadow-lg
          transition transform font-semibold backdrop-blur border
          w-full
          ${isActive 
            ? "bg-primary text-white border-primary" // 활성화 시 하이라이트
            : "bg-primary/20 text-neutral border-primary/30 hover:bg-primary/40 hover:scale-105"
          }
        `}
      >
        {title}
      </button>
    </div>
  );
}