import { useRef, useState, useContext, useEffect } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import { useNavigate } from "react-router-dom";
import { FormItem } from "../components/FormItem.jsx";
import useModal from "../hooks/useModal.js";
import api from "../api/axios.js";

export default function MoveInPage() {
  /**================================================
   * 사용자 입력/선택 state
   ==================================================*/
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [unit, setUnit] = useState("");

  /** 주소, 건물 선택 목록 */
  const [address, setAddress] = useState("");
  const [buildingList, setBuildingList] = useState([]);

  /** 층, 호수 옵션 */
  const [floorOptions, setFloorOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const navigate = useNavigate();
  const { showModal } = useModal();
  const { loginUser } = useContext(LoginChkContext);

  const buildingRef = useRef(null);
  const floorRef = useRef(null);
  const unitRef = useRef(null);

  /** 공통 input CSS */
  const inputClass =
    "p-3 rounded-lg border border-base-100 bg-secondary text-neutral w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  /**================================================
   🔎 주소 검색(다음 API)
   주소 선택시 address state 저장
   → 건물 리스트는 useEffect로 자동 호출됨
  ==================================================*/
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.address); // 주소 선택
        setBuilding(""); // 다른 주소 선택 시 기존 값 초기화
      },
    }).open();
  };

  /**================================================
   🏢 주소 변경 = 건물 목록 조회 트리거
   /building/byAddress?address=...
  ==================================================*/
  useEffect(() => {
    if (!address) return;

    api.get("/building/byAddress", { params: { address } }).then((res) => {
      setBuildingList(res.data); // 건물 option
    });
  }, [address]); // <-- address가 변경될 때 호출됨

  /**================================================
   🏠 건물 선택 = 해당 건물 unit 리스트 조회
   → floors, units 응답 형식으로 내려온다고 가정
   /building/floor-unit?buildingId=...
  ==================================================*/
  useEffect(() => {
    if (!building) return;

    api
      .get("/building/floor-unit", {
        params: { buildingId: building },
      })
      .then((res) => {
        const data = res.data || [];

        // floor 값 set
        const floors = [...new Set(data.map((item) => item.floor))];
        setFloorOptions(floors);

        // unit 값 set
        const units = data.map((item) => ({
          id: item.id,
          number: item.unitNumber,
        }));
        setUnitOptions(units);
        // 건물 다시 선택하면 초기화
        setFloor("");
        setUnit("");
      });
  }, [building]); // <-- building 변경될 때 호출

  /**================================================
   📌 신청 버튼
   입력값 validation + POST 요청
  ==================================================*/
  const submit = async () => {
    if (!building) return showModal("건물을 선택해주세요.");
    if (!floor) return showModal("층을 선택해주세요.");
    if (!unit) return showModal("호수를 선택해주세요.");

    const payload = {
      userId: loginUser.id,
      buildingId: building,
      floor,
      unitId: unit,
    };

    const res = await api.post("/residence/move-in", payload);

    if (res.data.success) {
      showModal("입주 신청 완료!", () => navigate("/"));
    }
  };

  /**================================================
   화면 렌더링
  ==================================================*/
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">입주 신청</h1>

      {/* 신청자 */}
      <FormItem label="신청자">
        <input
          value={loginUser?.nickname || ""}
          disabled
          className={inputClass}
        />
      </FormItem>

      {/* 주소 + 건물 */}
      <FormItem label="건물 선택">
        <div className="flex gap-2">
          <input
            value={address}
            readOnly
            className={inputClass}
            placeholder="주소 검색 버튼 클릭"
          />
          <button
            type="button"
            onClick={searchAddress}
            className="px-4 py-2 rounded-lg bg-primary text-neutral w-20"
          >
            검색
          </button>
        </div>

        {/* 주소 기반 건물 select */}
        <select
          ref={buildingRef}
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          className={`${inputClass} mt-2`}
        >
          <option value="">건물을 선택하세요</option>
          {buildingList.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </FormItem>

      {/* 층 */}
      <FormItem label="층">
        <select
          ref={floorRef}
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className={inputClass}
        >
          <option value="">층 선택</option>
          {floorOptions.map((f) => (
            <option key={f} value={f}>
              {f}층
            </option>
          ))}
        </select>
      </FormItem>

      {/* 호수 */}
      <FormItem label="호수">
        <select
          ref={unitRef}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className={inputClass}
        >
          <option value="">호수 선택</option>
          {unitOptions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.number}호
            </option>
          ))}
        </select>
      </FormItem>

      {/* 신청 */}
      <button
        onClick={submit}
        className="mt-4 px-4 py-3 rounded-lg bg-primary text-neutral font-semibold w-full"
      >
        신청하기
      </button>
    </div>
  );
}
