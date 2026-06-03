import '../styles/ReportSummaryRow.css';

function ReportSummaryRow({ totalExpense, emotionCount }) {
  return (
    <div className="reportSummaryRow">
      <div className="reportSummaryRow__card">
        <p className="reportSummaryRow__label">이번달 총 지출</p>
        <div className="reportSummaryRow__amountRow">
          <span className="reportSummaryRow__value">{totalExpense.toLocaleString('ko-KR')}</span>
          <span className="reportSummaryRow__desc">원</span>
        </div>
      </div>
      <div className="reportSummaryRow__card">
        <p className="reportSummaryRow__label">기록된 감정</p>
        <div className="reportSummaryRow__amountRow">
          <span className="reportSummaryRow__value">{emotionCount}</span>
          <span className="reportSummaryRow__desc">건</span>
        </div>
      </div>
    </div>
  );
}

export default ReportSummaryRow;
