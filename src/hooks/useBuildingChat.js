import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useBuildingChat(roomId, user, onReceiveMessage, onReceiveDelete, onReceiveUpdate) {
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

      stompClient.current.subscribe(`/topic/building/${roomId}`, (message) => {
        const msg = JSON.parse(message.body);
        onReceiveMessage(msg);
      });

      stompClient.current.subscribe(`/topic/building/delete`, (message) => {
        const deletedId = JSON.parse(message.body);
        onReceiveDelete(deletedId);
      });

      stompClient.current.subscribe(`/topic/building/update`, (message) => {
        const updatedMsg = JSON.parse(message.body);
        onReceiveUpdate(updatedMsg);
      });
    };

    stompClient.current.activate();
    return () => {
      stompClient.current?.deactivate();
    };
  }, [roomId]);

  const sendMessage = (content) => {
    if (stompClient.current?.connected) {
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

  const sendDeleteMessage = (id) => {
    stompClient.current?.publish({
      destination: `/app/building/chat/delete`,
      body: JSON.stringify(id),
    });
  };

  const sendUpdateMessage = (msg) => {
    stompClient.current?.publish({
      destination: `/app/building/chat/update`,
      body: JSON.stringify(msg),
    });
  };

  return { sendMessage, sendDeleteMessage, sendUpdateMessage };
}