import { useRef, useState, useContext } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import { useNavigate } from "react-router-dom";
import { FormItem } from "../components/FormItem.jsx";
import useModal from "../hooks/useModal.js";
import api from "../api/axios.js";
import BuildingImageModal from "../components/profile/BuildingImageModal.jsx";

export default function BuildingRegisterPage() {
  const defaultBuildingImg = "/images/defaultBuildingImg.jpg";

  // Form 상태
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");
  const [totalFloor, setTotalFloor] = useState(0);
  const [unitNumber, setUnitNumber] = useState(0);

  const [buildingImage, setBuildingImage] = useState(null); // null이면 기본 이미지 적용
  const [showImgModal, setShowImgModal] = useState(false);

  const navigate = useNavigate();
  const { showModal } = useModal();
  const { loginUser } = useContext(LoginChkContext);

  // refs
  const buildingNameRef = useRef(null);
  const addressRef = useRef(null);
  const totalFloorRef = useRef(null);
  const unitNumberRef = useRef(null);

  // 주소 검색
  const searchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.address);
        totalFloorRef.current.focus();
      },
    }).open();
  };

  // 건물 등록
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

    if (!unitNumber || unitNumber <= 0) {
      showModal("층별 호수 정보를 입력해주세요.", () =>
        unitNumberRef.current.focus()
      );
      return;
    }

    try {
      const payload = {
        createdUserId: loginUser.id,
        name: buildingName,
        address,
        totalFloor,
        unitNumber,
        profileImage: buildingImage || defaultBuildingImg, // 선택 이미지 없으면 기본 이미지
      };

      const res = await api.post("/building/register", payload);

      if (res.data.success) {
        showModal("건물 등록 완료!", () => navigate("/"));
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "건물 등록 중 오류가 발생했습니다.";
      showModal(message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">건물 등록</h1>

      {/* 등록자 */}
      <FormItem label="등록자">
        <input
          value={loginUser?.nickname || ""}
          disabled
          className="p-3 rounded-lg border bg-secondary text-neutral"
        />
      </FormItem>

      {/* 건물명 */}
      <FormItem label="건물명">
        <input
          ref={buildingNameRef}
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
          className="p-3 rounded-lg border bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </FormItem>

      {/* 주소 검색 */}
      <FormItem label="주소">
        <div className="flex gap-2">
          <input
            ref={addressRef}
            value={address}
            readOnly
            placeholder="주소 검색 버튼 클릭"
            className="p-3 rounded-lg border bg-secondary flex-grow text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <button
            type="button"
            onClick={searchAddress}
            className="px-4 py-3 rounded-lg bg-primary text-neutral"
          >
            검색
          </button>
        </div>
      </FormItem>

      {/* 층수 / 호수 */}
      <FormItem label="총 층수 / 층별 호수">
        <div className="flex gap-4">
          {/* 총 층수 */}
          <div className="flex-1">
            <span className="text-sm mb-1">총 층수</span>
            <div className="relative">
              <input
                type="number"
                ref={totalFloorRef}
                value={totalFloor}
                onChange={(e) => setTotalFloor(Number(e.target.value))}
                className="w-full p-3 pr-10 rounded-lg border bg-secondary text-center text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute top-0 right-0 flex flex-col h-full">
                <button
                  type="button"
                  onClick={() => setTotalFloor((prev) => prev + 1)}
                  className="flex-1 px-2 py-0.5 rounded-tr-lg bg-primary text-neutral text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setTotalFloor((prev) => Math.max(1, prev - 1))}
                  className="flex-1 px-2 py-0.5 rounded-br-lg bg-primary text-neutral text-xs"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* 층별 호수 */}
          <div className="flex-1">
            <span className="text-sm mb-1">층별 호수</span>
            <div className="relative">
              <input
                type="number"
                ref={unitNumberRef}
                value={unitNumber}
                onChange={(e) => setUnitNumber(Number(e.target.value))}
                className="w-full p-3 pr-10 rounded-lg border bg-secondary text-center text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute top-0 right-0 flex flex-col h-full">
                <button
                  type="button"
                  onClick={() => setUnitNumber((prev) => prev + 1)}
                  className="flex-1 px-2 py-0.5 rounded-tr-lg bg-primary text-neutral text-xs"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setUnitNumber((prev) => Math.max(1, prev - 1))}
                  className="flex-1 px-2 py-0.5 rounded-br-lg bg-primary text-neutral text-xs"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      </FormItem>

      {/* 건물 이미지 */}
      <FormItem label="건물 사진">
        <div className="flex gap-2 items-center">
          <input
            value={buildingImage || ""}
            readOnly
            placeholder="이미지 업로드 버튼 클릭"
            className="p-3 rounded-lg border bg-secondary flex-grow text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
          ※ 선택하지 않으면 기본 이미지로 등록됩니다.
        </p>

        {buildingImage && (
          <img
            src={buildingImage}
            alt="building preview"
            className="w-32 h-32 object-cover rounded-xl mt-3 border shadow"
          />
        )}
      </FormItem>

      {/* 등록 버튼 */}
      <button
        onClick={buildingRegister}
        className="mt-2 px-4 py-3 rounded-lg bg-primary text-neutral font-semibold w-full"
      >
        등록하기
      </button>

      {/* 이미지 모달 */}
      {showImgModal && (
        <BuildingImageModal
          currentImage={buildingImage}
          buildingId={null} // 신규 건물이므로 null
          onClose={() => setShowImgModal(false)}
          onSave={(url) => setBuildingImage(url)}
        />
      )}
    </div>
  );
}
