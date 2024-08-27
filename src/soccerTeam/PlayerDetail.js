import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/PlayerDetail.css';
import '../css/CommonStyle.css';

function PlayerDetail() {
  const { playerIdx } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/enroll/${playerIdx}`, {
      headers: { Authorization: token }
    })
      .then(response => {
        setPlayer(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching player details:', error);
      });
  }, [playerIdx]);

  if (!player) return <div>Loading...</div>;

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const token = localStorage.getItem("token");
      axios.delete(`http://localhost:8080/api/enroll/${playerIdx}`, {
        headers: { Authorization: token },
        params: { teamIdx: player.teamIdx }
      })
        .then(() => navigate(`/soccerTeam/${player.teamIdx}`))
        .catch(error => console.error('Error deleting player:', error));
    }
  };

  return (
    <div className="player-container">
      <h2>{player.player.name} 입단신청서</h2>
      <form id="frm" method="post" className='Pdetail-form'>
        <table className="player_list">
          <colgroup>
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">작성자</th>
              <td>{player.player.name}</td>
              <th scope="row">조회수</th>
              <td>{player.hitCnt}</td>
              <th scope="row">작성일</th>
              <td>{new Date(player.createdAt).toLocaleString()}</td>
              <th scope="row">수정일</th>
              <td>{new Date(player.updatedAt).toLocaleString()}</td>
            </tr>

            <tr>
              <th scope="row">선수 이름</th>
              <td>{player.player.name}</td>
              <th scope="row">지역</th>
              <td>{player.player.region}</td>
              <th scope="row">나이</th>
              <td>{player.player.age}</td>
              <th scope="row">구력</th>
              <td>{player.player.period}</td>

            </tr>
            <tr>
              <th scope="row">선출 여부</th>
              <td>{player.playerAthlete ? 'O' : 'X'}</td>
              <th scope="row">포지션</th>
              <td>{player.role}</td>
              <th scope="row">연락처</th>
              <td colSpan="3">{player.player.phoneNumber}</td>
            </tr>
            <tr>

            </tr>
            <tr>
              <th scope="row">제목</th>
              <td colSpan="7">{player.title}</td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td colSpan="7">{player.content}</td>
            </tr>
          </tbody>
        </table>
      </form>
      <button className="btnPD" onClick={() => navigate(`/soccerTeam/${player.teamId}`)}>목록으로</button>
      <button className="btnPD" onClick={() => navigate(`/playerModify/${playerIdx}`, {state: {player}})}>수정하기</button>
      <button className="btnPD" onClick={handleDelete}>삭제하기</button>
    </div>
  );
}

export default PlayerDetail;
