import { useContext } from "react";
import { ModalContext } from "../context/ModalContext.js";

export default function useModal() {
  return useContext(ModalContext);
}