import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios"; // axios import

export default function MessageDetailPage() {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate(); // navigate 훅 사용
  const [messageDetail, setMessageDetail] = useState(null); // 메시지 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 백엔드 API에서 메시지 상세 정보를 가져오기
  useEffect(() => {
    const fetchMessageDetail = async () => {
      try {
        const response = await api.get(`/message/detail/${id}`); // API 호출 (예시)
        setMessageDetail(response.data); // 받아온 데이터로 상태 설정
      } catch (err) {
        setError("메시지 상세 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchMessageDetail();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/message/delete/${id}`); // 삭제 API 호출 (예시)
      navigate("/mypage/message"); // 삭제 후 메시지 목록 페이지로 리다이렉트
    } catch (err) {
      setError("메시지 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const handleReply = () => {
    navigate(`/message/reply/${id}`); // 답장 페이지로 이동
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!messageDetail) {
    return <div>Message not found</div>;
  }

  return (
    <div className="p-4 bg-brown_bg text-brown_text">
      <h2 className="text-2xl font-semibold text-brown_accent mb-6">메시지 상세보기</h2>

      {/* 작성자 및 작성시간 */}
      <div className="flex justify-between mb-4">
        <div className="text-sm text-brown_accent">
          <span className="font-semibold">작성자:</span> {messageDetail.senderName} <br />
          <span className="font-semibold">층/호수:</span> {messageDetail.floor} / {messageDetail.roomNumber} <br />
          <span className="font-semibold">작성시간:</span> {messageDetail.sentDate}
        </div>
      </div>

      {/* 제목 */}
      <div className="mb-4">
        <span className="font-semibold text-brown_accent">제목: </span>
        <span>{messageDetail.title}</span>
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <span className="font-semibold text-brown_accent">내용: </span>
        <p>{messageDetail.content}</p>
      </div>

      {/* 삭제 / 답장 버튼 */}
      <div className="flex justify-between items-center h-12 mt-4">
        <button
          onClick={handleGoBack}
          className="px-3 py-1 bg-primary/20 text-neutral rounded-2xl hover:bg-primary/40 transition text-sm font-semibold"
        >
          ◀ 뒤로가기
        </button>

        <div className="flex space-x-4">
          <button
            onClick={handleDelete}
            className="btn btn-danger text-white rounded-xl bg-red-600 hover:bg-red-700"
          >
            삭제
          </button>
          <button
            onClick={handleReply}
            className="btn btn-primary text-white rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            답장
          </button>
        </div>
      </div>
    </div>
  );
}