import { useState, useCallback } from "react";
import { ModalContext } from "./ModalContext.js";

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });

  const showModal = useCallback((message, onConfirm) => {
    setModal({ open: true, message, onConfirm });
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
