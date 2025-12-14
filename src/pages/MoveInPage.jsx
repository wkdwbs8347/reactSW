import {
  useRef,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import { useNavigate } from "react-router-dom";
import { FormItem } from "../components/FormItem.jsx";
import useModal from "../hooks/useModal.js";
import api from "../api/axios.js";
import MoveInImageModal from "../components/MoveInImageModal.jsx";

export default function MoveInPage() {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [unit, setUnit] = useState("");

  const [address, setAddress] = useState("");
  const [buildingList, setBuildingList] = useState([]);

  const [floorOptions, setFloorOptions] = useState([]);
  const [allUnits, setAllUnits] = useState([]);

  const [moveInImage, setMoveInImage] = useState("");
  const [showImgModal, setShowImgModal] = useState(false);

  const navigate = useNavigate();
  const { showModal } = useModal();
  const { loginUser } = useContext(LoginChkContext);

  const buildingRef = useRef(null);
  const floorRef = useRef(null);
  const unitRef = useRef(null);

  const inputClass =
    "p-3 rounded-lg border bg-secondary text-neutral flex-grow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  /** 다음 주소 검색 */
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.address);
        setBuilding("");
        setFloor("");
        setUnit("");
        setFloorOptions([]);
        setAllUnits([]);
      },
    }).open();
  };

  /** 주소 변경 → 건물 목록 조회 */
  useEffect(() => {
    if (!address) return;

    api
      .get("/building/byAddress", { params: { address } })
      .then((res) => {
        setBuildingList(res.data || []);
      });
  }, [address]);

  /** 건물 선택 → 전체 층/호수 조회 */
  useEffect(() => {
    if (!building) return;

    api
      .get("/building/floor-unit", { params: { buildingId: building } })
      .then((res) => {
        const data = res.data || [];

        setAllUnits(data);

        const floors = [...new Set(data.map((u) => u.floor))];
        setFloorOptions(floors);

        // building 변경 시 초기화
        setFloor("");
        setUnit("");
      });
  }, [building]);

  /** 선택된 층에 맞는 호수 목록 (파생 상태) */
  const unitOptions = useMemo(() => {
    if (!floor) return [];

    return allUnits
      .filter((u) => u.floor === Number(floor))
      .map((u) => ({
        id: u.id,
        number: u.unitNumber,
        currentResidentId: u.currentResidentId,
      }));
  }, [floor, allUnits]);

  /** 입주 신청 */
  const submit = async () => {
    if (!building) return showModal("건물을 선택해주세요.");
    if (!floor) return showModal("층을 선택해주세요.");
    if (!unit) return showModal("호수를 선택해주세요.");
    if (!moveInImage)
      return showModal("증빙 서류 이미지를 업로드해주세요.");

    const selectedUnit = unitOptions.find(
      (u) => u.id === Number(unit)
    );

    if (selectedUnit?.currentResidentId) {
      return showModal("이미 멤버 등록된 호입니다.");
    }

    const payload = {
      userId: loginUser.id,
      buildingId: building,
      floor,
      unitId: unit,
      proofImage: moveInImage,
    };

    const res = await api.post("/residence/move-in", payload);

    if (res.data?.success) {
      showModal("입주 신청 완료!", () => navigate("/"));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">멤버 신청</h1>

      {/* 신청자 */}
      <FormItem label="신청자">
        <input
          value={loginUser?.nickname || ""}
          disabled
          className="p-3 rounded-lg border bg-secondary text-neutral"
        />
      </FormItem>

      {/* 주소 + 건물 */}
      <FormItem label="건물 선택">
        <div className="flex gap-2">
          <input
            value={address}
            readOnly
            placeholder="주소 검색 버튼 클릭"
            className={inputClass}
          />
          <button
            type="button"
            onClick={searchAddress}
            className="px-4 py-3 rounded-lg bg-primary text-neutral"
          >
            검색
          </button>
        </div>

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
          onChange={(e) => {
            setFloor(e.target.value);
            setUnit(""); // 이벤트에서 초기화
          }}
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
            <option key={u.id} value={u.id} disabled={!!u.currentResidentId}>
              {u.number}호
              {u.currentResidentId && " (입주중)"}
            </option>
          ))}
        </select>
      </FormItem>

      {/* 이미지 업로드 */}
      <FormItem label="증빙 서류 이미지">
        <div className="flex gap-2 items-center">
          <input
            value={moveInImage || ""}
            readOnly
            placeholder="증빙 서류 이미지 등록"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowImgModal(true)}
            className="px-4 py-3 rounded-lg bg-primary text-neutral"
          >
            이미지 등록
          </button>
        </div>
         <p className="text-sm text-gray-500 mt-1">
          ※ 증빙 서류 이미지 등록은 필수사항입니다.
        </p>

        {moveInImage && (
          <img
            src={moveInImage}
            alt="preview"
            className="w-40 h-56 object-cover rounded-xl mt-3 border shadow"
          />
        )}
      </FormItem>

      {/* 신청 */}
      <button
        onClick={submit}
        className="mt-2 px-4 py-3 rounded-lg bg-primary text-neutral font-semibold w-full"
      >
        신청하기
      </button>

      {/* 이미지 모달 */}
      {showImgModal && (
        <MoveInImageModal
          currentImage={moveInImage}
          onClose={() => setShowImgModal(false)}
          onSave={(url) => setMoveInImage(url)}
        />
      )}
    </div>
  );
}