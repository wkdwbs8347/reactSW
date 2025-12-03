import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useModal from "../hooks/useModal";

export default function Logout() {
  const navigate = useNavigate();
  const { showModal, closeModal } = useModal();

  useEffect(() => {
    // setTimeout으로 한 tick 뒤에 showModal 호출
    const timer = setTimeout(() => {
      showModal("⚠️ 잘못된 접근입니다.", () => {
        closeModal();
        navigate("/", { replace: true });
      });
    }, 0);

    return () => clearTimeout(timer); // Cleanup
  }, [showModal, closeModal, navigate]);

  // 전역 Modal을 사용하므로, 여기서는 렌더링 필요 없음
  return null;
}
