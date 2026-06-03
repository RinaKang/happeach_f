import '../../styles/setup/GoalTabSwitch.css';

function GoalTabSwitch({ activeTab, onTabChange }) {
  return (
    <div className="goalTabSwitch">
      <div className={`goalTabSwitch__slider ${activeTab === 'period' ? 'goalTabSwitch__slider--period' : ''}`} />
      <button
        className={`goalTabSwitch__tab ${activeTab === 'amount' ? 'goalTabSwitch__tab--active' : ''}`}
        onClick={() => onTabChange('amount')}
        type="button"
      >
        목표 금액
      </button>
      <button
        className={`goalTabSwitch__tab ${activeTab === 'period' ? 'goalTabSwitch__tab--active' : ''}`}
        onClick={() => onTabChange('period')}
        type="button"
      >
        목표 기간
      </button>
    </div>
  );
}

export default GoalTabSwitch;
