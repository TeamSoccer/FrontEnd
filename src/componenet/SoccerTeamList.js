import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ScoccerTeamList.css';
import '../css/CommonStyle.css';

const SoccerTeamList = ({ isLoggedIn, onLogout }) => {  // isLoggedIn과 onLogout prop 추가
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchType, setSearchType] = useState('teamName');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/soccerTeam`, { headers: { Authorization: token } });
        setTeams(response.data.data);
        setFilteredTeams(response.data.data); // 초기 로드 시 전체 데이터를 filteredTeams에 설정
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]); // 오류 발생 시 빈 배열로 설정
        setFilteredTeams([]); // 오류 발생 시 빈 배열로 설정
      }
    };

    fetchTeams();
  }, []);

  const handleLogoutClick = () => {  // 로그아웃 버튼 클릭 시 호출
    onLogout();  // App.js에서 전달된 onLogout 함수 호출
  };

    useEffect(() => {
      handleSearch();
    }, [searchType, searchTerm]);

    const handleSearch = () => {
      const filtered = teams.filter(team => {
        if (searchType === 'teamName') {
          return team.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'region') {
          return team.region.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
      setFilteredTeams(filtered); // 필터링된 결과를 filteredTeams에 설정
    };

    const handleTeamRegisterClick = () => {
      if (!isLoggedIn) {  // 로그인 여부 확인
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');  // 경고 메시지 표시
        navigate('/login');  // 로그인 페이지로 이동
      } else {
        navigate('/soccerTeam/write');  // 로그인된 상태라면 팀 등록 페이지로 이동
      }
    };

    // 요일 순서 정의
    const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
    const sortDays = (daysString) => {
      if (!daysString) return '';
      const daysArray = daysString.split(', ');  // 문자열을 배열로 변환
      const sortedDaysArray = daysArray.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));  // 요일 정렬
      return sortedDaysArray.join(', ');  // 다시 문자열로 변환
    };
    return (
      <div className="list-container">
        <div className="header-container">
          <div className="search-actions">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type"
            >
              <option value="teamName">팀 이름</option>
              <option value="region">운영 지역</option>
            </select>
            <input
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <h2 className="title">팀 게시판</h2>
          {isLoggedIn ? (  // 로그인 상태에 따라 버튼 텍스트 변경
            <button onClick={handleLogoutClick} className="login-btn">로그아웃</button>
          ) : (
            <Link to="/login" className="login-btn">로그인</Link>
          )}
        </div>
        <div className="table-container">
          <table className="team-list">
            <thead>
              <tr>
                <th>글 번호</th>
                <th>제목</th>
                <th>팀 이름</th>
                <th>지역</th>
                <th>요일</th>
                <th>진행 시간</th>
                <th>등록일</th>
                <th>수정일</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredTeams) && filteredTeams.length > 0 ? (
                filteredTeams.map(team => (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td>
                      <Link to={`/soccerTeam/${team.id}`}>{team.title}</Link>
                    </td>
                    <td>{team.name}</td>
                    <td>{team.region}</td>
                    <td>{sortDays(team.day)}</td>
                    <td>{`${team.startTime.substring(0, 5)} - ${team.endTime.substring(0, 5)}`}</td>
                    <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(team.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-teams">등록된 팀이 없습니다</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button onClick={handleTeamRegisterClick} className="BTN">팀 등록</button>  {/* 로그인 확인 후 동작 */}
      </div>
    );
  };
  
  export default SoccerTeamList;