import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import useModal from "../hooks/useModal.js";

export default function OwnerApplyDetailPage() {
  const { id } = useParams(); // residenceId
  const [apply, setApply] = useState(null);
  const navigate = useNavigate();
  const { showModal } = useModal();

  // ⭐ 모달 상태
  const [showImgModal, setShowImgModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  // 1️⃣ 상세 데이터 가져오기
  useEffect(() => {
    api
      .get(`/residence/detail/${id}`)
      .then((res) => setApply(res.data))
      .catch(() => showModal("상세 정보를 불러오는 중 오류가 발생했습니다."));
  }, [id]);

  // 2️⃣ 승인
  const approve = () => {
    api
      .put(`/residence/approve/${id}`)
      .then(() => {
        showModal("입주 신청이 승인되었습니다.", () => navigate(-1));
      })
      .catch(() => showModal("승인 중 오류가 발생했습니다."));
  };

  // 3️⃣ 거절
  const reject = () => {
    api
      .delete(`/residence/reject/${id}`)
      .then(() => {
        showModal("입주 신청이 거절되었습니다.", () => navigate(-1));
      })
      .catch(() => showModal("거절 중 오류가 발생했습니다."));
  };

  if (!apply) return <p>불러오는 중...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">입주 신청 상세</h1>

      <div className="space-y-2">
        <p>
          <strong>신청자:</strong> {apply.nickname}
        </p>
        <p>
          <strong>층/호수:</strong> {apply.floor}층 {apply.unitNumber}호
        </p>
        <p>
          <strong>신청일:</strong>{" "}
          {new Date(apply.requestDate).toLocaleString()}
        </p>
        <p>
          <strong>상태:</strong> {apply.status}
        </p>
      </div>

      {/* ⭐ 증빙 이미지 */}
      {apply.proofImage && (
        <div>
          <p className="font-semibold mb-2">증빙 서류 이미지</p>
          <div
            className="w-40 h-64 border rounded-lg overflow-hidden shadow bg-secondary cursor-pointer"
            onClick={() => {
              setModalImage(apply.proofImage);
              setShowImgModal(true);
            }}
          >
            <img
              src={apply.proofImage}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={approve}
          className="flex-1 py-2 bg-green-500 text-white rounded-lg"
        >
          승인
        </button>
        <button
          onClick={reject}
          className="flex-1 py-2 bg-red-500 text-white rounded-lg"
        >
          거절
        </button>
      </div>

      {/* 뒤로가기 */}
      <button
        className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition text-sm font-semibold"
        onClick={() => navigate(-1)}
      >
        ◀ 뒤로
      </button>

      {/* ⭐ 이미지 확대 모달 */}
      {showImgModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999">
          <div
            className="absolute inset-0"
            onClick={() => setShowImgModal(false)}
          ></div>

          <div className="relative z-10 max-w-md max-h-[80vh] rounded-xl overflow-hidden shadow-lg">
            <img
              src={modalImage}
              className="w-full h-full object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
