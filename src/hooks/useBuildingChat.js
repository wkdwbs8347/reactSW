import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useBuildingChat(roomId, user) {
  const [messages, setMessages] = useState([]);
  const stompClient = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = new SockJS("http://localhost:8080/ws-stomp");
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    stompClient.current.onConnect = () => {
      console.log("Connected to WebSocket");

      // 구독: 다른 참여자가 보내는 메시지 받기
      stompClient.current.subscribe(`/topic/building/${roomId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [...prev, msg]);
      });
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, [roomId]);

  // 메시지 보내기
  const sendMessage = (content) => {
    if (stompClient.current && stompClient.current.connected) {
      const msg = {
        userId: user.id,
        nickname: user.nickname,
        content,
        sentDate: new Date().toISOString(),
      };
      stompClient.current.publish({
        destination: `/app/building/${roomId}`,
        body: JSON.stringify(msg),
      });
    }
  };

  return { messages, sendMessage };
}