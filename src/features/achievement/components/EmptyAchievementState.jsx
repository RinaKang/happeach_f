import '../styles/EmptyAchievementState.css';
import Clover2 from '../../../assets/icons/happybank/Clover2';

// 성취 기록관에 기록된 저금이 없을 때
function EmptyAchievementState() {
  return (
    <div className="emptyAchievementState">
      <Clover2 width={37} height={37} fill="#B1B8BE" />
      <p className="emptyAchievementState__text">완료된 저금 기록이 없습니다</p>
    </div>
  );
}

export default EmptyAchievementState;
