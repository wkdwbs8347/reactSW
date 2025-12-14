import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import MessageSendForm from "../components/MessageSendForm.jsx";

export default function ResidentMemberDetailPage() {
  const { buildingId, userId, unitId } = useParams(); 
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // 모달 열림 상태

  useEffect(() => {
    if (!unitId) return; 
    const fetchMember = async () => {
      try {
        const res = await api.get("/buildingMember/detail", {
          params: { id : buildingId, userId, unitId },
        });
        setMember(res.data);
      } catch (err) {
        console.error("멤버 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [buildingId, userId, unitId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (!member) return <p className="text-center mt-10">멤버 정보를 찾을 수 없습니다.</p>;

  // 메뉴 버튼 핸들러
  const handleReport = () => navigate(`/mypage/resident/${unitId}/report`);
  const handleMessage = () => setIsMessageModalOpen(true); // 모달 열기
  const handleOneOnOneChat = () => navigate(`/mypage/resident/${unitId}/chat/${userId}`);

  return (
    <div className="p-6 max-w-md mx-auto flex flex-col space-y-4">
      {/* 프로필 */}
      <div className="flex flex-col items-center space-y-2">
        <img
          src={member.profileImage || "/defaultProfileImg.jpg"}
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

      {/* Resident 전용 버튼 영역 */}
      <div className="flex flex-col gap-2 mt-4">
        <button
          className="w-full px-3 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition"
          onClick={handleReport}
        >
          문제 신고하기
        </button>
        <button
          className="w-full px-3 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
          onClick={handleMessage} // 모달 열기
        >
          메세지 보내기
        </button>
        <button
          className="w-full px-3 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition"
          onClick={handleOneOnOneChat}
        >
          1:1 채팅
        </button>
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="flex justify-start items-center h-12 mt-4">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          ◀ 뒤로
        </button>
      </div>

      {/* 메시지 전송 모달 */}
      {isMessageModalOpen && (
        <MessageSendForm
          recipient={member} // 현재 보고 있는 멤버
          onClose={() => setIsMessageModalOpen(false)} // 모달 닫기
        />
      )}
    </div>
  );
}