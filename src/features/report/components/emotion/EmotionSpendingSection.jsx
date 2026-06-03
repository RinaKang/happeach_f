import EmotionDonutChart from './EmotionDonutChart';
import EmotionLegendList from './EmotionLegendList';
import '../../styles/emotion/EmotionSpendingSection.css';
import Feedback from '../../../../assets/icons/common/Feedback';
import Divider from '../../../../assets/icons/common/Devider';

// data[0]이 비율 가장 높은 감정 (API 응답도 내림차순 정렬 기준)
function EmotionSpendingSection({ data, insightRate }) {
  const dominant = data[0];

  return (
    <div className="emotionSpendingSection">
      <p className="emotionSpendingSection__title">감정별 소비 비율</p>
      <div className="emotionSpendingSection__body">
        <EmotionDonutChart data={data} />
        <EmotionLegendList data={data} />
      </div>
      <Divider width={299} />
      {dominant && insightRate !== null && (
        <p className="emotionSpendingSection__insight">
          <Feedback width={24} height={24} stroke="#268097" fill="#EDF6F8" />
          <span style={{ whiteSpace: 'nowrap' }}>
            {dominant.emotion} 상태일 때 지출이 평균 대비{' '}
            <span className="emotionSpendingSection__insightHighlight">+{insightRate}%</span>
            {' '}높아요
          </span>
        </p>
      )}
    </div>
  );
}

export default EmotionSpendingSection;
