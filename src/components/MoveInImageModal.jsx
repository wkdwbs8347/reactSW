import { useState } from "react";
import useModal from "../hooks/useModal";
import api from "../api/axios";

export default function MoveInImageModal({ onClose, onSave, currentImage }) {
  const defaultImg = "/images/defaultProofImg.jpg";
  const [preview, setPreview] = useState(currentImage || defaultImg);
  const [selectedFile, setSelectedFile] = useState(null);
  const { showModal } = useModal();

  const MAX_SIZE = 10 * 1024 * 1024;
  const ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "webp"];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      showModal("이미지 파일(jpg, jpeg, png, gif, webp)만 업로드 가능합니다.");
      return;
    }
    if (file.size > MAX_SIZE) {
      showModal("파일 크기는 10MB 이하만 업로드할 수 있습니다.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) {
      showModal("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("oldImageUrl", currentImage || ""); // ⭐ 기존 이미지 전달

    try {
      const res = await api.post("/residence/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.url;
      onSave(imageUrl);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "이미지 업로드 실패했습니다.";
      showModal(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-base-100 rounded-2xl w-full max-w-sm p-6 z-10 shadow-md text-neutral">
        <h2 className="text-lg font-semibold mb-4">사진 업로드</h2>

        <div className="w-40 h-56 mx-auto rounded-xl overflow-hidden border shadow-sm bg-secondary">
          <img src={preview} className="w-full h-full object-cover" />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full rounded-xl bg-secondary mt-4"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-neutral"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
