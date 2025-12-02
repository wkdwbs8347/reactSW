import { useState } from "react";

export default function useModal() {
  const [modal, setModal] = useState({
    open: false,
    message: "",
    onConfirm: null,
  });

  const showModal = (message, onConfirm = null) => {
    setModal({
      open: true,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      message: "",
      onConfirm: null,
    });
  };

  return { modal, showModal, closeModal };
}