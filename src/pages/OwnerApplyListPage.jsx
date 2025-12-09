import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import useModal from "../hooks/useModal.js";

export default function OwnerApplyListPage() {
  const [applyList, setApplyList] = useState([]);
  const [searchParams] = useSearchParams();
  const buildingId = searchParams.get("buildingId"); // 알림에서 넘어온 buildingId
  const navigate = useNavigate();
  const { showModal } = useModal();

  // 1️⃣ 페이지 로딩 시 → 해당 건물 입주신청 목록 가져오기
  useEffect(() => {
    if (!buildingId) return;
    api
      .get("/residence/apply-list", { params: { buildingId } })
      .then((res) => setApplyList(res.data))
      .catch(() =>
        showModal("입주신청 목록을 불러오는 중 오류가 발생했습니다.")
      );
  }, [buildingId]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">입주 신청 목록</h1>
      {applyList.length === 0 && <p>현재 신청된 입주가 없습니다.</p>}

      <ul className="space-y-2">
        {applyList.map((item) => (
          <li
            key={item.id}
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
            onClick={() => navigate(`/owner/apply-detail/${item.id}`)}
          >
            <div>
              <p>
                <strong>{item.nickname}</strong> 신청
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
    </div>
  );
}
