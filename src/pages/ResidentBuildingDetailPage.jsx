import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ResidentBuildingDetailPage() {
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get("unitId");
  const buildingId = searchParams.get("buildingId");
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unitId) return;

    const fetchBuilding = async () => {
      try {
        const res = await api.get(`/building/detail`, { params: { buildingId, unitId } });
        setBuilding(res.data.building);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuilding();
  }, [unitId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (!building)
    return (
      <p className="text-center mt-10 text-gray-500">
        건물을 찾을 수 없습니다.
      </p>
    );

  const buttons = [
    { label: "채팅방 목록", path: `/resident/${unitId}/chat-list` },
    { label: "문제 신고하기", path: `/resident/${unitId}/report` },
    { label: "신고 내역", path: `/resident/${unitId}/report-list` },
    { label: "받은 신고 내역", path: `/resident/${unitId}/report-received` },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        {building.name} 소속 상세 정보
      </h2>
      <p className="text-sm text-gray-500">{building.address}</p>
      <img
        src={building.profileImage ?? "/images/defaultBuildingImg.jpg"}
        alt="건물 이미지"
        className="w-64 h-64 object-cover rounded-xl mt-2"
      />
      <div className="mt-4 space-y-2 text-gray-700">
        <p><strong>거주자:</strong> {building.nickname}</p>
        <p><strong>멤버등록일:</strong> {building.regDate}</p>
        <p><strong>층:</strong> {building.floor} 층</p>
        <p><strong>호수:</strong> {building.unitNumber} 호</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className="bg-primary/20 text-neutral w-full p-4 rounded-3xl shadow-lg
                       hover:bg-primary/40 hover:scale-105 transition transform
                       font-semibold backdrop-blur border border-primary/30 flex justify-between items-center"
            onClick={() => navigate(btn.path)}
          >
            <span>{btn.label}</span>
            <span className="text-sm text-neutral">▶</span>
          </button>
        ))}
      </div>
    </div>
  );
}