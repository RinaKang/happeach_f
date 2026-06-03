import { useState } from 'react';
import SavingsProgressPanel from '../../../happyBank/components/SavingsProgressPanel';
import SavingsRecordList from '../../../happyBank/components/SavingsRecordList';
import SavingsRecordModal from '../../../happyBank/components/detail/SavingsRecordModal';
import useArchiveDetail from '../../hooks/useArchiveDetail';
import '../../styles/detail/AchievementDetailPage.css';

// accountId: URL 파라미터에서 전달
// rank: 목록 순서 기반 n회차 (location.state로 전달, 없으면 공백 처리)
// 뒤로가기는 URL 라우팅으로 처리 (브라우저 뒤로가기 or navigate('/record'))
function AchievementDetailPage({ accountId, rank }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { detail, isLoading, error } = useArchiveDetail(accountId);

  if (isLoading) return <div className="achievementDetailPage" />;
  if (error || !detail) return <div className="achievementDetailPage" />;

  const { balance, startDate, endDate, happySavings, becomeSavings, goalType, goalAmount, records = [] } = detail;
  const rankLabel = rank != null ? `${rank}회차` : '';

  return (
    <div className="achievementDetailPage">
      {/* 회차 요약 카드 */}
      <div className="achievementDetailPage__header">
        <div className="achievementDetailPage__headerLeft">
          <p className="achievementDetailPage__title">{rankLabel} 행복통장</p>
          <p className="achievementDetailPage__date">
            {startDate}{endDate && endDate !== startDate ? ` – ${endDate}` : ''}
          </p>
        </div>
        <p className="achievementDetailPage__total">{balance.toLocaleString('ko-KR')}원</p>
      </div>

      {/* 행복저금 / 행복해지는저금 진행바 — SavingsProgressPanel 재사용 */}
      <SavingsProgressPanel
        happySavings={happySavings}
        becomeSavings={becomeSavings}
        goalAmount={goalAmount}
        goalType={goalType}
      />

      {/* 월별 기록 목록 — SavingsRecordList 재사용 */}
      {records.length > 0 && (
        <SavingsRecordList records={records} onRecordClick={setSelectedRecord} />
      )}

      {/* 기록 상세 모달 — SavingsRecordModal 재사용 */}
      {selectedRecord && (
        <SavingsRecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}

export default AchievementDetailPage;
