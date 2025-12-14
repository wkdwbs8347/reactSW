import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiUser } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

export default function ResidentMemberListPage() {
  const { buildingId } = useParams(); // URL: /resident/building/:buildingId/members
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지당 아이템, 버튼 블록
  const itemsPerPage = 5;
  const buttonsPerBlock = 5;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/buildingMember/list`, {
          params: { buildingId },
        });
        setMembers(res.data);
      } catch (err) {
        console.error("멤버 리스트 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [buildingId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;

  const owner = members.find((m) => m.role === "owner");
  const residents = members.filter((m) => m.role !== "owner");

  // 페이지네이션 계산
  const totalPages = Math.ceil(residents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = residents.slice(startIndex, startIndex + itemsPerPage);

  const currentBlock = Math.ceil(currentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  const minItemsCount = 8;
  const itemHeight = 52;
  const listMinHeight = itemHeight * minItemsCount;

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col">
      <h1 className="text-2xl font-bold mb-4">소속 건물 멤버 리스트</h1>

      {/* 리스트 영역 */}
      <div className="space-y-2 mb-6" style={{ minHeight: `${listMinHeight}px` }}>
        {/* Owner */}
        {owner && (
          <div
            onClick={() =>
              navigate(`/mypage/resident/building/${buildingId}/members/${owner.userId}/unit/${owner.unitId}`)
            }
            className="cursor-pointer bg-primary/25 text-neutral p-2.5 rounded-3xl shadow-lg hover:bg-primary/40 hover:scale-105 transition transform border-2 border-yellow-400 flex justify-between items-center"
          >
            <span className="flex items-center space-x-2">
              <FaCrown className="text-yellow-500 w-5 h-5" />
              <span>{owner.nickname} (건물 소유자)</span>
            </span>
            <span className="text-sm text-neutral">
              {owner.floor}층 {owner.unitNumber}호
            </span>
          </div>
        )}

        {/* Residents */}
        <h3 className="flex items-center space-x-2 !mt-7 mb-2 text-neutral font-medium text-m">
          <FiUser className="text-blue-800 w-6 h-6" />
          <span>Residents</span>
        </h3>
        {currentItems.map((m, idx) => (
          <div
            key={idx}
            onClick={() =>
              navigate(`/mypage/resident/building/${buildingId}/members/${m.userId}/unit/${m.unitId}`)
            }
            className="cursor-pointer bg-primary/10 text-neutral p-2.5 rounded-3xl shadow hover:bg-primary/30 hover:scale-105 transition transform flex justify-between items-center"
          >
            <span className="flex items-center space-x-2">
              <FiUser className="text-blue-800 w-6 h-6" />
              <span>{m.nickname}</span>
            </span>
            <span className="text-sm text-neutral">
              {m.floor}층 {m.unitNumber}호
            </span>
          </div>
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-between items-center h-12">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          ◀ 뒤로
        </button>

        <div className="flex space-x-2 justify-center flex-1">
          <button
            className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition cursor-pointer"
            disabled={startPage === 1}
            onClick={() => setCurrentPage(startPage - 1)}
          >
            <span className="relative top-[1px]">◀</span>
          </button>

          {Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx).map(
            (page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded-2xl transition ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "bg-primary/20 text-neutral hover:bg-primary/40"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition cursor-pointer"
            disabled={endPage === totalPages}
            onClick={() => setCurrentPage(endPage + 1)}
          >
            <span className="relative top-[1px]">▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}