import AchievementListItem from './AchievementListItem';
import '../styles/AchievementList.css';

// 성취 기록관 회차별 리스트
function AchievementList({ achievements, onItemClick }) {
  return (
    <div className="achievementList">
      {achievements.map((achievement) => (
        <AchievementListItem
          key={achievement.id}
          achievement={achievement}
          onClick={() => onItemClick(achievement)}
        />
      ))}
    </div>
  );
}

export default AchievementList;
