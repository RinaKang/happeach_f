import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/GoExpense.css';
import SymbolIncome from '../../../assets/icons/calendar/SymbolIncome';
import SymbolExpense from '../../../assets/icons/calendar/SymbolExpense';
import SymbolPlus from '../../../assets/icons/calendar/SymbolPlus';


const GoExpense = () => {
  const [isBtnClick, setIsBtnClick] = useState(false);
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);


  const navigate = useNavigate();

  const handleBtnClick = () => {
    setIsBtnClick(prev => !prev);
  };

  const handleIncomeClick = () => {
    navigate('/expense', {
      state: { type: "INCOME" }
    });
  };

  const handleExpenseClick = () => {
    navigate('/expense', {
      state: { type: "EXPENSE" }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // targetRef.current 안에 클릭한 요소가 없으면 → 외부 클릭
      const isInside =
        (btnRef1.current && btnRef1.current.contains(event.target)) ||
        (btnRef2.current && btnRef2.current.contains(event.target));

      if (!isInside) {
        setIsBtnClick(false);
      }
    };

    // 클릭 이벤트 리스너 등록
    document.addEventListener('mousedown', handleClickOutside);

    // cleanup (중요!)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBtnClick]);

  return (
    <>
      {isBtnClick && <div className="modal-overlay" />}
      <div className='go-expense'>
        {isBtnClick && (<>
          <div
            className='expense-fab'
            onClick={() => handleIncomeClick()}
            ref={btnRef1}
          >
            <div className='fab-text'>
              <div className='symbol-box'><SymbolIncome /></div>수입
            </div>
          </div>
          <div
            className='expense-fab'
            onClick={() => handleExpenseClick()}
            ref={btnRef2}
          >
            <div className='fab-text'>
              <div className='symbol-box'><SymbolExpense /></div>지출</div>
          </div>
        </>)}
        <div
          className='go-expense-btn'
          onClick={() => handleBtnClick()}
        >
          <SymbolPlus />
        </div>
      </div>
    </>

  )
}

export default GoExpense