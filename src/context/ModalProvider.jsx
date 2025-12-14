import { useState, useCallback } from "react";
import { ModalContext } from "./ModalContext.js";

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    open: false,
    message: "",
    onConfirm: null,
    onCancel: null,     // 새 필드
    showCancel: false,  // 새 필드
  });

  const showModal = useCallback((message, onConfirm, onCancel = null) => {
    setModal({
      open: true,
      message,
      onConfirm,
      onCancel,
      showCancel: !!onCancel, // onCancel이 있으면 취소 버튼 표시
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ModalContext.Provider value={{ modal, showModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}