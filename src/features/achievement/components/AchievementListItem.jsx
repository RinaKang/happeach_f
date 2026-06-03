import '../styles/AchievementListItem.css';

// 성취 기록관 회차별 리스트 아이템 카드 컴포넌트
// rank: n회차 표시용 순서 (useAchievements에서 createdAt 정렬 후 부여)
// balance: 총 저금액 (백엔드 balance 필드)
// endDate: PERIOD형 목표 날짜 (AMOUNT형은 null)
function AchievementListItem({ achievement, onClick }) {
  const { rank, startDate, endDate, balance } = achievement;

  return (
    <button className="achievementListItem" type="button" onClick={onClick}>
      <div className="achievementListItem__left">
        <p className="achievementListItem__title">{rank}회차 행복통장</p>
        <p className="achievementListItem__date">
          {startDate}{endDate && endDate !== startDate ? ` – ${endDate}` : ''}
        </p>
      </div>
      <p className="achievementListItem__amount">
        {(balance ?? 0).toLocaleString('ko-KR')}원
      </p>
    </button>
  );
}

export default AchievementListItem;
