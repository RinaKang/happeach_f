import React from 'react'
import { useNavigate } from 'react-router-dom';
import AlertRoundFillIcon from '../../../assets/icons/calendar/AlertRoundFill.jsx';
import ChevronRight from '../../../assets/icons/common/ChevronRight.jsx';

const AlertBanner = ({
  reEvaData,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    // 1. 데이터가 있는지, 배열이 비어있지 않은지 안전하게 확인
    if (reEvaData && reEvaData.length > 0) {
      // 2. 첫 번째 요소의 pk 추출
      const firstPk = reEvaData[0].expenseId
;

      // 3. /expense/:pk 경로로 이동
      navigate(`/expense/${firstPk}`, {
        state: {
          data: reEvaData[0],
          mode: 'reevaluated'
        }
      });
    } else {
      console.error("데이터를 찾을 수 없습니다.");
    }
  };

  return (
    <div className='alert-CTA-banner' onClick={handleEdit}>
      <AlertRoundFillIcon className='alert-icon' />
      <div className='alert-text'>재평가 하지 않은 기록이 {reEvaData.length}건 있어요!</div>
      <ChevronRight className='left-icon' />
    </div>
  )
}

export default AlertBanner