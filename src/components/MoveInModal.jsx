// 입주신청
import { useState } from "react";

export default function MoveInModal({ userInfo, onClose }) {
  const [address, setAddress] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [room, setRoom] = useState("");

  const submit = () => {
    console.log({
      name: userInfo.nickname,
      address,
      buildingName,
      room,
    });
    onClose();
  };

  return (
    <ModalLayout title="입주 신청" onClose={onClose}>

      <FormItem label="입주자">
        <input value={userInfo.nickname} disabled className="input" />
      </FormItem>

      <FormItem label="주소">
        <input className="input" placeholder="주소 검색 예정"
          value={address} onChange={(e) => setAddress(e.target.value)} />
      </FormItem>

      <FormItem label="건물명">
        <input className="input"
          value={buildingName} onChange={(e) => setBuildingName(e.target.value)} />
      </FormItem>

      <FormItem label="호수">
        <input className="input" placeholder="101호"
          value={room} onChange={(e) => setRoom(e.target.value)} />
      </FormItem>

      <button className="btn-primary w-full" onClick={submit}>신청하기</button>
    </ModalLayout>
  );
}