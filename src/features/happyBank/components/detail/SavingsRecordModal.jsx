import Delite from '../../../../assets/icons/common/Delite';
import '../../styles/detail/SavingsRecordModal.css';
// 행복저금 메모 상세 모달
function SavingsRecordModal({ record, onClose }) {
  const { date, type, memo, hashtag, amount } = record;
  const typeLabel = type === 'happy' ? '행복저금' : '행복해지는 저금';

  return (
    <div className="savingsRecordModal__overlay" onClick={onClose}>
      <div className="savingsRecordModal" onClick={(event) => event.stopPropagation()}>
        <div className="savingsRecordModal__header">
          <div className="savingsRecordModal__headerLeft">
            <span className="savingsRecordModal__date">{date}</span>
            <span className={`savingsRecordModal__type savingsRecordModal__type--${type}`}>
              {typeLabel}
            </span>
          </div>
          <button className="savingsRecordModal__close" onClick={onClose} type="button">
            <Delite />
          </button>
        </div>

        <div className="savingsRecordModal__body">
          <p className="savingsRecordModal__memo">{memo}</p>
          {hashtag && <p className="savingsRecordModal__hashtag">{hashtag}</p>}
          <hr className="savingsRecordModal__divider" />
          <p className="savingsRecordModal__amount">
            <span className="savingsRecordModal__amountPlus">+</span>
            <span className="savingsRecordModal__amountValue">{amount.toLocaleString('ko-KR')}</span>
            <span className="savingsRecordModal__amountUnit">원</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SavingsRecordModal;
