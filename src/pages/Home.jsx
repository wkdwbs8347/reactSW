import { useEffect, useState } from "react";
import api from "../api/axios"; // 만든 axios 파일 불러오기

export default function Home() {
  const [text, setText] = useState("");

  useEffect(() => {
    const axiosData = async () => {
      try {
        const res = await api.get("/hello"); // axios.js를 통해 기본경로 설정후 뒷부분 주소만으로 요청
        setText(res.data); // axios는 자동으로 data에 응답을 담아줌
      } catch (err) {
        console.error("백엔드 요청 실패:", err);
        setText("백엔드 응답 실패");
      }
    };
    axiosData();
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