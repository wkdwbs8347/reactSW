import { useRef, useState, useContext } from "react";
import { LoginChkContext } from "../context/LoginChkContext";
import { useNavigate } from "react-router-dom";
import { FormItem } from "../components/FormItem.jsx";
import useModal from "../hooks/useModal.js";
import api from "../api/axios.js";

export default function BuildingRegisterPage() {
  // 입력 값 상태 관리
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");
  const [totalFloor, setTotalFloor] = useState(0);
  const [unitNumber, setUnitNumber] = useState(0);

  const navigate = useNavigate();
  const { showModal } = useModal();
  const { loginUser } = useContext(LoginChkContext); // 로그인 유저 정보 불러오기

  // focus 이동을 위한 ref
  const buildingNameRef = useRef(null);
  const addressRef = useRef(null);
  const totalFloorRef = useRef(null);
  const unitNumberRef = useRef(null);

  // 🔍 주소 검색 (Daum PostCode API)
  const searchAddress = () => {
    new window.daum.Postcode({
      // 주소 선택했을 때 실행되는 콜백
      oncomplete: (data) => {
        setAddress(data.address); // 주소 저장
        totalFloorRef.current.focus(); // 다음 입력으로 focus 이동
      },
    }).open();
  };

  // 🏢 건물 등록 API 요청
  const buildingRegister = async () => {
    // 값 검증 -----------------------------------
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
    // --------------------------------------------

    try {
      // 서버로 보낼 데이터(payload)
      const payload = {
        createdUserId: loginUser.id, // 등록자 ID
        name: buildingName,
        address,
        totalFloor,
        unitNumber,
      };

      // API 호출
      const res = await api.post("/building/register", payload);

      // 성공했을 때
      if (res.data.success) {
        showModal("건물 등록 완료!", () => navigate("/"));
      }
    } catch (err) {
      // 에러 발생 시 메시지 표시
      const message =
        err.response?.data?.message || "건물 등록 중 오류가 발생했습니다.";
      showModal(message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">건물 등록</h1>

      {/* ---------------------------------
        1. 로그인 유저 정보를 보여줌
      ----------------------------------- */}
      <div className="mb-5">
        <FormItem label="등록자">
          <input
            value={loginUser?.nickname || ""}
            disabled
            className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </FormItem>
      </div>

      {/* ---------------------------------
        2. 건물명 입력
      ----------------------------------- */}
      <div className="mb-5">
        <FormItem label="건물명">
          <input
            ref={buildingNameRef}
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </FormItem>
      </div>

      {/* ---------------------------------
        3. 주소 + 검색 버튼 => Daum 주소 검색 실행
      ----------------------------------- */}
      <div className="mb-5">
        <FormItem label="주소">
          <div className="flex gap-2">
            <input
              ref={addressRef}
              value={address}
              readOnly
              placeholder="주소 검색 버튼 클릭"
              className="p-3 rounded-lg border border-base-100 bg-secondary text-neutral flex-grow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              onClick={searchAddress}
              className="px-4 py-2 whitespace-nowrap rounded-lg bg-primary text-neutral"
            >
              검색
            </button>
          </div>
        </FormItem>
      </div>

      {/* ---------------------------------
        4. 총 층수 입력
        5. 층당 호수 입력
      ----------------------------------- */}
      <div className="mb-5">
        <FormItem label="총 층수 / 층별 호수">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <span className="text-sm mb-1">총 층수</span>

              {/* 숫자 입력 + ▲▼ 버튼 */}
              <div className="relative w-full">
                <input
                  type="number"
                  ref={totalFloorRef}
                  value={totalFloor}
                  onChange={(e) => setTotalFloor(Number(e.target.value))}
                  className="
              w-full p-3 pr-10
              rounded-lg border border-base-100 bg-secondary text-center text-neutral
              appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            "
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    type="button"
                    onClick={() => setTotalFloor(totalFloor + 1)}
                    className="text-xs hover:text-primary"
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      totalFloor > 0 && setTotalFloor(totalFloor - 1)
                    }
                    className="text-xs hover:text-primary"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            {/* 층당 호수 */}
            <div className="flex-1 flex flex-col">
              <span className="text-sm mb-1">층별 호수</span>

              <div className="relative w-full">
                <input
                  type="number"
                  ref={unitNumberRef}
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(Number(e.target.value))}
                  className="
              w-full p-3 pr-10
              rounded-lg border border-base-100 bg-secondary text-center text-neutral
              appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            "
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                  <button
                    type="button"
                    onClick={() => setUnitNumber(unitNumber + 1)}
                    className="text-xs hover:text-primary"
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() => unitNumber > 0 && setUnitNumber(unitNumber - 1)}
                    className="text-xs hover:text-primary"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FormItem>
      </div>

      {/* ---------------------------------
        6. 등록 버튼 → API 요청 실행
      ----------------------------------- */}
      <button
        onClick={buildingRegister}
        className="mt-2 px-4 py-3 rounded-lg bg-primary text-neutral font-semibold w-full"
      >
        등록하기
      </button>
    </div>
  );
}
