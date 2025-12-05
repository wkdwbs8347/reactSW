// 입주 취소
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MoveOutModal({ onClose }) {
  const [myBuildings, setMyBuildings] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/building/my"); // 내가 입주한 건물
      setMyBuildings(res.data);
    }
    load();
  }, []);

  const cancel = async (id) => {
    await api.post(`/building/moveout/${id}`);
    onClose();
  };

  return (
    <ModalLayout title="입주 취소" onClose={onClose}>
      {myBuildings.map(b => (
        <div key={b.id}
          className="border p-3 rounded-xl flex justify-between items-center mb-2">
          <div>
            <p className="font-bold">{b.buildingName}</p>
            <p className="text-sm text-gray-300">{b.room}</p>
          </div>
          <button onClick={() => cancel(b.id)} className="btn-danger">
            취소
          </button>
        </div>
      ))}
    </ModalLayout>
  );
}