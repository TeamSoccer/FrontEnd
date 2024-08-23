import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SoccerTeamDetail() {
  const { teamIdx } = useParams();
  const navigate = useNavigate();
  const [soccerTeam, setSoccerTeam] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/soccerTeam/${teamIdx}`, { headers: { Authorization: 'Bearer ' + token }})
      .then(response => {
        setSoccerTeam(response.data.soccerTeam);
        setPlayerList(response.data.playerList);
      })
      .catch(error => {
        console.error('Error fetching soccer team details:', error);
      });
  }, [teamIdx]);

  // if (!soccerTeam) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{"soccerTeam.teamName"}</h2>
      <form id="frm" method="post">
        <input type="hidden" id="teamIdx" name="teamIdx" value={"soccerTeam.teamIdx"} />
        <table className="player_list">
          <colgroup>
            <col width="10%" />
            <col width="10%" />
            
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">글 번호</th>
              <td>{"soccerTeam.teamIdx"}</td>
              <th scope="row">조회수</th>
              <td>{"soccerTeam.hitCnt"}</td>
              <th scope="row">작성일</th>
              <td>{new Date("soccerTeam.createdDatetime").toLocaleString()}</td>
              <th scope="row">수정일</th>
              <td>{new Date("soccerTeam.updatedDatetime").toLocaleString()}</td>
            </tr>
            <tr>
              <th scope="row">팀 이름</th>
              <td>{"soccerTeam.teamName"}</td>
              <th scope="row">작성자</th>
              <td>{"soccerTeam.creatorId"}</td>
              <th scope="row">연락처</th>
              <td colSpan="3">{"soccerTeam.teamNumber"}</td>
            </tr>
            <tr>
            <th scope="row">요일</th>
              <td>{"soccerTeam.teamDay"}</td>
              <th scope="row">진행 시간</th>
              <td>{"soccerTeam.teamTime"}시간</td>
              <th scope="row">운영 기간</th>
              <td>{"soccerTeam.teamPeriod"}년</td>
              <th scope="row">팀 연령대</th>
              <td>{"soccerTeam.teamOld"}대</td>
            </tr>
            <tr>
              <th scope="row">지역</th>
              <td>{"soccerTeam.region"}</td>
              <th scope="row">선출 수</th>
              <td>{"soccerTeam.athleteNumber"}명</td>
              <th scope="row">필요 포지션</th>
              <td>{"soccerTeam.needPosition"}</td>
              <th scope="row">필요 포지션 수</th>
              <td>{"soccerTeam.needPositionNumber"}명</td>
            </tr>
            <tr>
              <th scope="row">제목</th>
              <td colSpan="7">{"soccerTeam.title"}</td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td colSpan="7">{"soccerTeam.contents"}</td>
            </tr>
          </tbody>
        </table>
      </form>
      <div className="file_list">
        <label>팀 로고 / 팀 홍보물</label>
        {/* {soccerTeam.fileInfoList && soccerTeam.fileInfoList.map(fileInfo => (
          <a key={fileInfo.teamFileIdx} href={`http://localhost:8080/api/soccerTeam/file/${soccerTeam.teamIdx}/${fileInfo.teamFileIdx}`}>
            {fileInfo.originalFileName} ({fileInfo.fileSize}kb)
          </a>
        ))} */}
      </div>
      <button className="btn" onClick={() => navigate('/')}>목록으로</button>
      <button className="btn" onClick={() => navigate(`/soccerTeamModify/${teamIdx}`)}>수정하기</button>
      <button className="btn" onClick={() => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
          const token = localStorage.getItem("token");
          axios.delete(`http://localhost:8080/api/soccerTeam/${teamIdx}`, { headers: { Authorization: 'Bearer ' + token }})
            .then(() => navigate('/'))
            .catch(error => console.error('Error deleting soccer team:', error));
        }
      }}>삭제하기</button>
      <div>
        <h3>선수 목록</h3>
        <table className="player_list">
          <thead>
            <tr>
              <th>선출 여부</th>
              <th>선수 이름</th>
              <th>제목</th>
              <th>지역</th>
              <th>등록일</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            {playerList.length > 0 ? (
              playerList.map(player => (
                <tr key={player.playerIdx}>
                  <td>{player.playerAthlete ? 'O' : 'X'}</td>
                  <td><a href={`/playerDetail/${player.playerIdx}`}>{player.playerName}</a></td>
                  <td><a href={`/playerDetail/${player.playerIdx}`}>{player.title}</a></td>
                  <td>{player.region}</td>
                  <td>{player.createdDatetime}</td>
                  <td>{player.updatedDatetime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">조회된 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="btn" onClick={() => navigate(`/playerWrite/${teamIdx}`)}>글쓰기</button>
      </div>
    </div>
  );
}

export default SoccerTeamDetail;
