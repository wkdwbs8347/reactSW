import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import BuildingChatModal from "../components/BuildingChatModal";

export default function ResidentBuildingDetailPage() {
  const [searchParams] = useSearchParams();
  const unitId = searchParams.get("unitId");
  const buildingId = searchParams.get("buildingId");
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ 모달 관련 상태
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roomId, setRoomId] = useState(null); // 🟢 roomId 상태 추가

  useEffect(() => {
    if (!unitId) return;

    const fetchBuilding = async () => {
      try {
        const res = await api.get(`/building/detail`, {
          params: { buildingId, unitId },
        });

        setBuilding(res.data.building);
        setRoomId(res.data.roomId); // 🟢 백엔드에서 전달한 roomId 저장
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        setCurrentUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBuilding();
    fetchUser();
  }, [buildingId, unitId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (!building)
    return (
      <p className="text-center mt-10 text-gray-500">
        건물을 찾을 수 없습니다.
      </p>
    );

  const buttons = [
    {
      label: "멤버 리스트",
      path: `/mypage/resident/building/${buildingId}/members`,
    },
    {
      label: "멤버 채팅방",
      action: () => setIsChatOpen(true), // 모달 열기
    },
    {
      label: "신고 내역",
      path: `/mypage/resident/${unitId}/report-list`,
    },
    {
      label: "받은 신고 내역",
      path: `/mypage/resident/${unitId}/report-received`,
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col min-h-[700px]">
      {/* ===== 콘텐츠 영역 ===== */}
      <div className="flex-1 space-y-6">
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
          <p>
            <strong>거주자:</strong> {building.nickname}
          </p>
          <p>
            <strong>멤버등록일:</strong> {building.regDate}
          </p>
          <p>
            <strong>층:</strong> {building.floor} 층
          </p>
          <p>
            <strong>호수:</strong> {building.unitNumber} 호
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              className="bg-primary/20 text-neutral w-full p-4 rounded-3xl shadow-lg
                         hover:bg-primary/40 hover:scale-105 transition transform
                         font-semibold backdrop-blur border border-primary/30 flex justify-between items-center"
              onClick={() => {
                if (btn.path) navigate(btn.path);
                if (btn.action) btn.action();
              }}
            >
              <span>{btn.label}</span>
              <span className="text-sm text-neutral">▶</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== 하단 버튼 영역 ===== */}
      <div className="flex justify-start items-center h-12 mt-4">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl 
                     hover:bg-primary/40 transition text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          ◀ 뒤로
        </button>
      </div>

      {/* ===== 채팅 모달 ===== */}
      {isChatOpen && currentUser && roomId && (
        <BuildingChatModal
          roomId={roomId} // 🟢 백엔드에서 받아온 실제 roomId 전달
          user={currentUser}
          buildingName={building.name}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}