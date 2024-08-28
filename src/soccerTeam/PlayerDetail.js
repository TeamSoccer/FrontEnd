import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/PlayerDetail.css';
import '../css/CommonStyle.css';

function PlayerDetail() {
  const { playerIdx } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = location.state || {};
  const [enroll, setEnroll] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/enroll/${playerIdx}`, {
      headers: { Authorization: token }
    })
      .then(response => {
        setEnroll(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching player details:', error);
      });
  }, [playerIdx]);

  if (!enroll) return <div>Loading...</div>;

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
        const token = localStorage.getItem("token");
        axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/enroll/${enroll.id}`, {
            headers: { Authorization: token }
        })
        .then(() => {
            navigate(`/soccerTeam/${teamId}`);
        })
        .catch(error => {
          if(error.response && error.response.data.status === 401){
            alert(error.response.data.message);
          }
          else{
            console.error('Error deleting player:', error);
            alert("삭제 중 오류가 발생했습니다. 다시 시도해 주세요.");
          }
        }
        );
    }
};

  return (
    <div className="player-container">
      <h2>{enroll.player.name} 입단신청서</h2>
      <form id="frm" method="post" className='Pdetail-form'>
        <table className="player_list">
          <colgroup>
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">작성자</th>
              <td>{enroll.player.name}</td>
              <th scope="row">조회수</th>
              <td>{enroll.hitCnt}</td>
              <th scope="row">작성일</th>
              <td>{new Date(enroll.createdAt).toLocaleString()}</td>
              <th scope="row">수정일</th>
              <td>{new Date(enroll.updatedAt).toLocaleString()}</td>
            </tr>

            <tr>
              <th scope="row">선수 이름</th>
              <td>{enroll.player.name}</td>
              <th scope="row">지역</th>
              <td>{enroll.player.region}</td>
              <th scope="row">나이</th>
              <td>{enroll.player.age}</td>
              <th scope="row">구력</th>
              <td>{enroll.player.period}</td>

            </tr>
            <tr>
              <th scope="row">선출 여부</th>
              <td>{enroll.playerAthlete ? 'O' : 'X'}</td>
              <th scope="row">포지션</th>
              <td>{enroll.position}</td>
              <th scope="row">연락처</th>
              <td colSpan="3">{enroll.player.phoneNumber}</td>
            </tr>
            <tr>

            </tr>
            <tr>
              <th scope="row">제목</th>
              <td colSpan="7">{enroll.title}</td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td colSpan="7">{enroll.content}</td>
            </tr>
          </tbody>
        </table>
      </form>
      <button className="btnPD" onClick={() => navigate(`/soccerTeam/${teamId}`)}>목록으로</button>
      <button className="btnPD" onClick={() => navigate(`/playerModify/${playerIdx}`, {state: {enroll}})}>수정하기</button>
      <button className="btnPD" onClick={handleDelete}>삭제하기</button>
    </div>
  );
}

export default PlayerDetail;
