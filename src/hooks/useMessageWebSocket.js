import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../api/axios";

export default function useMessageWebSocket(userId) {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // 기존 메시지 목록 조회
    api.get(`/message/${userId}`)
      .then((res) => setMessages(res.data))
      .catch(console.error);

    // WebSocket 연결
    const socket = new SockJS("http://localhost:8080/ws-stomp");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    });

    client.onConnect = () => {
      // 메시지 구독
      client.subscribe(`/topic/messages/${userId}`, (msg) => {
        const newMessage = JSON.parse(msg.body);

        // 새로운 메시지가 기존 메시지와 중복되지 않도록 처리
        setMessages((prevMessages) => {
          // 중복 메시지 처리 (ID가 동일한 메시지가 있으면 업데이트, 없으면 추가)
          const messageExists = prevMessages.some((m) => m.id === newMessage.id);

          if (messageExists) {
            // 기존 메시지를 업데이트
            return prevMessages.map((m) =>
              m.id === newMessage.id ? { ...m, ...newMessage } : m
            );
          } else {
            // 새로운 메시지 추가
            return [newMessage, ...prevMessages];
          }
        });
      });
    };

    client.activate();
    clientRef.current = client;

    return () => clientRef.current?.deactivate();
  }, [userId]);

  return { messages, setMessages };
}