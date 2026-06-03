import '../styles/SavingsRecordItem.css';

function SavingsRecordItem({ date, type, memo, hashtag, amount, onClick }) {
  const typeLabel = type === 'happy' ? '행복저금' : '행복해지는 저금';

  return (
    <button className="savingsRecordItem" onClick={onClick} type="button">
      <div className="savingsRecordItem__header">
        <span className="savingsRecordItem__date">{date}</span>
        <span className={`savingsRecordItem__type savingsRecordItem__type--${type}`}>
          {typeLabel}
        </span>
      </div>
      <div className="savingsRecordItem__footer">
        <div className="savingsRecordItem__left">
          <p className="savingsRecordItem__memo">{memo}</p>
          <p className="savingsRecordItem__hashtag">{hashtag}</p>
        </div>
        <p className="savingsRecordItem__amount">
          <span className="savingsRecordItem__amountPlus">+</span>
          <span className="savingsRecordItem__amountValue">{amount.toLocaleString('ko-KR')}</span>
          <span className="savingsRecordItem__amountUnit">원</span>
        </p>
      </div>
    </button>
  );
}

export default SavingsRecordItem;
