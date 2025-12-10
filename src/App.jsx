import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트 import
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Join from "./pages/Join.jsx";
import MyPage from "./pages/MyPage.jsx";
import BuildingRegisterPage from "./pages/BuildingRegisterPage.jsx";
import MoveInPage from "./pages/MoveInPage";
import OwnerApplyListPage from "./pages/OwnerApplyListPage.jsx";
import OwnerApplyDetailPage from "./pages/OwnerApplyDetailPage.jsx";
import OwnerBuildingListPage from "./pages/OwnerBuildingListPage.jsx";
import OwnerBuildingDetailPage from "./pages/OwnerBuildingDetailPage.jsx";
import ResidentBuildingListPage from "./pages/ResidentBuildingListPage.jsx";
import ResidentBuildingDetailPage from "./pages/ResidentBuildingDetailPage.jsx";
import ProfileRight from "./components/profile/ProfileRight.jsx";

// 공통 컴포넌트 import
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// 모달 관련 import
import { ModalProvider } from "./context/ModalProvider.jsx"; // 전역 모달 Provider
import Modal from "./components/Modal.jsx"; // 모달 UI 컴포넌트

// 로그인체크 관련 import
import LoginChkProvider from "./context/LoginChkProvider.jsx";

/**
 * App 컴포넌트
 * - React Router 설정
 * - 전역 ModalProvider로 모달 상태 관리
 * - 전체 페이지 공통 레이아웃(Header/Footer)
 * - Background 이미지 적용
 */
function App() {
  return (
    <LoginChkProvider>
      {/* LoginChkProvider: 앱 전체에서 로그인 상태 공유 가능 */}
      <Router>
        {/* Router: SPA 라우팅을 위해 브라우저 라우터 적용 */}
        <ModalProvider>
          {/* ModalProvider: 앱 전체에서 모달 상태 공유 가능 */}
          {/* 전체 페이지 레이아웃 */}
          <div className="min-h-screen flex flex-col text-neutral bg-gradient-to-b from-primary/30 via-base-100/20 to-secondary/30">
            {/* Header: 상단 네비게이션 */}
            <Header />

            {/* Main: 페이지별 컴포넌트 렌더링 */}
            <main className="flex-grow max-w-6xl mx-auto px-4 py-10 w-full">
              <Routes>
                {/* 경로별 페이지 연결 */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/join" element={<Join />} />
                <Route path="/building/register" element={<BuildingRegisterPage />} />
                <Route path="/move-in" element={<MoveInPage />} />
                {/* 🔥 추가 (마이페이지 그룹) */}
                <Route path="/mypage/*" element={<MyPage />}>
                  <Route index element={<ProfileRight />} />
                  <Route
                    path="building/register"
                    element={<BuildingRegisterPage />}
                  />
                  <Route path="move-in" element={<MoveInPage />} />

                  <Route path="apply-list" element={<OwnerApplyListPage />} />
                  <Route path="apply/:id" element={<OwnerApplyDetailPage />} />

                  <Route path="buildings" element={<OwnerBuildingListPage />} />
                  <Route
                    path="building/:id"
                    element={<OwnerBuildingDetailPage />}
                  />

                  <Route
                    path="resident"
                    element={<ResidentBuildingListPage />}
                  />
                  <Route
                    path="resident/:id"
                    element={<ResidentBuildingDetailPage />}
                  />
                </Route>
              </Routes>
            </main>

            {/* Footer: 하단 고정 */}
            <Footer />
          </div>

          {/* 전역 모달 컴포넌트
            - ModalProvider의 상태를 구독
            - Header, Logout 등 어디서든 showModal() 호출 가능
        */}
          <Modal />
        </ModalProvider>
      </Router>
    </LoginChkProvider>
  );
}

// App 컴포넌트 export
export default App;
