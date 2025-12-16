import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function StatsSection() {
  const [stats, setStats] = useState({
    buildingCount: 0,
    userCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error("통계 조회 실패:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-5xl mx-auto grid grid-cols-3 text-center">
        <div>
          <p className="text-4xl font-extrabold text-primary">
            {stats.buildingCount.toLocaleString()}+
          </p>
          <p className="text-neutral/70 mt-2">등록된 건물</p>
        </div>

        <div>
          <p className="text-4xl font-extrabold text-primary">
            {stats.userCount.toLocaleString()}+
          </p>
          <p className="text-neutral/70 mt-2">사용자</p>
        </div>

        <div>
          <p className="text-4xl font-extrabold text-primary">ONE</p>
          <p className="text-neutral/70 mt-2">
            하나의 공간, 하나의 커뮤니티!
          </p>
        </div>
      </div>
    </section>
  );
}