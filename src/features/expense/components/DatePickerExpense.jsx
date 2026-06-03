import React, { useRef, useState, forwardRef, Fragment, useEffect } from 'react'
import { ko } from 'date-fns/locale/ko'
import DatePicker from 'react-datepicker'
import DisClosure from '../../../assets/icons/common/DisClosure'
import { getMonth, getYear } from 'date-fns'
import ChevronRight from '../../../assets/icons/common/ChevronRight'
import ChevronLeft from '../../../assets/icons/common/ChevronLeft'

const DatePickerExpense = ({
  formData,
  setFormData,
  datetype,
}) => {
  const datePickerRef = useRef(null);
  const [tempDate, setTempDate] = useState(formData[datetype]);
  const [prevDate, setPrevDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const startDate = formData?.repeatStartDate;
  const getMinDate = () => {
    // startDate가 없거나 현재 날짜 타입이 종료일(repeat_end_date)이 아니라면 제한 없음
    if (!startDate || datetype !== 'repeatEndDate') return null;

    // 복사본을 만들어 복사본의 날짜를 변경 (formData 원본 유지)
    const minDateCopy = new Date(startDate);
    minDateCopy.setDate(minDateCopy.getDate() + 1);
    
    return minDateCopy;
  };

  useEffect(() => {
    setTempDate(formData[datetype]);
    setPrevDate(formData[datetype]);
  }, [formData[datetype]]);

  const handleConfirm = () => {
    // 임시 날짜를 확정 날짜로 반영
    setFormData(prev => ({
      ...prev,
      [datetype]: tempDate
    }))

    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false); // 캘린더 강제 닫기
    }

    console.log('tempDate: ', tempDate);
  };

  const handleCancel = () => {
    // 취소 시 이전 날짜로, 임의로 선택한 날짜 이전에 선택한 날짜
    setTempDate(prevDate);

    if (datePickerRef.current) {
      datePickerRef.current.setOpen(false); // 캘린더 강제 닫기
    }
  };

  // datePicker input 커스텀
  const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) =>
    <div className={`custom-input ${value ? "" : "none"}`} onClick={onClick} ref={ref}>
      {value ? value : placeholder} <div className='disclosure'><DisClosure fill='#E6E8EA' /></div>
    </div>
  );

  const CustomHeader = ({
    date,
    changeMonth,
  }) => {
    const currentYear = getYear(date);
    const currentMonth = getMonth(date);

    return (
      <div className='header'>
        <div
          onClick={() => changeMonth(currentMonth - 1)}   // ← 1년 전
        >
          <ChevronLeft stroke='#75C0D1' />
        </div>

        <div>
          {currentYear} . {currentMonth + 1}
        </div>

        <div
          onClick={() => changeMonth(currentMonth + 1)}   // ← 1년 후
        >
          <ChevronRight stroke='#75C0D1' />
        </div>
      </div>
    );
  };

  return (
    <DatePicker
      locale={ko}
      ref={datePickerRef}
      selected={tempDate}
      onChange={(date) => setTempDate(date)}
      dateFormat={"YYYY년 M월 d일"}
      popperPlacement='bottom-start'
      customInput={<CustomInput />}
      renderCustomHeader={CustomHeader}
      popperClassName="date-picker-popper"
      wrapperClassName="date-picker-wrapper"
      showPopperArrow={false}
      shouldCloseOnSelect={false}
      fixedHeight={false}
      placeholderText="년/월/일"
      minDate={getMinDate()}
    >
      <div className='devider' />
      <div className='btn-content'>
        <button type="button" className='cancle' onClick={handleCancel}>취소</button>
        <button type="button" className='confirm' onClick={handleConfirm}>확인</button>
      </div>
    </DatePicker>
  )
}
export default DatePickerExpense