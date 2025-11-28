import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      {/* 전체 페이지 flex 컬럼 구조 */}
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: "url('/images/Gemini_Generated_Image_h2232ih2232ih223 (1)-1024x576.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header />

        {/* main이 flex-grow를 가지도록 해서 footer를 화면 하단으로 밀어줌 */}
        <main className="flex-grow max-w-6xl mx-auto px-4 py-10 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;