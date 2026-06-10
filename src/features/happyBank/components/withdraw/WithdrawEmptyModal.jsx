import '../../styles/withdraw/WithdrawEmptyModal.css';

function WithdrawEmptyModal({ onBack, onDeposit }) {
  return (
    <div className="withdrawEmptyModal__dim">
      <div className="withdrawEmptyModal__card">
        <p className="withdrawEmptyModal__title">인출할 내역이 없어요</p>
        <p className="withdrawEmptyModal__desc">
          저금한 내역이 존재하지 않아요.
          <br />
          저금 후 행복을 인출해보세요!
        </p>
        <div className="withdrawEmptyModal__actions">
          <button className="withdrawEmptyModal__backBtn" onClick={onBack} type="button">
            돌아가기
          </button>
          <button className="withdrawEmptyModal__depositBtn" onClick={onDeposit} type="button">
            저금하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawEmptyModal;
