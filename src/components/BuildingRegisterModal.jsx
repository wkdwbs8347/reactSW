import { useRef, useState } from "react";
import { ModalLayout } from "./ModalLayout";
import { FormItem } from "./FormItem.jsx";
import useModal from "../hooks/useModal.js";
import api from "../api/axios.js";

export default function BuildingRegisterModal({ userInfo, onClose }) {
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");
  const [totalFloor, setTotalFloor] = useState(0);
  const [room, setRoom] = useState(0);

  const { showModal } = useModal();

  // 포커스용 Ref
  const buildingNameRef = useRef(null);
  const addressRef = useRef(null);
  const totalFloorRef = useRef(null);
  const roomRef = useRef(null);

  const buildingRegister = async () => {
    if (!buildingName) {
      showModal("건물명을 입력해주세요.", () =>
        buildingNameRef.current.focus()
      );
      return;
    }

    if (!address) {
      showModal("주소를 입력해주세요.", () => addressRef.current.focus());
      return;
    }

    if (!totalFloor || totalFloor <= 0) {
      showModal("총 층수를 입력해주세요.", () => totalFloorRef.current.focus());
      return;
    }

    if (!room || room <= 0) {
      showModal("층별 호수 정보를 입력해주세요.", () =>
        roomRef.current.focus()
      );
      return;
    }

    try {
      // 백엔드 DTO 기준 컬럼명과 맞춤
      const payload = {
        createdUsr: userInfo.id, // 로그인 유저 id
        name: buildingName,
        address,
        totalFloor: totalFloor,
        room: room, // 층별 호수 개수
      };

      const response = await api.post("/building/register", payload);

      if (response.data.success) {
        console.log(response.data);
        showModal("건물 등록 완료!", () => onClose());
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "건물 등록 중 오류가 발생했습니다.";
      showModal(message);
    }
  };

  return (
    <ModalLayout title="건물 등록" onClose={onClose}>
      <FormItem label="등록자">
        <input
          value={userInfo.nickname}
          disabled
          className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </FormItem>

      <FormItem label="건물명">
        <input
          ref={buildingNameRef}
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
          className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </FormItem>

      <FormItem label="주소">
        <input
          ref={addressRef}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소 검색 API 예정"
          className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </FormItem>

      <FormItem label="총 층수 / 층별 호수">
        <div className="flex gap-4">
          {/* 총 층수 */}
          <div className="flex-1 flex flex-col">
            <span className="text-sm mb-1">총 층수</span>
            <div className="relative">
              <input
                type="number"
                ref={totalFloorRef}
                value={totalFloor}
                onChange={(e) => setTotalFloor(Number(e.target.value))}
                className="w-full p-3 pr-16 rounded-lg border border-base-100 bg-secondary text-neutral text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary no-spinner"
              />
              <div className="absolute top-0 bottom-0 right-0 w-7 flex flex-col">
                <button
                  type="button"
                  onClick={() => setTotalFloor((prev) => prev + 1)}
                  className="flex-1 flex items-center justify-center bg-primary text-neutral hover:bg-primary-focus rounded-tr-lg"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setTotalFloor((prev) => Math.max(0, prev - 1))}
                  className="flex-1 flex items-center justify-center bg-primary text-neutral hover:bg-primary-focus rounded-br-lg"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* 층별 호수 */}
          <div className="flex-1 flex flex-col">
            <span className="text-sm mb-1">층별 호수</span>
            <div className="relative">
              <input
                type="number"
                ref={roomRef}
                value={room}
                onChange={(e) => setRoom(Number(e.target.value))}
                className="w-full p-3 pr-16 rounded-lg border border-base-100 bg-secondary text-neutral text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary no-spinner"
              />
              <div className="absolute top-0 bottom-0 right-0 w-7 flex flex-col">
                <button
                  type="button"
                  onClick={() => setRoom((prev) => prev + 1)}
                  className="flex-1 flex items-center justify-center bg-primary text-neutral hover:bg-primary-focus rounded-tr-lg"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setRoom((prev) => Math.max(0, prev - 1))}
                  className="flex-1 flex items-center justify-center bg-primary text-neutral hover:bg-primary-focus rounded-br-lg"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      </FormItem>

      <button
        onClick={buildingRegister}
        className="px-4 py-2 rounded-lg bg-primary text-neutral font-semibold hover:bg-primary-focus w-full"
      >
        등록하기
      </button>
    </ModalLayout>
  );
}
