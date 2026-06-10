import { useState } from 'react';
import SavingsProgressPanel from '../../../happyBank/components/SavingsProgressPanel';
import SavingsRecordList from '../../../happyBank/components/SavingsRecordList';
import SavingsRecordModal from '../../../happyBank/components/detail/SavingsRecordModal';
import useArchiveDetail from '../../hooks/useArchiveDetail';
import '../../styles/detail/AchievementDetailPage.css';

// accountId: URL 파라미터에서 전달
// rank: 목록 순서 기반 n회차 (location.state로 전달, 없으면 fallback용)
function AchievementDetailPage({ accountId, rank }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { detail, isLoading, error } = useArchiveDetail(accountId);

  if (isLoading) return <div className="achievementDetailPage" />;
  if (error || !detail) return <div className="achievementDetailPage" />;

  const {
    name,
    balance,
    startDate,
    endDate,
    happySavings,
    becomeSavings,
    goalType,
    goalAmount,
    records = [],
  } = detail;
  const displayName = name || '행복 통장';

  return (
    <div className="achievementDetailPage">
      <div className="achievementDetailPage__header">
        <div className="achievementDetailPage__headerLeft">
          <p className="achievementDetailPage__title">{displayName}</p>
          <p className="achievementDetailPage__date">
            {startDate}{endDate && endDate !== startDate ? ` - ${endDate}` : ''}
          </p>
        </div>
        <p className="achievementDetailPage__total">{balance.toLocaleString('ko-KR')}원</p>
      </div>

      <SavingsProgressPanel
        happySavings={happySavings}
        becomeSavings={becomeSavings}
        goalAmount={goalAmount}
        goalType={goalType}
      />

      {records.length > 0 && (
        <SavingsRecordList records={records} onRecordClick={setSelectedRecord} />
      )}

      {selectedRecord && (
        <SavingsRecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}

export default AchievementDetailPage;
