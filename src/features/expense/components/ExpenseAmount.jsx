import React, { useState, useRef, useEffect } from 'react'
import DisClosure from '../../../assets/icons/common/DisClosure';
import Devider from '../../../assets/icons/common/Devider';
import Delite from '../../../assets/icons/common/Delite';
import { useOutsideClick } from '../hook/useOutsideClick';

const ExpenseAmount = ({
  formData,
  setFormData,
  handleChange
}) => {
  const [isVisibleT, setIsVisibleT] = useState(false);
  const dropdownRef = useRef(null);

  const HandleType = () => {
    setIsVisibleT(!isVisibleT);
  };

  const handleTypeChange = (e) => {
    const type = e.currentTarget.id;

    setIsVisibleT(!isVisibleT);
    setFormData(prev => ({
      ...prev,
      type: type,

      // type이 바뀔 때 함께 초기화
      category: "NONE",
      memo: '',
      emotion: null,
      evaluation: null,
    }));
  };

  const handleDeleteAmount = () => {
    setFormData(prev => ({
      ...prev,
      amount: '',
    }));
  };

  // 드랍다운 외의 부분 누르면 드랍다운 사라지기
  useOutsideClick(dropdownRef, () => setIsVisibleT(false));

  return (
    <div className='contents2'>
      <div className='type-content'>
        <div className='label'>유형</div>
        <div
          ref={dropdownRef}
          className="dropdown"
        >
          <button
            type="button"
            className="dropdown-button"
            onClick={HandleType}
          >
            {formData.type === "INCOME" ? "수입" : "지출"}
            <DisClosure fill='#E6E8EA' />
          </button>
          {isVisibleT && (
            <ul className="dropdown-list">
              <li
                key={'INCOME'}
                id={'INCOME'}
                onClick={handleTypeChange}
              >
                수입
              </li>
              <Devider width={100} />
              <li
                key={'EXPENSE'}
                id={'EXPENSE'}
                onClick={handleTypeChange}
              >
                지출
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className='amount-content'>
        <label for='amount'>금액</label>
        <div tabindex="0" className='input-content'>
          <input
            type='number'
            id='amount'
            name='amount'
            placeholder='0원'
            value={formData?.amount}
            onChange={handleChange}
          ></input>
          <div className='clear' onClick={handleDeleteAmount}>
            <Delite />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseAmount