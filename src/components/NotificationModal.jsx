import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NotificationModal({ notifications, onClose }) {
  const navigate = useNavigate();

  const handleClick = (n) => {
    // 1️⃣ 알림 클릭 시 apply-list 이동 (React Router 사용)
    navigate(n.link);

    // 2️⃣ 읽음 처리
    api.put(`/residence/notifications/mark-read/${n.id}`)
       .catch(console.error);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/20">
      <div className="bg-white rounded-xl p-4 w-80">
        <h2 className="font-bold mb-2">알림</h2>
        <ul>
          {notifications.length === 0 && <li>새 알림이 없습니다.</li>}
          {notifications.map(n => (
            <li 
              key={n.id} 
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleClick(n)}
            >
              {n.message}
            </li>
          ))}
        </ul>
        <button className="btn btn-sm mt-2" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}