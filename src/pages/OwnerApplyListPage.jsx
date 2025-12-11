import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import useModal from "../hooks/useModal.js";

export default function OwnerApplyListPage() {
  const [applyList, setApplyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const buildingId = searchParams.get("buildingId");
  const navigate = useNavigate();
  const { showModal } = useModal();

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // ⭐ 페이지당 목록 4개
  const buttonsPerBlock = 5;

  useEffect(() => {
    if (!buildingId) return;

    const fetchApplyList = async () => {
      try {
        const res = await api.get("/residence/apply-list", {
          params: { buildingId },
        });
        setApplyList(res.data);
      } catch (err) {
        console.log(err);
        showModal("신청 목록을 불러오는 중 오류가 발생했습니다.");
        setApplyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplyList();
  }, [buildingId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (applyList.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        현재 입주 신청이 없습니다.
      </p>
    );

  const totalPages = Math.ceil(applyList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = applyList.slice(startIndex, startIndex + itemsPerPage);

  const currentBlock = Math.ceil(currentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">멤버 신청 목록</h1>

      <ul className="space-y-4">
        {currentItems.map((item) => (
          <li
            key={item.id}
            className="bg-primary/20 text-neutral p-4 rounded-3xl shadow-lg
              hover:bg-primary/40 hover:scale-105 transition transform font-semibold
              backdrop-blur border border-primary/30 w-full cursor-pointer flex justify-between items-center"
            onClick={() => navigate(`/mypage/apply/${item.id}`)}
          >
            <div>
              <p>
                신청자: <strong>{item.nickname}</strong> 
              </p>
              <p>
                {item.floor}층 {item.unitNumber}호
              </p>
              <p>신청일: {new Date(item.requestDate).toLocaleString()}</p>
            </div>
            <div className="text-sm text-neutral">▶</div>
          </li>
        ))}
      </ul>

      {/* 페이지 네비게이션 */}
      <div className="flex justify-center space-x-3 mt-6">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={startPage === 1}
          onClick={() => setCurrentPage(startPage - 1)}
        >
          ◀
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx)
          .map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${page === currentPage ? "bg-primary text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={endPage === totalPages}
          onClick={() => setCurrentPage(endPage + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}