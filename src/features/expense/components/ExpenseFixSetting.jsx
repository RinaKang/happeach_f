import React from 'react'
import DatePicker from './DatePickerExpense';

const ExpenseFixSetting = ({
  formData,
  setFormData,
  weekList,
}) => {
  const handlePeriod = (e) => {
    const period = e.currentTarget.dataset.value;

    setFormData(prev => ({
      ...prev,
      repeatCycle: period,
      // 매일/매주/매달 버튼 누를 때마다 주기 초기화
      repeatDays: [],
    }))
  };

  const handleCycle = (value) => {
    setFormData((prev) => {
      // 1. 현재 배열 가져오기 (formData 내부의 selectedCycle)
      const currentCycles = prev.repeatDays;

      // 2. 새 배열 계산
      const nextCycles = currentCycles.includes(value)
        ? currentCycles.filter((item) => item !== value) // 제거
        : [...currentCycles, value]; // 추가

      // 3. 전체 객체 업데이트
      return {
        ...prev,           // 다른 필드들 유지
        repeatDays: nextCycles // 변경된 배열로 덮어쓰기
      }
    });
  };

  return (
    <div className='fix-setting'>
      <div className='cycle-setting'>
        <div className='label'>반복주기</div>

        <div className='setting-bar'>
          <div
            data-value='DAILY'
            className={`tab ${formData.repeatCycle === 'DAILY' ? 'selected' : ''}`}
            onClick={handlePeriod}
          >
            매일
          </div>
          <div
            data-value='WEEKLY'
            className={`tab ${formData.repeatCycle === 'WEEKLY' ? 'selected' : ''}`}
            onClick={handlePeriod}
          >
            매주
          </div>
          <div
            data-value='MONTHLY'
            className={`tab ${formData.repeatCycle === 'MONTHLY' ? 'selected' : ''}`}
            onClick={handlePeriod}
          >
            매월
          </div>
        </div>
        {formData.repeatCycle === 'WEEKLY' &&
          <div className='cycle'>
            {formData.repeatCycle && weekList.map((week) => {
              return (
                <div
                  key={week.value}
                  className={`cycle-chip ${formData.repeatDays.includes(week.value) ? 'selected' : ''}`}
                  onClick={() => handleCycle(week.value)}
                >
                  {week.label}
                </div>
              );
            })}
          </div>}

        {formData.repeatCycle === 'MONTHLY' &&
          <div className='cycle'>
            {formData.repeatCycle && Array.from({ length: 31 }, (_, i) => {
              return (
                <div
                  key={i + 1}
                  className={`cycle-chip ${formData.repeatDays.includes(i + 1) ? 'selected' : ''}`}
                  onClick={() => handleCycle(i + 1)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>}
      </div>
      <div className='start-date'>
        <div className='label'>시작일</div>
        <div className='input-content'>
          <DatePicker
            formData={formData}
            setFormData={setFormData}
            datetype={'repeatStartDate'}
          />
        </div>
      </div>
      <div className='end-date'>
        <div className='label'>종료일</div>
        <div className='input-content'>
          <DatePicker
            formData={formData}
            setFormData={setFormData}
            datetype={'repeatEndDate'}
          />
        </div>
      </div>
    </div>
  )
}

export default ExpenseFixSetting