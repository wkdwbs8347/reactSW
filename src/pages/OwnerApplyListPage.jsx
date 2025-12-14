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
  const itemsPerPage = 4;
  const buttonsPerBlock = 5;

  const minItemsCount = 6;
  const itemHeight = 80;
  const listMinHeight = itemHeight * minItemsCount;

  useEffect(() => {
    if (!buildingId) {
      setLoading(false);
      return;
    }

    const fetchApplyList = async () => {
      try {
        const res = await api.get("/residence/apply-list", {
          params: { buildingId },
        });
        setApplyList(res.data);
      } catch (err) {
        console.error(err);
        showModal("신청 목록을 불러오는 중 오류가 발생했습니다.");
        setApplyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplyList();
  }, [buildingId]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;

  // 페이징 계산
  const totalPages = Math.ceil(applyList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = applyList.slice(startIndex, startIndex + itemsPerPage);

  const currentBlock = Math.ceil(currentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col">
      <h1 className="text-2xl font-bold mb-4">멤버 신청 목록</h1>

      {/* 리스트 영역 */}
      <div
        className="space-y-4 mb-6"
        style={{ minHeight: `${listMinHeight}px` }}
      >
        {applyList.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            현재 입주 신청이 없습니다.
          </p>
        )}

        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-primary/20 text-neutral p-4 rounded-3xl shadow-lg
              hover:bg-primary/40 hover:scale-105 transition transform font-semibold
              backdrop-blur border border-primary/30 w-full cursor-pointer
              flex justify-between items-center"
            onClick={() => navigate(`/mypage/building/apply/${item.id}`)}
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
          </div>
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between items-center h-12">
        {/* 뒤로가기 */}
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl 
                     hover:bg-primary/40 transition text-sm font-semibold"
          onClick={() => navigate(-1)}
        >
          ◀ 뒤로
        </button>

        {/* 페이지네이션 */}
        {applyList.length > 0 && (
          <div className="flex space-x-2 justify-center flex-1">
            <button
              className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl 
                         hover:bg-primary/40 transition cursor-pointer"
              disabled={startPage === 1}
              onClick={() => setCurrentPage(startPage - 1)}
            >
              <span className="relative top-[1px]">◀</span>
            </button>

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, idx) => startPage + idx
            ).map((page) => (
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
            ))}

            <button
              className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl 
                         hover:bg-primary/40 transition cursor-pointer"
              disabled={endPage === totalPages}
              onClick={() => setCurrentPage(endPage + 1)}
            >
              <span className="relative top-[1px]">▶</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
