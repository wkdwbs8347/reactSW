import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // 스프링부트 주소 + 기본 경로
  withCredentials: true, // 필요하면 쿠키/세션 받기
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
