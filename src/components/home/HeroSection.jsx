export default function HeroSection() {
  return (
    <section className="relative h-[85vh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-16 flex items-center justify-center overflow-hidden">
      {/* ===== 동적 배경 ===== */}
      <div className="absolute inset-0 -z-10">
        {/* Blob */}
        <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/40 rounded-full blur-2xl animate-blob-slow" />
        <div className="absolute bottom-[-25%] right-[-15%] w-[650px] h-[650px] bg-secondary/40 rounded-full blur-2xl animate-blob-fast" />
        <div className="absolute top-[15%] right-[20%] w-[320px] h-[320px] bg-primary/30 rounded-full blur-xl animate-blob-medium" />
        <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-xl animate-blob-slow" />
        <div className="absolute bottom-[5%] left-[20%] w-[300px] h-[300px] bg-secondary/25 rounded-full blur-2xl animate-blob-medium" />
        <div className="absolute top-[25%] right-[40%] w-[350px] h-[350px] bg-primary/15 rounded-full blur-xl animate-blob-fast" />
      </div>

      {/* ===== 콘텐츠 ===== */}
      <div className="relative z-10 text-center max-w-3xl px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-neutral mb-6">
          이웃과 연결되는
          <br /> 새로운 주거 경험
        </h1>

        <p className="text-lg text-neutral/80 mb-10 leading-relaxed">
          건물 관리, 이웃 소통, 실시간 알림까지
          <br />
          <span className="text-neutral">Sweet Home</span> 에서 해결하세요!
        </p>

        <button
          onClick={() => {
            const intro = document.getElementById("intro-section");
            if (intro) intro.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-8 py-3 rounded-2xl border border-primary text-white font-semibold bg-primary hover:bg-neutral transition"
        >
          서비스 소개
        </button>
      </div>

      {/* ===== 애니메이션 ===== */}
      <style>{`
        @keyframes blobSlow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes blobMedium {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 30px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes blobFast {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, -60px) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .animate-blob-slow { animation: blobSlow 18s infinite ease-in-out; }
        .animate-blob-medium { animation: blobMedium 14s infinite ease-in-out; }
        .animate-blob-fast { animation: blobFast 10s infinite ease-in-out; }
      `}</style>
    </section>
  );
}