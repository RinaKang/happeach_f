import { useNavigate } from 'react-router-dom';
import MonthSelector from './components/MonthSelector';
import ReportSummaryRow from './components/ReportSummaryRow';
import EmotionSpendingSection from './components/emotion/EmotionSpendingSection';
import EmotionSatisfactionSection from './components/correlation/EmotionSatisfactionSection';
import HappyBankNudgeBanner from './components/summary/HappyBankNudgeBanner';
import useMonthlyReport from './hooks/useMonthlyReport';
import useHappyBank from '../happyBank/hooks/useHappyBank';
import './styles/page.css';

function ReportPage() {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate, report, isLoading, error, availableMonths } = useMonthlyReport();
  // 넛지 배너 클릭 시 통장 유무에 따라 분기
  const { banks } = useHappyBank();

  const handleNudgeBanner = () => {
    if (banks.length === 0) {
      // 통장이 없으면 개설 화면으로
      navigate('/happybank/setup');
    } else {
      // 통장이 있으면 첫 번째 통장의 저금 화면으로, 기본값 '행복해지는 저금'
      navigate(`/happybank/${banks[0].id}/deposit`, { state: { initialType: 'become' } });
    }
  };

  if (isLoading) return <div className="reportPage" />;

  if (error || !report || report.emotionRatio.length === 0) return (
    <div className="reportPage">
      <div style={{ marginLeft: '8px' }}>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} availableMonths={availableMonths} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', paddingTop: '80px' }}>
        <p style={{ margin: 0, color: '#FFB0AD', fontFamily: 'Pretendard', fontSize: '14px', fontStyle: 'normal', fontWeight: 500, lineHeight: '130%' }}>이달의 기록이 없습니다</p>
      </div>
    </div>
  );

  const { totalExpense, emotionCount, emotionRatio, satisfactionByEmotion } = report;

  // 지배 감정의 지출 비율이 평균 대비 얼마나 높은지 (상대적 초과율)
  const insightRate = (() => {
    if (!emotionRatio || emotionRatio.length < 2) return null;
    const avgRatio = emotionRatio.reduce((sum, e) => sum + e.ratio, 0) / emotionRatio.length;
    if (avgRatio === 0) return null;
    return Math.round(((emotionRatio[0].ratio - avgRatio) / avgRatio) * 100);
  })();

  // 1위 감정이 부정 감정일 때 넛지 배너 표시
  const NEGATIVE_EMOTIONS = new Set(['우울', '스트레스', '충동']);
  const showNudgeBanner = emotionRatio.length > 0 && NEGATIVE_EMOTIONS.has(emotionRatio[0].emotion);

  return (
    <div className="reportPage">
      <div style={{ marginLeft: '8px' }}>
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} availableMonths={availableMonths} />
      </div>
      <ReportSummaryRow totalExpense={totalExpense} emotionCount={emotionCount} />
      <EmotionSpendingSection data={emotionRatio} insightRate={insightRate} />
      {satisfactionByEmotion.length > 0 && <EmotionSatisfactionSection data={satisfactionByEmotion} />}
      {showNudgeBanner && <HappyBankNudgeBanner onPress={handleNudgeBanner} />}
    </div>
  );
}

export default ReportPage;
