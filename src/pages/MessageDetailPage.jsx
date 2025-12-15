import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import MessageSendForm from "../components/MessageSendForm";
import useModal from "../hooks/useModal";

export default function MessageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [messageDetail, setMessageDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyModalOpen, setReplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchMessageDetail = async () => {
      try {
        const response = await api.get(`/message/detail/${id}`);
        setMessageDetail(response.data);
      } catch (err) {
        setError("메시지 상세 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessageDetail();
  }, [id]);

  const handleDelete = () => {
    showModal(
      "정말 삭제하시겠습니까?", // 메시지
      async () => {
        // 확인 버튼 눌렀을 때
        try {
          await api.delete(`/message/delete/${id}`);
          showModal("메시지가 삭제되었습니다.", () =>
            navigate("/mypage/message")
          );
        } catch (err) {
          console.error(err);
          showModal("메시지 삭제에 실패했습니다.");
        }
      },
      () => {
        // 취소 버튼 눌렀을 때는 그냥 모달 닫힘, 별도 처리 필요 없음
      }
    );
  };

  const handleReply = () => {
    setReplyModalOpen(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!messageDetail) return <div>Message not found</div>;

  // "Re:" 중복 방지
  const replyTitle = messageDetail.title.startsWith("Re: ")
    ? messageDetail.title
    : `Re: ${messageDetail.title}`;

  return (
    <div className="p-6 bg-brown_bg text-brown_text mx-auto rounded-xl shadow-md max-w-3xl">
      <h2 className="text-2xl font-semibold text-brown_accent mb-6">
        메시지 상세보기
      </h2>

      <div className="flex flex-col mb-6 p-4 rounded-xl bg-base-100 border border-brown-200 shadow-sm">
        <div className="text-sm text-brown_accent mb-2">
          <span className="font-semibold">작성자:</span>{" "}
          {messageDetail.senderName} <br />
          <span className="font-semibold">층:</span> {messageDetail.floor}{" "}
          <br />
          <span className="font-semibold">호수:</span>{" "}
          {messageDetail.unitNumber} <br />
          <span className="font-semibold">작성시간:</span>{" "}
          {messageDetail.sentDate}
        </div>

        <div className="mb-2">
          <span className="font-semibold text-brown_accent">제목: </span>
          <span className="font-medium">{messageDetail.title}</span>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-brown_accent">내용: </span>
          <span className="font-medium">{messageDetail.content}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition font-semibold text-sm"
        >
          ◀ 뒤로가기
        </button>

        <div className="flex space-x-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-semibold"
          >
            삭제
          </button>
          <button
            onClick={handleReply}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
          >
            답장
          </button>
        </div>
      </div>

      {replyModalOpen && (
        <MessageSendForm
          recipient={{
            userId: messageDetail.senderId,
            nickname: messageDetail.senderName,
          }}
          title={replyTitle}
          hideTitleInput={true}
          onClose={() => setReplyModalOpen(false)}
          onSend={async (content, title) => {
            try {
              await api.post("/message/send", {
                receiverId: messageDetail.senderId,
                title,
                content,
              });
              showModal("답장이 전송되었습니다.", () =>
                setReplyModalOpen(false)
              );
            } catch (err) {
              console.error(err);
              showModal("답장 전송 실패");
            }
          }}
        />
      )}
    </div>
  );
}
