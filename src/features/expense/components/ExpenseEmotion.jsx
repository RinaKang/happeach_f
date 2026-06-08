import React from 'react'
import axios from 'axios';
import ChevronRight from '../../../assets/icons/common/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../../calendar/hook/auth.js';
import { formatDate } from '../../calendar/hook/dateUtil.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ExpenseEmotion = ({
  formData,
  setFormData,
  emotionOptions,
  satisfactionOptions,
  isEditMode,
  isReEva,
  id,
}) => {
  const navigate = useNavigate();

  const handleEmotion = (val) => {
    // 이미 선택된 걸 다시 누르면 null로 초기화(해제), 아니면 새로운 값 세팅
    setFormData((prev) => ({
      ...prev,
      emotion: prev.emotion === val ? null : val
    }));
  };

  const handleSatisfaction = (val) => {
    // 이미 선택된 걸 다시 누르면 null로 초기화(해제), 아니면 새로운 값 세팅
    setFormData((prev) => ({
      ...prev, //
      evaluation: prev.evaluation === val ? null : val
    }));
  };

  const goHappyBank = async () => {
    const userId = getUserIdFromToken();

    // 1. formatDate로 구한 날짜 문자열("2026-04-26") 뒤에 "T00:00:00"을 바로 붙여줍니다.
    const formattedDate = formatDate(formData.paymentAt); // "2026-04-26"
    const localDateTimeString = formattedDate ? `${formattedDate}T00:00:00` : null; // "2026-04-26T00:00:00"

    // 2. 서버에 보낼 데이터를 그 자리에서 완벽하게 합치기 (날짜 보정 + userId 주입)
    const submitData = {
      ...formData,
      userId: userId,                // 작성 시 필요한 userId 확실하게 주입
      paymentAt: localDateTimeString // 시차 오류 없는 백엔드 맞춤형 날짜 주입
    };

    // 3. 컴포넌트 state도 동기화 (필요시)
    setFormData(submitData);
    // 행복해지는 저금으로 가기전 일단 가계부 저장
    try {
      if (isReEva) {
        // 재평가
        await axios.patch(`${BASE_URL}/expenses/${id}/reevaluate?evaluation=${submitData.evaluation}`, {})
        // console.log('가계부 저장 재평가', submitData);

      } else if (isEditMode) {
        // 수정
        await axios.put(`${BASE_URL}/expenses/${id}`, submitData);
        // console.log('가계부 저장 수정', submitData);

      } else {
        // 가계부 작성
        await axios.post(`${BASE_URL}/expenses`, submitData);
        // console.log('가계부 저장 작성', submitData);

      }
    } catch (error) {
      console.log(error);
    }

    // 그 후에 행복저금으로 이동
    navigate(`/happybank`);
  };

  return (
    <div className='expense-section'>
      <div className='emotion-section'>
        <div className='emotion-label'>감정</div>
        <ul className='emotion-option-container'>
          {formData.type === "EXPENSE" && emotionOptions.map((emo) => {
            const isSelected = formData.emotion === emo.value;

            return (
              <li key={emo.value} value={emo.value} className='emotion-btn' onClick={() => handleEmotion(emo.value)}>
                <div className={`emotion-icon ${isSelected ? 'selected' : ''}`}>{emo.icon}</div>
                <div className={`emotion-name ${isSelected ? 'selected' : ''}`}>{emo.label}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='satisfaction-section'>
        <div className='satisfaction-label'>소비 만족도</div>
        <ul className='satisfaction-option-container'>
          {formData.type === "EXPENSE" && satisfactionOptions.map((sat) => {
            const isSelected = formData.evaluation === sat.value;

            return (
              <li key={sat.value} value={sat.value} className='satisfaction-btn' onClick={() => handleSatisfaction(sat.value)}>
                <div className={`satisfaction-icon ${isSelected ? 'selected' : ''}`}>{sat.icon}</div>
                <div className={`satisfaction-name ${isSelected ? 'selected' : ''}`}>{sat.label}</div>
                <div className={`satisfaction-name ${isSelected ? 'selected' : ''}`}>{sat.percent}</div>
              </li>
            );
          })}
        </ul>
      </div>
      {(formData.emotion === "DEPRESSED" || formData.emotion === "STRESSED" || formData.emotion === "IMPULSIVE") && (formData.evaluation === 0 || formData.evaluation === 1) &&
        <div className='alert-banner' onClick={goHappyBank}>
          {!isReEva ?
            <div className='alert-text'>
              <div className='text1'>현재 소비 감정, 만족도가 낮아요</div>
              <div className='text2'>행복 저금으로 기분을 전환해볼까요?</div>
            </div> :
            <div className='alert-text'>
              <div className='text1'>만족스럽지 않은 소비였나요?</div>
              <div className='text2'>행복 저금으로 기분을 전환해볼까요?</div>
            </div>}
          <ChevronRight stroke="#F7645F" />
        </div>
      }
    </div >
  )
}

export default ExpenseEmotion