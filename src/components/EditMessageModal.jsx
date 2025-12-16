import { useState } from "react";

export default function EditMessageModal({ message, onSave, onCancel }) {
  const [content, setContent] = useState(message.content);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 블러 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* 모달 박스 */}
      <div className="relative bg-base-100 p-4 rounded-2xl shadow-xl w-80 z-50 flex flex-col">
        <h3 className="text-sm font-semibold mb-3 text-neutral-800">메시지 수정</h3>
        
        <textarea
          className="border border-gray-300 p-2 rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-3 bg-white text-neutral-800"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-200 text-neutral-700 rounded-xl hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-3 py-1 bg-primary text-neutral rounded-xl hover:bg-primary/80 transition"
            onClick={() => onSave(content)}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}