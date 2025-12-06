// 홈 화면 섹션
export default function HomeSection() {
  return (
    <section className="w-full p-12 rounded-3xl shadow-lg border border-base-300 relative overflow-hidden">
      {/* 배경 이미지 */}
      <img
        src="public/images/Gemini_Generated_Image_h2232ih2232ih223 (1)-1024x576.png" // 원하는 이미지 경로
        alt="Sweet Home Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* 텍스트 오버레이 */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl font-extrabold text-neutral drop-shadow">
          Sweet Home
        </h1>

        <p className="text-lg text-base-content mt-4 font-medium">
          오늘도 편안한 우리집,
          <br />이웃과 이웃이 이어지는 공간 😊
        </p>

        <button className="btn btn-primary mt-8 px-10">
          My Home
        </button>
      </div>
    </section>
  );
}