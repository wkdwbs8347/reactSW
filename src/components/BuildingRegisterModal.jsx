// 건물 등록
import { useState } from "react";
import { ModalLayout, FormItem } from "./ModalLayout";

export default function BuildingRegisterModal({ userInfo, onClose }) {
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [rooms, setRooms] = useState("");

  const submit = () => {
    // TODO: API 연결
    console.log({
      owner: userInfo.nickname,
      buildingName,
      address,
      floorCount,
      rooms,
    });
    onClose();
  };

  return (
    <ModalLayout title="건물 등록" onClose={onClose}>
      <FormItem label="등록자">
        <input value={userInfo.nickname} disabled className="input" />
      </FormItem>

      <FormItem label="건물명">
        <input className="input" value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)} />
      </FormItem>

      <FormItem label="주소">
        <input className="input" placeholder="주소 검색 예정"
          value={address} onChange={(e) => setAddress(e.target.value)} />
      </FormItem>

      <FormItem label="총 층수">
        <input className="input" value={floorCount}
          onChange={(e) => setFloorCount(e.target.value)} />
      </FormItem>

      <FormItem label="호수 정보 (콤마로 분리)">
        <input className="input" placeholder="101호, 102호, ..."
          value={rooms} onChange={(e) => setRooms(e.target.value)} />
      </FormItem>

      <button className="btn-primary w-full" onClick={submit}>등록하기</button>
    </ModalLayout>
  );
}