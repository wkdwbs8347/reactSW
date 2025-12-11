import { useState } from "react";
import api from "../../api/axios";
import useModal from "../../hooks/useModal";

/**
 * 프로필 이미지 변경 모달
 * - FindIdModal 스타일과 동일한 디자인 시스템 적용
 * - Secondary 톤 배경 + 둥근 모서리 + shadow-md + 정돈된 여백
 * - Preview 영역도 라운드 + border + overflow-hidden
 */
export default function ProfileImageModal({ currentImage, onClose, onSave }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImage);

  const { showModal } = useModal();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) {
      showModal("이미지 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await api.post("/user/upload-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.profileImage;
      onSave(newUrl); // 부모 상태 업데이트
      onClose();
      showModal("프로필 이미지가 변경되었습니다.");
    } catch (err) {
      console.error(err);
      showModal("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0" />

      {/* Modal Box */}
      <div className="relative bg-base-100 rounded-2xl w-full max-w-sm p-6 z-10 shadow-md text-neutral animate-scaleIn">

        <h2 className="text-lg font-semibold mb-4">프로필 이미지 변경</h2>

        {/* Image Preview */}
        <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border shadow-sm bg-secondary">
          <img
            src={preview || "/images/default_profile.png"}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* File Input */}
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full rounded-xl bg-secondary text-neutral"
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-neutral hover:bg-primary-focus transition"
          >
            저장
          </button>
        </div>
      </div>

      {/* 등장 애니메이션 */}
      <style>{`
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}