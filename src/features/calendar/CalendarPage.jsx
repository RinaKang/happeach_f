import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import testTransactions from '../../assets/data/expense4.json';
import testReEvaTransactions from '../../assets/data/expense5.json';
import testMonth from '../../assets/data/expense6.json';
import testWeek from '../../assets/data/expense7.json';
import testDay from '../../assets/data/expense8.json';
import testReEva from '../../assets/data/expense9.json';
import ListIcon from '../../assets/icons/calendar/List.jsx';
import CalendarIcon from '../../assets/icons/calendar/Calendar.jsx';
import DatePicker from './components/DatePickerCalendar.jsx';
import MonthlyAmount from './components/MonthlyAmount.jsx';
import GoExpense from './components/GoExpense.jsx';
import './styles/CalendarPage.css';
import TransactionHistory from './components/TransactionHistory.jsx';
import CalendarBody from './components/CalendarBody.jsx';
import { formatDate } from './hook/dateUtil.js';
import AlertBanner from './components/AlertBanner.jsx';
import { getUserIdFromToken } from './hook/auth.js';
import { useDaysMap } from './hook/useDaysMap.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CalendarPage = () => {
  const navigate = useNavigate();
  const { year, month } = useParams();
  const isFirstRender = useRef(true); // 새로고침(첫 렌더링)인지 확인용

  // 숫자로 변환 (값이 없을 경우를 대비해 현재 날짜를 초기값으로 설정)
  const currentYear = parseInt(year) || new Date().getFullYear();
  const currentMonth = parseInt(month) || new Date().getMonth() + 1;

  const currentDate = new Date(); //오늘
  const [selectedDate, setSelectedDate] = useState(new Date); // 선택된 날짜

  const [isWeekView, setIsWeekView] = useState(true); // 주간달력인가요? true 디폴트

  const [weekStartDate, setWeekStartDate] = useState(null); // 한 주의 시작 날짜 구하기(월요일 날짜)

  // 백엔드에서 가져온 데이터 (오늘 기준 3일 이내, )
  const [reEvaData, setReEvaData] = useState([]);

  // 한 주의 시작 날짜 가져오기 함수
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(date);
    start.setDate(date.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // monthly 데이터
  const [monthData, setMonthData] = useState();
  // weekly 데이터
  const [weekData, setWeekData] = useState();
  const [dayData, setDayData] = useState();

  // 전체 거래 데이터 불러오기 (한 번만 실행)
  const fetchData = async () => {
    const userId = getUserIdFromToken();

    try {
      // GET /expenses/calendar/monthly?userId=1&year=2026&month=3
      const response = await axios.get(`${BASE_URL}/expenses/calendar/monthly`, {
        params: {
          userId: userId,
          year: currentYear,
          month: currentMonth
        }
      });
      setMonthData({
        // 값이 없으면 프론트에서 임의로 0이나 빈 배열로 초기화
        monthIncome: response.data?.monthIncome ?? 0,
        monthExpense: response.data?.monthExpense ?? 0,
        reevaluationCount: response.data?.reevaluationCount ?? 0,
        days: response.data.days || [] // map 에러 방지를 위해 빈 배열 필수!
      });
    } catch (error) {
      console.error("거래 데이터 불러오기 실패", error);
    }
  };

  const getWeekData = async () => {
    const userId = getUserIdFromToken();

    try {
      const date = formatDate(selectedDate);
      //GET /expenses/calendar/weekly?userId=1&date=2026-03-21
      const response = await axios.get(`${BASE_URL}/expenses/weekly`, {
        params: {
          userId: userId, // 1
          date: date      // '2026-03-21'
        }
      });
      // console.log('주간 데이터 ', response.data);
      setWeekData(response.data || []);
    } catch (error) {

    }
  };
  const getDayData = async () => {
    const userId = getUserIdFromToken();

    try {
      const date = formatDate(selectedDate);
      //GET /expenses/daily?userId=1&date=2026-03-21
      const response = await axios.get(`${BASE_URL}/expenses/daily`, {
        params: {
          userId: userId, // 1
          date: date      // '2026-03-21'
        }
      });
      setDayData(response.data || []);
    } catch (error) {

    }
  };

  const fetchReevaluatedData = async () => {
    const userId = getUserIdFromToken();

    try {
      // 재평가가 필요한 데이터 불러오기 
      //GET /expenses/reevaluation?userId={id}
      const response = await axios.get(`${BASE_URL}/expenses/reevaluation`, {
        params: {
          userId: userId, // 1
        }
      });
      // const response = testReEva;
      setReEvaData(response?.data.items || []);
      // console.log("재평가대상", response.data.items);
    } catch (error) {
      setReEvaData([]);
    }
  };


  useEffect(() => {
    // 컴포넌트가 처음 나타날 때(새로고침 포함) 실행
    if (isFirstRender.current) {
      const todayYear = currentDate.getFullYear();
      const todayMonth = currentDate.getMonth() + 1;

      // 현재 URL이 오늘 날짜와 다르다면 오늘 날짜로 강제 이동
      if (currentYear !== todayYear || currentMonth !== todayMonth) {
        navigate(`/calendar/${todayYear}/${String(todayMonth).padStart(2, '0')}`, { replace: true });
      }

      const initialWeekStart = getStartOfWeek(currentDate);
      setWeekStartDate(initialWeekStart);
      setSelectedDate(currentDate);

      isFirstRender.current = false;

      fetchReevaluatedData(); // 재평가해야되는 내역들
      // console.log("마운트 시점에만 동작");
    }
  }, []); // '마운트 시점'에만 동작

  useEffect(() => {
    fetchData();
  }, [currentYear, currentMonth])

  useEffect(() => {
    getWeekData();
    getDayData();
  }, [selectedDate])

  // useEffect(() => {
  //   console.log('선택된 날', selectedDate);
  // }, [selectedDate]);


  // ==================== 월 이동 ====================
  const moveToMonth = (newMonthDate) => {
    const targetYear = newMonthDate.getFullYear();
    const targetMonth = newMonthDate.getMonth();

    let newSelectedDay = selectedDate.getDate();
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    if (newSelectedDay > lastDay) newSelectedDay = lastDay;

    const newSelectedDate = new Date(targetYear, targetMonth, newSelectedDay);
    setSelectedDate(newSelectedDate);
    setIsWeekView(false);
  };


  const showSelectedWeek = () => {
    setWeekStartDate(getStartOfWeek(selectedDate));
    setIsWeekView(true);
  };

  const showFullMonth = () => {
    setIsWeekView(false);
    setWeekStartDate(null);

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;

    if (currentYear !== selectedYear || currentMonth !== selectedMonth) {
      navigate(`/calendar/${selectedYear}/${String(selectedMonth).padStart(2, '0')}`);
    }
  };


  return (
    <div className={`calendar ${isWeekView ? 'week' : 'month'}`}>
      <div className='calendar-header'>
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          moveToMonth={moveToMonth}
          currentYear={currentYear}
          currentMonth={currentMonth}
        />

        <div className='view-toggle'>
          <div
            className={`switch ${isWeekView ? 'on' : ''}`}
            onClick={showSelectedWeek}
          >
            <ListIcon stroke={`${isWeekView ? '#FFB0AD' : 'white'}`}/>
          </div>
          <div
            className={`switch ${!isWeekView ? 'on' : ''}`}
            onClick={showFullMonth}
          >
            <CalendarIcon stroke={`${!isWeekView ? '#FFB0AD' : 'white'}`} />
          </div>
        </div>
      </div>


      <MonthlyAmount
        monthData={monthData}
      />


      <CalendarBody
        isWeekView={isWeekView}
        setIsWeekView={setIsWeekView}
        weekStartDate={weekStartDate}
        setWeekStartDate={setWeekStartDate}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentDate={currentDate}
        getStartOfWeek={getStartOfWeek}
        moveToMonth={moveToMonth}
        currentYear={currentYear}
        currentMonth={currentMonth}
        monthData={monthData}
        weekData={weekData}
      />

      {isWeekView && (
        <div className='transaction-section'>
          {reEvaData.length !== 0 &&
            <AlertBanner
              reEvaData={reEvaData}
            />
          }
          <TransactionHistory
            dayData={dayData}
            selectedDate={selectedDate}
          />
        </div>
      )}
      <GoExpense />
    </div>
  )
}

export default CalendarPage