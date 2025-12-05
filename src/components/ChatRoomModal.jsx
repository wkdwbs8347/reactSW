// 채팅방
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ChatRoomModal({ onClose }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/chat/myRooms");
      setRooms(res.data);
    }
    load();
  }, []);

  return (
    <ModalLayout title="채팅방 목록" onClose={onClose}>
      {rooms.map(r => (
        <div key={r.id} className="border p-3 rounded-xl flex justify-between mb-3">
          <p>{r.name}</p>
          <button className="btn-primary">입장</button>
        </div>
      ))}
    </ModalLayout>
  );
}