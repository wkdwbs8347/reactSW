export default function MenuButton({ title, onClick }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        onClick={onClick}
        className="
          bg-primary/20 text-neutral
          p-4 rounded-3xl shadow-lg
          hover:bg-primary/40 hover:scale-105
          transition transform
          font-semibold
          backdrop-blur
          border border-primary/30
          w-full
        "
      >
        {title}
      </button>
    </div>
  );
}