import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../hook/dateUtil.js';
import { useDaysMap } from '../hook/useDaysMap.js';
import { useWeeksMap } from '../hook/useWeeksMap.js';

const CalendarBody = ({
  isWeekView,
  setIsWeekView,
  weekStartDate,
  setWeekStartDate,
  selectedDate,
  setSelectedDate,
  currentDate,
  getStartOfWeek,
  moveToMonth,
  currentYear,
  currentMonth,
  monthData,
  weekData,
}) => {
  const navigate = useNavigate();
  // 캘린더 드래그로 넘기기
  const calendarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const monthdata = useDaysMap(monthData?.days);
  const weekdata = useWeeksMap(weekData);

  useEffect(() => {
    console.log('CalendarBody monthdata', monthdata);
  }, [monthdata])

  // 드래그 이벤트
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
    setTranslateX(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    setTranslateX(currentX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const threshold = 80;
    if (isWeekView) {
      if (translateX > threshold) goToPrevWeek();
      else if (translateX < -threshold) goToNextWeek();
    } else {
      if (translateX > threshold) goToPrevMonth();
      else if (translateX < -threshold) goToNextMonth();
    }
    setIsDragging(false);
    setTranslateX(0);
  };

  // ==================== 월 이동 ====================
  // const goToPrevMonth = () => moveToMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  // const goToNextMonth = () => moveToMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      navigate(`/calendar/${currentYear - 1}/12`);
      moveToMonth(new Date(currentYear - 1, 11, 1))
    } else {
      const prevMonth = currentMonth - 1;
      // 숫자를 2자리 문자열로 변환 (예: 2 -> "02")
      const formattedMonth = String(prevMonth).padStart(2, '0');

      navigate(`/calendar/${currentYear}/${formattedMonth}`);
      moveToMonth(new Date(currentYear, prevMonth - 1, 1))
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      navigate(`/calendar/${currentYear + 1}/1`);
      moveToMonth(new Date(currentYear + 1, 0, 1))
    } else {
      const nextMonth = currentMonth + 1;
      // 숫자를 2자리 문자열로 변환 (예: 2 -> "02")
      const formattedMonth = String(nextMonth).padStart(2, '0');

      navigate(`/calendar/${currentYear}/${formattedMonth}`);
      moveToMonth(new Date(currentYear, nextMonth - 1, 1))
    }
  };

  // ==================== 주간 이동 ====================
  const goToPrevWeek = () => {
    const newSelected = new Date(selectedDate);
    newSelected.setDate(newSelected.getDate() - 7);
    setSelectedDate(newSelected);
    setWeekStartDate(getStartOfWeek(newSelected));

    if (newSelected.getMonth() + 1 !== currentMonth) {
      const newYear = newSelected.getFullYear();
      const newMonth = newSelected.getMonth() + 1;
      const formattedMonth = String(newMonth).padStart(2, '0');

      navigate(`/calendar/${newYear}/${formattedMonth}`);
    }
  };

  const goToNextWeek = () => {
    const newSelected = new Date(selectedDate);
    newSelected.setDate(newSelected.getDate() + 7);
    setSelectedDate(newSelected);
    setWeekStartDate(getStartOfWeek(newSelected));

    if (newSelected.getMonth() + 1 !== currentMonth) {
      const newYear = newSelected.getFullYear();
      const newMonth = newSelected.getMonth() + 1;
      const formattedMonth = String(newMonth).padStart(2, '0');

      navigate(`/calendar/${newYear}/${formattedMonth}`);
    }
  };

  // 요일 표기 
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

  // 캘린더 날짜 생성
  const daysToRender = useMemo(() => {
    const days = [];

    if (isWeekView && weekStartDate) {
      for (let i = 0; i < 7; i++) {
        const thisDay = new Date(weekStartDate);
        thisDay.setDate(weekStartDate.getDate() + i);
        days.push({
          fullDate: thisDay,
          weekday: weekdays[thisDay.getDay() === 0 ? 6 : thisDay.getDay() - 1],
          dateKey: formatDate(thisDay),
        });
      }
    } else {
      // 월간 달력 로직 (기존 그대로)
      // 선택한 날의 년, 월
      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();
      // url의 년, 월
      const year = currentYear;
      const month = currentMonth;

      let daysInMonth = new Date(year, month, 0).getDate();
      let firstDay = new Date(year, month - 1, 1).getDay();
      let adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

      if (selectedYear === year && selectedMonth + 1 === month) {
        daysInMonth = new Date(year, month, 0).getDate();
        firstDay = new Date(year, month - 1, 1).getDay();
        adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
      } else {
        daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
        adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
      }

      for (let i = 0; i < adjustedFirstDay; i++) days.push(null);

      for (let day = 1; day <= daysInMonth; day++) {
        const thisDate = new Date(year, month - 1, day);
        days.push({
          fullDate: thisDate,
          weekday: weekdays[thisDate.getDay() === 0 ? 6 : thisDate.getDay() - 1],
          dateKey: formatDate(thisDate),
        });
      }
    }
    return days;
  }, [isWeekView, weekStartDate, selectedDate, currentYear, currentMonth]);

  // 특정 날짜의 수입/지출 
  const getDailyAmount = (dateKey) => {
    const dayData = isWeekView ? weekdata[dateKey] || { income: 0, expense: 0 } : monthdata[dateKey] || { income: 0, expense: 0 };
    const dayIncome = dayData?.income;
    const dayExpense = dayData?.expense;

    return {
      income: dayIncome.toLocaleString(),
      expense: dayExpense.toLocaleString()
    };
  };

  const handleDateClick = (dayInfo) => {
    if (!dayInfo) return;

    const clickedDate = dayInfo.fullDate;
    setSelectedDate(clickedDate);

    if (!isWeekView) {
      setIsWeekView(true);           // 월간 → 주간으로 전환
    }

    if (clickedDate.getMonth() + 1 !== currentMonth) {
      const newYear = clickedDate.getFullYear();
      const newMonth = clickedDate.getMonth() + 1;
      const formattedMonth = String(newMonth).padStart(2, '0');

      navigate(`/calendar/${newYear}/${formattedMonth}`);
    }
    setWeekStartDate(getStartOfWeek(clickedDate));
  };

  return (
    <div
      className='calendar-body'
      ref={calendarRef}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <div className='weekdays'>
        {weekdays.map((day, idx) => <div key={idx} className="weekday">{day}</div>)}
      </div>

      <div className='calendar-grid'>
        {daysToRender.map((dayInfo, index) => {
          if (!dayInfo) return <div key={index} className="day empty" />;

          const dayDate = dayInfo.fullDate;

          const isSelected = selectedDate.getFullYear() === dayDate.getFullYear() &&
            selectedDate.getMonth() === dayDate.getMonth() &&
            selectedDate.getDate() === dayDate.getDate();

          const isToday = currentDate.getFullYear() === dayDate.getFullYear() &&
            currentDate.getMonth() === dayDate.getMonth() &&
            currentDate.getDate() === dayDate.getDate();

          const { income, expense } = getDailyAmount(dayInfo.dateKey);

          return (
            <div
              key={index}
              className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => handleDateClick(dayInfo)}
            >
              <div className={`day-number ${isToday ? 'today' : ''}`}>
                {dayDate.getDate()}
              </div>
              <div className='amounts'>
                {income !== '0' ? (
                  <div className="income">
                    +{income.toLocaleString()}
                  </div>
                ) : <></>}
                {expense !== '0' ? (
                  <div className="expense">
                    -{expense.toLocaleString()}
                  </div>
                ) : <></>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarBody