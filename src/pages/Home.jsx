import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/hello");
        const data = await res.text();
        setText(data);
      } catch (err) {
        console.error("백엔드 요청 실패:", err);
        setText("백엔드 응답 실패");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 flex justify-center">
      <div className="bg-white/10 rounded-3xl backdrop-blur-md shadow-lg p-6 text-purple-700 text-center text-xl">
        백엔드 응답상태:  
        <span className="font-bold ml-2">{text}</span>
      </div>
    </div>
  );
}