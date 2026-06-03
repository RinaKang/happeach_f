import '../../styles/detail/GoalAchievedModal.css';

// 행복통장 목표 달성했을 때 나타나는 모달 (성취기록관으로 이동할지?)
function GoalAchievedModal({ bankName, onConfirm, onClose }) {
  return (
    <div className="goalAchievedModal__overlay" onClick={onClose}>
      <div className="goalAchievedModal" onClick={(e) => e.stopPropagation()}>
        <div className="goalAchievedModal__textGroup">
          <h2 className="goalAchievedModal__title">목표 달성!</h2>
          <p className="goalAchievedModal__desc">
            {bankName}의 목표를 달성했어요.<br />
            성취 기록관에 기록할까요?
          </p>
        </div>
        <div className="goalAchievedModal__actions">
          <button className="goalAchievedModal__btn goalAchievedModal__btn--cancel" type="button" onClick={onClose}>
            다음에
          </button>
          <button className="goalAchievedModal__btn goalAchievedModal__btn--confirm" type="button" onClick={onConfirm}>
            기록하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalAchievedModal;
