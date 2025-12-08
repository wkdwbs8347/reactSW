// 모달 레이아웃
export function ModalLayout({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999]">
      {/* Modal Box */}
      <div className="pointer-events-auto bg-base-100 p-6 rounded-2xl w-full max-w-md shadow-md relative">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>

        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-xl text-brown_text hover:text-primary"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Modal Content */}
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
