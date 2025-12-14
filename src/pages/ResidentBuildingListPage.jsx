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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const buttonsPerBlock = 5;

  useEffect(() => {
    if (effectRan.current) return;
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

  const totalPages = Math.ceil(buildings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = buildings.slice(startIndex, startIndex + itemsPerPage);

  const currentBlock = Math.ceil(currentPage / buttonsPerBlock);
  const startPage = (currentBlock - 1) * buttonsPerBlock + 1;
  const endPage = Math.min(startPage + buttonsPerBlock - 1, totalPages);

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col min-h-[700px]">
      <h1 className="text-2xl font-bold mb-4">소속중인 건물 조회</h1>

      <ul className="space-y-4">
        {currentItems.map((b) => (
          <li
            key={b.unitId}
            className="bg-primary/20 text-neutral
              p-4 rounded-3xl shadow-lg
              hover:bg-primary/40 hover:scale-105
              transition transform
              font-semibold
              backdrop-blur
              border border-primary/30
              w-full
              cursor-pointer
              flex justify-between items-center"
            onClick={() =>
              navigate(
                `/mypage/resident/detail?unitId=${b.unitId}&buildingId=${b.id}`
              )
            }
          >
            <div>
              <h2 className="font-bold text-lg">{b.name}</h2>
              <p className="text-sm text-gray-500">{b.address}</p>
              <p className="text-sm text-gray-500">
                {b.floor}층, {b.unitNumber}호
              </p>
              <p className="text-sm text-gray-500">총 {b.totalFloor}층</p>
            </div>
            <div className="text-sm text-neutral">▶</div>
          </li>
        ))}
      </ul>

      {/* ✅ 페이징 하단 고정 */}
      <div className="flex space-x-2 justify-center mt-auto">
        <button
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl 
             hover:bg-primary/40 transition
             flex items-center justify-center leading-none cursor-pointer"
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
             hover:bg-primary/40 transition
             flex items-center justify-center leading-none cursor-pointer"
          disabled={endPage === totalPages}
          onClick={() => setCurrentPage(endPage + 1)}
        >
          <span className="relative top-[1px]">▶</span>
        </button>
      </div>
    </div>
  );
}