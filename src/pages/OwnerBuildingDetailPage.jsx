import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import BuildingImageModal from "../components/profile/BuildingImageModal";

export default function OwnerBuildingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // Owner 여부
  const [loading, setLoading] = useState(true);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const res = await api.get(`/building/detail`, {
          params: { buildingId: id },
        });
        setBuilding(res.data.building);
        setIsOwner(res.data.isOwner);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuilding();
  }, [id]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (!building)
    return (
      <p className="text-center mt-10 text-gray-500">
        건물을 찾을 수 없습니다.
      </p>
    );

  const ownerButtons = [
    { label: "멤버 신청목록", path: `/mypage/apply-list?buildingId=${id}` },
    { label: "멤버 리스트", path: `/mypage/residentList/${id}` },
    { label: "신고현황", path: `/mypage/report/${id}` },
    { label: "월간 보고서", path: `/mypage/monthly-report/${id}` },
    { label: "공지알림 발송", path: `/mypage/notice/${id}` },
    { label: "채팅방 관리", path: `/mypage/chat/${id}` },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">{building.name} 상세 정보</h2>
      <p className="text-sm text-gray-500">{building.address}</p>

      <div className="relative w-64 h-64 mt-2">
        <img
          src={building.profileImage ?? "/images/defaultBuildingImg.jpg"}
          alt="건물 이미지"
          className="w-full h-full object-cover rounded-xl"
        />

        {/* Owner만 이미지 수정 버튼 노출 */}
        {isOwner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-2 right-2 bg-primary text-white px-3 py-1 rounded-lg text-sm"
          >
            이미지 수정
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>
          <strong>등록자:</strong> {building.nickname}
        </p>
        <p>
          <strong>등록일:</strong> {building.regDate}
        </p>
        <p>
          <strong>전체 층수:</strong> {building.totalFloor} 층
        </p>
        <p>
          <strong>총 호실 수:</strong> {building.unitCnt} 개
        </p>
      </div>

      {/* Owner 전용 버튼 */}
      {isOwner && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {ownerButtons.map((btn) => (
            <button
              key={btn.label}
              className="bg-primary/20 text-neutral p-3 rounded-2xl shadow-lg 
                 hover:bg-primary/40 hover:scale-105 transition transform 
                 font-semibold backdrop-blur border border-primary/30 flex justify-between items-center"
              onClick={() => navigate(btn.path)}
            >
              <span className="text-sm">{btn.label}</span>
              <span className="text-xs text-neutral">▶</span>
            </button>
          ))}
        </div>
      )}

      {/* 이미지 수정 모달 */}
      {isModalOpen && (
        <BuildingImageModal
          currentImage={building.profileImage}
          buildingId={building.id}
          onClose={() => setIsModalOpen(false)}
          onSave={(newImage) =>
            setBuilding((prev) => ({ ...prev, profileImage: newImage }))
          }
        />
      )}
    </div>
  );
}