import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../api/axios";

export default function useNotificationWebSocket(userId) {
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // 기존 미확인 알림 목록 조회 (REST)
    const fetchNotifications = () => {
      api
        .get(`/notifications/${userId}`) // 미확인 알림만 조회
        .then((res) => {
          setNotifications(res.data); // 읽지 않은 알림 상태에 설정
        })
        .catch(console.error);
    };

    fetchNotifications();

    // WebSocket 연결
    const socket = new SockJS("http://localhost:8080/ws-stomp", null, {
      withCredentials: true,
    });

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    });

    // 알림 실시간 수신
    client.onConnect = () => {
      client.subscribe(`/topic/notifications/${userId}`, (msg) => {
        const data = JSON.parse(msg.body);
        
        // 알림을 실시간으로 목록에 추가 (읽지 않은 상태)
        setNotifications((prev) => {
          // 새 알림을 기존 목록에 추가
          return [data, ...prev];
        });
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
    };
  }, [userId]);

  // 읽음 처리
  const markAsRead = (id) => {
    api.put(`/notifications/mark-read/${id}`).then(() => {
      // 알림 목록에서 해당 알림을 읽음 처리 후 목록에서 제거
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    });
  };

  // 모든 알림 읽음 처리
  const markAllNotificationsAsRead = () => {
    api.put(`/notifications/mark-all-read/${userId}`).then(() => {
      // 모든 알림을 읽음 처리 후 목록에서 제거
      setNotifications([]); // 모든 알림을 삭제
    });
  };

  return {
    notifications,
    markAsRead,
    markAllNotificationsAsRead,
  };
}