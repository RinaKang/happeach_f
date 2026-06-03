import '../styles/DatePickerCalendar.css';
import React, { useRef, useMemo, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { getYear } from 'date-fns';
import ChevronLeft from '../../../assets/icons/common/ChevronLeft';
import ChevronRight from '../../../assets/icons/common/ChevronRight';
import DisClosure from '../../../assets/icons/common/DisClosure';

const DatePickerCalendar = ({
  selectedDate,
  moveToMonth,
  currentYear,
  currentMonth,
}) => {

  const datePickerRef = useRef(null);
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    navigate(`/calendar/${y}/${String(m + 1).padStart(2, '0')}`);
    moveToMonth(new Date(y, m, 1))
  };

  // URL 파라미터를 기반으로 현재 보고 있는 날짜 객체 생성
  const currentDate = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, 1);
  }, [currentYear, currentMonth]);


  // datePicker input 커스텀
  const CustomInput = forwardRef(({ value, onClick }, ref) =>
    <div className='custom-input' onClick={onClick} ref={ref}>
      {value} <span className='disclosure'><DisClosure /></span>
    </div>
  );


  const CustomHeader = ({
    date,
    changeYear,
  }) => {
    const currentYear = getYear(date);

    return (
      <div className='header'>
        <div
          onClick={() => changeYear(currentYear - 1)}   // ← 1년 전
        >
          <ChevronLeft stroke='#75C0D1' />
        </div>

        <div>
          {currentYear}
        </div>

        <div
          onClick={() => changeYear(currentYear + 1)}   // ← 1년 후
        >
          <ChevronRight stroke='#75C0D1' />
        </div>
      </div>
    );
  };


  return (
    <div>
      <DatePicker
        locale={ko}
        ref={datePickerRef}
        selected={currentDate}
        onChange={(date) => {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          if (year !== currentYear || month !== currentMonth) { handleDateChange(date) };
        }}
        dateFormat={"yyyy년 MM월"}
        showMonthYearPicker
        popperPlacement='bottom-start'
        showPopperArrow={false}
        renderCustomHeader={CustomHeader}
        customInput={<CustomInput />}
        popperClassName="date-picker-popper"
        wrapperClassName="date-picker-wrapper"
      />
    </div>
  )

}

export default DatePickerCalendar