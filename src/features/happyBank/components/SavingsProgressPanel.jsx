import { useEffect, useState } from 'react';
import '../styles/SavingsProgressPanel.css';

function SavingsProgressPanel({ happySavings, becomeSavings, goalAmount, goalType }) {
  const totalSavings = happySavings + becomeSavings;

  // 목표 유형에 따라 프로그레스바 기준값이 달라짐
  // - 목표 금액(amount): 목표 금액 대비 각각의 저금 비율
  // - 목표 기간(period): 목표 금액이 없으므로 전체 합계 기준으로 행복저금 vs 행복해지는저금 비율을 표시
  const base = goalType === 'period' ? totalSavings : goalAmount;
  const targetHappy = base > 0 ? Math.min((happySavings / base) * 100, 100) : 0;
  const targetBecome = base > 0 ? Math.min((becomeSavings / base) * 100, 100) : 0;

  // 렌더 직후 바로 목푯값으로 세팅하면 CSS transition이 동작하지 않음
  // 0에서 시작해 100ms 후 실제 값으로 변경해 애니메이션 효과를 줌
  const [happyPercent, setHappyPercent] = useState(0);
  const [becomePercent, setBecomePercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHappyPercent(targetHappy);
      setBecomePercent(targetBecome);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetHappy, targetBecome]);

  return (
    <div className="savingsProgressPanel">
      <div className="savingsProgressPanel__card">
        <p className="savingsProgressPanel__label">행복저금</p>
        <p className="savingsProgressPanel__amount">{happySavings.toLocaleString('ko-KR')}원</p>
        <div className="savingsProgressPanel__barTrack">
          <div
            className="savingsProgressPanel__barFill savingsProgressPanel__barFill--happy"
            style={{ width: `${happyPercent}%` }}
          />
        </div>
      </div>

      <div className="savingsProgressPanel__card">
        <p className="savingsProgressPanel__label">행복해지는 저금</p>
        <p className="savingsProgressPanel__amount">{becomeSavings.toLocaleString('ko-KR')}원</p>
        <div className="savingsProgressPanel__barTrack">
          <div
            className="savingsProgressPanel__barFill savingsProgressPanel__barFill--become"
            style={{ width: `${becomePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default SavingsProgressPanel;
