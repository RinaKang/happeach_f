import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import { getYear } from 'date-fns';
import ChevronLeft from '../../../assets/icons/common/ChevronLeft';
import ChevronRight from '../../../assets/icons/common/ChevronRight';
import DisClosure from '../../../assets/icons/common/DisClosure';
import '../styles/MonthYearPicker.css';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div className="custom-input" onClick={onClick} ref={ref}>
    {value} <span className="disclosure"><DisClosure fill="#FF9793" /></span>
  </div>
));

const CustomHeader = ({ date, changeYear }) => {
  const currentYear = getYear(date);
  return (
    <div className="header">
      <div onClick={() => changeYear(currentYear - 1)}>
        <ChevronLeft stroke="#75C0D1" />
      </div>
      <div>{currentYear}</div>
      <div onClick={() => changeYear(currentYear + 1)}>
        <ChevronRight stroke="#75C0D1" />
      </div>
    </div>
  );
};

function MonthSelector({ selectedDate, onChange, availableMonths = null }) {
  const today = new Date();

  // 미래의 월은 항상 비활성화
  // availableMonths가 로드된 경우 목록에 없는 월도 비활성화
  const filterDate = (date) => {
    if (date > today) return false;
    if (availableMonths === null) return true; // 로딩 중엔 모두 활성화
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    return availableMonths.has(key);
  };

  return (
    <DatePicker
      locale={ko}
      selected={selectedDate}
      onChange={onChange}
      dateFormat="yyyy년 M월"
      showMonthYearPicker
      maxDate={today}
      filterDate={filterDate}
      popperPlacement="bottom-start"
      showPopperArrow={false}
      renderCustomHeader={CustomHeader}
      customInput={<CustomInput />}
      popperClassName="date-picker-popper"
      wrapperClassName="date-picker-wrapper"
    />
  );
}

export default MonthSelector;
