import { useState } from "react";
import api from "../../api/axios";
import useModal from "../../hooks/useModal";

export default function BuildingImageModal({
  currentImage,
  buildingId, // 기존 건물 ID
  onClose,
  onSave,
}) {
  const defaultImg = "/images/defaultBuildingImg.jpg";

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImage || defaultImg);

  const { showModal } = useModal();

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "webp"];

  /** 파일 선택 */
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

  /** 저장(업로드) */
  const handleSave = async () => {
    // 선택한 파일 없으면 기본 이미지로만 처리
    if (!selectedFile) {
      onSave(currentImage || defaultImg);
      onClose();
      return;
    }

    // 실제 파일 업로드 (기존 건물 이미지 덮어쓰기)
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      let res;
      if (buildingId) {
        // 기존 건물 이미지 업데이트
        res = await api.put(`/building/update-image?buildingId=${buildingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // 신규 건물 → 그냥 선택한 파일 URL 그대로 반영
        // 실제 서버 업로드는 /building/register 시 처리
        const uploadRes = await api.post("/building/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        res = { data: { buildingImage: uploadRes.data.buildingImage } };
      }

      onSave(res.data.buildingImage);
      onClose();
    } catch (err) {
      console.error(err);
      showModal("이미지 업로드에 실패했습니다.");
    }
  };

  /** 기본 이미지로 (로컬 상태만 초기화) */
  const handleReset = () => {
    setSelectedFile(null);
    setPreview(defaultImg);
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-base-100 rounded-2xl w-full max-w-sm p-6 z-10 shadow-md text-neutral animate-scaleIn">
        <h2 className="text-lg font-semibold mb-4">건물 이미지 등록</h2>

        {/* 이미지 미리보기 */}
        <div className="w-36 h-36 mx-auto rounded-xl overflow-hidden border shadow-sm bg-secondary">
          <img
            src={preview || defaultImg}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 파일 선택 */}
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full rounded-xl bg-secondary"
          />
        </div>

        {/* 버튼 영역 */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-error text-white"
          >
            기본 이미지로
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border">
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-primary text-neutral"
            >
              저장
            </button>
          </div>
        </div>

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
    </div>
  );
}