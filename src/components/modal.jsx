export default function Modal({ open, message, onConfirm, onClose }) {
  {
    /*
    showModal()을 호출하면 open이 true가 되면서 모달창이 뜨고
    확인버튼 누르면 버튼클릭 이벤트로 onClose()가 호출되는데 onClose() 안에는 모달 훅의
    const closeModal = () => {
      setModal({
        open: false,
        message: "",
        onConfirm: null,
      });
    }; 가 들어 있다
    */
  }
  if (!open) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box text-center">
        <p className="py-4 font-semibold">{message}</p>

        <div className="modal-action justify-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              if (onConfirm) onConfirm();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </dialog>
  );
}
