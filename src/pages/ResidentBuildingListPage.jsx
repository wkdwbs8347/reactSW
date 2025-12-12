import { useContext, useEffect, useState, useRef } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ResidentBuildingListPage() {
  const { loginUser } = useContext(LoginChkContext);
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const effectRan = useRef(false);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 페이지당 5개
  const buttonsPerBlock = 5;

  useEffect(() => {
    if (effectRan.current) return; // 이미 실행됐으면 종료
    effectRan.current = true;
    const fetchBuildings = async () => {
      try {
        const res = await api.get("/building/byResident");
        setBuildings(res.data);
      } catch (err) {
        console.error("건물 조회 실패:", err);
        setBuildings([]);
      } finally {
        setLoading(false);
      }
    };
    if (loginUser?.id) fetchBuildings();
  }, [loginUser]);

  if (loading) return <p className="text-center mt-10">로딩중...</p>;
  if (buildings.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        소속중인 건물이 없습니다.
      </p>
    );

  // 현재 페이지에 표시할 항목 계산
  const totalPages = Math.ceil(buildings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = buildings.slice(startIndex, startIndex + itemsPerPage);
  // 페이지 버튼 블록 계산
  const currentBlock = Math.ceil(currentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">소속중인 건물 조회</h1>

      <ul className="space-y-4">
        {currentItems.map((b) => (
          <li
            key={b.unitId} // unit 단위로 고유 key
            className="bg-primary/20 text-neutral p-4 rounded-3xl shadow-lg cursor-pointer flex justify-between items-center"
            onClick={() =>
              navigate(
                `/mypage/resident/detail?unitId=${b.unitId}&buildingId=${b.id}`
              )
            } // unitId 기준
          >
            <div>
              <h2 className="font-bold text-lg">{b.name}</h2>
              <p className="text-sm text-gray-500">{b.address}</p>
              <p className="text-sm text-gray-500">
                층: {b.floor}, 호수: {b.unitNumber}
              </p>
              <p className="text-sm text-gray-500">총 {b.totalFloor}층</p>
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

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, idx) => startPage + idx
        ).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              page === currentPage ? "bg-primary text-white" : "bg-gray-200"
            }`}
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
