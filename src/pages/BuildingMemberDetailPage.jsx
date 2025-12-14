import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useModal from "../hooks/useModal.js";

export default function BuildingMemberDetailPage() {
  const { id, userId, unitId } = useParams(); // id = buildingId
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unitId) return; // unitId 없으면 호출 안 함
    const fetchMember = async () => {
      try {
        const res = await axios.get("/buildingMember/detail", {
          params: { id, userId, unitId },
        });
        setMember(res.data);
      } catch (err) {
        console.error("멤버 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id, userId, unitId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (!member) return <p className="text-center mt-10">멤버 정보를 찾을 수 없습니다.</p>;

  // 등록 해제 버튼
const handleUnregister = () => {
  showModal(
    "정말 등록해제 하시겠습니까?",
    async () => {
      try {
        await axios.delete(`/api/buildingMember/unregister`, {
          data: { id, userId, unitId },
        });
        // 성공 후 알림
        showModal("멤버 등록이 해제되었습니다.", () => navigate(-1));
      } catch (err) {
        console.error(err);
        showModal("등록해제에 실패했습니다.");
      }
    },
    () => {
      console.log("등록해제 취소됨"); // 취소 버튼 클릭 시
    }
  );
};

  // 알림 보내기 버튼
  const handleSendNotification = () => {
    showModal("알림을 보내시겠습니까?", async () => {
      try {
        await axios.post(`/api/buildingMember/notify`, {
          id, userId, unitId, message: "알림 테스트"
        });
        alert("알림이 전송되었습니다.");
      } catch (err) {
        console.error(err);
        alert("알림 전송에 실패했습니다.");
      }
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto flex flex-col space-y-4">
      {/* 프로필 */}
      <div className="flex flex-col items-center space-y-2">
        <img
          src={member.profileImage || "/default-profile.png"}
          alt={member.nickname}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <h1 className="text-xl font-bold">{member.nickname}</h1>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-1 text-neutral">
        <p>층: {member.floor}층</p>
        <p>호수: {member.unitNumber}호</p>
        <p>등록일: {new Date(member.joinedAt).toLocaleDateString()}</p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between mt-4 space-x-2">
        <button
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition"
          onClick={handleUnregister}
        >
          등록해제
        </button>
        <button
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
          onClick={handleSendNotification}
        >
          알림보내기
        </button>
      </div>

      {/* 뒤로가기 버튼 영역 */}
      <div className="flex justify-start items-center h-12 mt-4">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          ◀ 뒤로
        </button>
      </div>
    </div>
  );
}