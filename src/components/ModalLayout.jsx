// 모달 레이아웃 구조
export function ModalLayout({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl w-96 relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <button className="absolute top-3 right-4 text-xl" onClick={onClose}>✖</button>

        <div className="space-y-4 mt-4">{children}</div>
      </div>
    </div>
  );
}

export function FormItem({ label, children }) {
  return (
    <div>
      <label className="block text-sm mb-1 font-semibold">{label}</label>
      {children}
    </div>
  );
}