import '../../styles/setup/SetupCompleteModal.css';

function SetupCompleteModal({ bankName, onConfirm, onDeposit }) {
  return (
    <div className="setupCompleteModal__overlay">
      <div className="setupCompleteModal">
        <h2 className="setupCompleteModal__title">개설 완료</h2>
        <p className="setupCompleteModal__desc">
          행복통장이 개설 완료되었어요!<br />
          행복저금을 시작해볼까요?
        </p>
        <div className="setupCompleteModal__actions">
          <button className="setupCompleteCheck__btn" onClick={onConfirm}>
            확인
          </button>
          <button className="setupCompleteDeposit__btn" onClick={onDeposit}>
            저금하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupCompleteModal;
