import Feedback from '../../../../assets/icons/common/Feedback';
import SatisfactionBarChart from './SatisfactionBarChart';
import '../../styles/correlation/EmotionSatisfactionSection.css';
import Devider from '../../../../assets/icons/common/Devider';

// data[0]이 만족도 가장 높은 감정 (내림차순 정렬 기준)
function EmotionSatisfactionSection({ data }) {
  const highest = data[0];

  return (
    <div className="emotionSatisfactionSection">
      <h3 className="emotionSatisfactionSection__title">감정-만족도 상관관계</h3>
      <p className="emotionSatisfactionSection__subtitle">소비 당시 감정별 평균 만족도 (5점 만점)</p>
      <SatisfactionBarChart data={data} />
      <Devider width={299} />
      {highest && (
        <p className="emotionSatisfactionSection__insight">
          <Feedback width={24} height={24} stroke="#268097" fill="#EDF6F8" />
          <span className="emotionSatisfactionSection__insightHighlight">{highest.emotion}</span>
          상태일 때 소비 만족도가 가장 높아요!
        </p>
      )}
    </div>
  );
}

export default EmotionSatisfactionSection;
