import ChevronRight from '../../../../assets/icons/common/ChevronRight';
import '../../styles/summary/HappyBankNudgeBanner.css';

// 부정감정 + 낮은 만족도 패턴 감지 시 행복해지는저금 유도 배너
function HappyBankNudgeBanner({ onPress }) {
  return (
    <button className="happyBankNudgeBanner" type="button" onClick={onPress}>
      <div className="happyBankNudgeBanner__text">
        <p className="happyBankNudgeBanner__main">
          부정 감정 상태일 때 소비 후회 확률이 높아요!
        </p>
        <p className="happyBankNudgeBanner__sub">
          <span className="happyBankNudgeBanner__strong" style={{ whiteSpace: 'nowrap' }}>&apos;행복해지는 저금&apos;을</span> 시작해 볼까요?
        </p>
      </div>
      <ChevronRight width={12} height={12} stroke="#268097" />
    </button>
  );
}

export default HappyBankNudgeBanner;
