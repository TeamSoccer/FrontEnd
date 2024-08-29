import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import '../css/CommonStyle.css';
import '../css/SoccerTeamDetail.css';

function SoccerTeamDetail({ isLoggedIn }) { // isLoggedIn을 props로 받음
  const { teamIdx } = useParams();
  const navigate = useNavigate();
  const [soccerTeam, setSoccerTeam] = useState(null);
  const [playerList, setPlayerList] = useState([]);
  const [isOwner, setIsOwner] = useState(false); // 작성자 여부 확인 상태

  const getData = async() => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/soccerTeam/${teamIdx}`, {
      headers: {
        Authorization: token
      }
    });
    const result = await response.json();
    if (result.data !== null && result.status === 200) {
      result.data.day = result.data.day.split(", ");
      setSoccerTeam(result.data);

      // 팀 소유자 여부 확인
      setIsOwner(result.data.isOwner);

    } else {
      alert(`[${result.code}] ${result.message}`);
      navigate("/");
    }
  }

  // 요일 순서를 정의합니다.
  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
  const sortDays = (daysArray) => {
    if (!daysArray) return '';
    const sortedDaysArray = daysArray.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    return sortedDaysArray.join(', ');
  };

  const getPlayerList = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8080/api/enroll/team/${teamIdx}`, {
        headers: {
          Authorization: token
        }
      });
      if (response.data && response.status === 200) {
        setPlayerList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching player list:', error);
    }
  }
  
  useEffect(() => {
    getData();
    getPlayerList();
  }, [teamIdx]);

  if (!soccerTeam) return <div>Loading...</div>;

  return (
    <div className="detail-container">
      <h2>{soccerTeam.name}</h2>
      <form id="frm" method="post" className='detail-form'>
        <input type="hidden" id="teamIdx" name="teamIdx" value={soccerTeam.id} />
        <table className="player_list">
          <colgroup>
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">글 번호</th>
              <td>{soccerTeam.id}</td>
              <th scope="row">조회수</th>
              <td>{soccerTeam.hitCnt}</td>
              <th scope="row">작성일</th>
              <td>{new Date(soccerTeam.createdAt).toLocaleString()}</td>
              <th scope="row">수정일</th>
              <td>{new Date(soccerTeam.updatedAt).toLocaleString()}</td>
            </tr>
            <tr>
              <th scope="row">팀 이름</th>
              <td>{soccerTeam.name}</td>
              <th scope="row">작성자</th>
              <td>{soccerTeam.player.name}</td>
              <th scope="row">전화번호</th>
              <td colSpan="3">{soccerTeam.phoneNumber}</td>
            </tr>
            <tr>
              <th scope="row">요일</th>
              <td>{sortDays(soccerTeam.day)}</td>
              <th scope="row">시작 시간</th>
              <td>{soccerTeam.startTime}</td>
              <th scope="row">종료 시간</th>
              <td>{soccerTeam.endTime}</td>
              <th scope="row">운영 기간</th>
              <td>{soccerTeam.period}년</td>
              <th scope="row">팀 연령대</th>
              <td>{soccerTeam.ageAverage}대</td>
            </tr>
            <tr>
              <th scope="row">지역</th>
              <td>{soccerTeam.region}</td>
              <th scope="row">선출 수</th>
              <td>{soccerTeam.athleteCnt}명</td>
              <th scope="row">필요 포지션</th>
              <td>{soccerTeam.needPosition}</td>
              <th scope="row">필요 포지션 수</th>
              <td>{soccerTeam.needPositionCnt}명</td>
            </tr>
            <tr>
              <th scope="row">제목</th>
              <td colSpan="7">{soccerTeam.title}</td>
            </tr>
            <tr>
              <th scope="row">내용</th>
              <td colSpan="7">{soccerTeam.contents}</td>
            </tr>
          </tbody>
        </table>
      </form>
      <div className="file_list">
        <label>팀 로고 / 팀 홍보물</label>
        {soccerTeam.fileInfoList && soccerTeam.fileInfoList.map(fileInfo => (
          <>
          <a key={fileInfo.id} href={`${process.env.REACT_APP_SERVER_URL}/api/soccerTeam/file/${fileInfo.id}`}>
            {fileInfo.originImageName} ({fileInfo.size}kb)
          </a>
          <br />
          </>
        ))}
      </div>
      <button className="btn" onClick={() => navigate('/')}>목록으로</button>
      {isOwner && (  // 작성자만 수정 및 삭제 버튼 보이게
        <>
          <button className="btn" onClick={() => navigate(`/soccerTeamModify/${teamIdx}`, {state: {soccerTeam}})}>수정하기</button>
          <button className="btn" onClick={() => {
            if (window.confirm("정말 삭제하시겠습니까?")) {
              const token = localStorage.getItem("token");
              axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/soccerTeam/${teamIdx}`, { headers: { Authorization: token }})
                .then(() => navigate('/'))
                .catch(error => console.error('Error deleting soccer team:', error));
            }
          }}>삭제하기</button>
        </>
      )}
      <div>
        <h3 className='detail-h3'>선수 목록</h3>
        <table className="player_list">
          <thead>
            <tr>
              <th>포지션</th>
              <th>선출 여부</th>
              <th>선수 이름</th>
              <th>제목</th>
              <th>전화번호</th>
              <th>등록일</th>
              <th>수정일</th>
            </tr>
          </thead>
          <tbody>
            {playerList.length > 0 ? (
              playerList.map(player => (
                <tr key={player.id}>
                  <td>{player.position}</td>
                  <td>{player.athlete ? 'O' : 'X'}</td>
                  <td><Link to={`/playerDetail/${player.id}`} state={{ teamId: soccerTeam.id }}>{player.playerName}</Link></td>
                  <td><Link to={`/playerDetail/${player.id}`} state={{ teamId: soccerTeam.id }}>{player.title}</Link></td>
                  <td>{player.phoneNumber}</td>
                  <td>{player.createdAt}</td>
                  <td>{player.updatedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">조회된 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="btn" onClick={() => {
          if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login');  // 로그인하지 않은 경우 로그인 페이지로 이동
          } else {
            navigate(`/playerWrite/${teamIdx}`);
          }
        }}>입단신청</button>
      </div>
    </div>
  );
}

  export default SoccerTeamDetail;