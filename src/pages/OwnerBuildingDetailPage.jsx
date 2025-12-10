import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OwnerBuildingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const res = await api.get(`/building/detail/${id}`);
        setBuilding(res.data);
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

  // 버튼 리스트
  const buttons = [
    { label: "입주 신청목록", path: `/mypage/apply-list?buildingId=${id}` },
    { label: "입주자 리스트", path: `/mypage/resident/${id}` },
    { label: "신고현황", path: `/mypage/report/${id}` },
    { label: "월간 보고서", path: `/mypage/monthly-report/${id}` },
    { label: "공지알림 발송", path: `/mypage/notice/${id}` },
    { label: "채팅방 관리", path: `/mypage/chat/${id}` },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">{building.name} 상세 정보</h2>
      <p className="text-sm text-gray-500">{building.address}</p>
      <img
        src={building.profileImage ?? "/images/default_building.png"}
        alt="건물 이미지"
        className="w-64 h-64 object-cover rounded-xl mt-2"
      />
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

      <div className="grid grid-cols-3 gap-4 mt-4">
        {buttons.map((btn) => (
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
    </div>
  );
}
