import '../styles/MonthDivider.css';

function MonthDivider({ month }) {
  // 앞에 0이 붙은 월 표시를 제거 (예: "05월" → "5월")
  const displayMonth = month.replace(/^0+/, '');

  return (
    <div className="monthDivider">
      <span className="monthDivider__line" />
      <span className="monthDivider__label">{displayMonth}</span>
      <span className="monthDivider__line" />
    </div>
  );
}

export default MonthDivider;
