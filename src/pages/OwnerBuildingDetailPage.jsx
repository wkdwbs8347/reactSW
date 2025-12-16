import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import BuildingImageModal from "../components/profile/BuildingImageModal";
import BuildingChatModal from "../components/BuildingChatModal"; // ✅ 추가

export default function OwnerBuildingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 채팅 관련 상태 (추가만 함)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const res = await api.get(`/building/detail`, {
          params: { buildingId: id },
        });
        setBuilding(res.data.building);
        setIsOwner(res.data.isOwner);

        // ✅ 이미 내려오고 있음
        setRoomId(res.data.roomId);
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
  }, [id]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (!building)
    return (
      <p className="text-center mt-10 text-gray-500">
        건물을 찾을 수 없습니다.
      </p>
    );

  const ownerButtons = [
    { label: "멤버 신청목록", path: `/mypage/building/apply-list?buildingId=${id}` },
    { label: "멤버 리스트", path: `/mypage/building/${id}/members` },
    { label: "멤버 채팅방", action: () => setIsChatOpen(true) },
    { label: "신고현황", path: `/mypage/report/${id}` },
    { label: "월간 보고서", path: `/mypage/monthly-report/${id}` },
    { label: "전체공지 발송", path: `/mypage/notice/${id}` },


  ];

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col min-h-[700px]">
      {/* ===== 콘텐츠 영역 ===== */}
      <div className="flex-1 space-y-6">
        <h2 className="text-2xl font-bold mb-4">{building.name} 상세 정보</h2>
        <p className="text-sm text-gray-500">{building.address}</p>

        <div className="relative w-64 h-64 mt-2">
          <img
            src={building.profileImage ?? "/images/defaultBuildingImg.jpg"}
            alt="건물 이미지"
            className="w-full h-full object-cover rounded-xl"
          />

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
          <p><strong>등록자:</strong> {building.nickname}</p>
          <p><strong>등록일:</strong> {building.regDate}</p>
          <p><strong>전체 층수:</strong> {building.totalFloor} 층</p>
          <p><strong>총 호실 수:</strong> {building.unitCnt} 개</p>
        </div>

        {isOwner && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {ownerButtons.map((btn, idx) => (
              <button
                key={idx}
                className="bg-primary/20 text-neutral p-3 rounded-2xl shadow-lg 
                  hover:bg-primary/40 hover:scale-105 transition transform 
                  font-semibold backdrop-blur border border-primary/30 
                  flex justify-between items-center"
                onClick={() => {
                  if (btn.path) navigate(btn.path);
                  if (btn.action) btn.action();
                }}
              >
                <span className="text-sm">{btn.label}</span>
                <span className="text-xs text-neutral">▶</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== 하단 버튼 ===== */}
      <div className="flex justify-start items-center h-12 mt-4">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl 
                     hover:bg-primary/40 transition text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          ◀ 뒤로
        </button>
      </div>

      {/* ===== 이미지 수정 모달 ===== */}
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

      {/* ===== 채팅 모달 ===== */}
      {isChatOpen && currentUser && roomId && (
        <BuildingChatModal
          roomId={roomId}
          user={currentUser}
          buildingName={building.name}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}