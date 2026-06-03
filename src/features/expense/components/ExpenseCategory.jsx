import React, { useState, Fragment, useRef } from 'react'
import DisClosure from '../../../assets/icons/common/DisClosure';
import ChevronUp from '../../../assets/icons/common/ChevronUp';
import { useOutsideClick } from '../hook/useOutsideClick';

const ExpenseCategory = ({
  formData,
  setFormData,
  categoryOptions,
  targetCategory,
  IconComponent
}) => {
  const [isVisibleC, setIsVisibleC] = useState(false);
  const dropdownRef = useRef(null);

  const handleCat = () => {
    setIsVisibleC(!isVisibleC);
  };

  const handleCatChange = (e) => {
    const category = e.currentTarget.id;

    setIsVisibleC(!isVisibleC);
    setFormData(prev => ({
      ...prev,
      category: category,
    }));
  };

  // 드랍다운 외 클릭시 드랍다운 꺼짐 
  useOutsideClick(dropdownRef, () => setIsVisibleC(false));

  return (
    <div className='category-content'>
      <div className='label'>카테고리 설정</div>
      <div
        ref={dropdownRef}
        className='category-down'
      >
        {!isVisibleC && <button
          type="button"
          className={`category-button ${formData.category === "NONE" ? '' : 'selected'}`}
          onClick={handleCat}
        >
          {formData.category === "NONE" ? '카테고리 없음' : targetCategory?.label || formData.category}
          <div className='chevron'><DisClosure fill='#E6E8EA' /></div>
        </button>}
        {isVisibleC && (
          <ul className="category-list">
            {formData.type && categoryOptions[formData.type].map((cat, index, array) => {
              const IconComponent = cat.icon;

              return (
                <Fragment key={cat.value}>
                  <li key={cat.value} id={cat.value} onClick={handleCatChange}>
                    <div className='category-icon' style={cat.color}>
                      <IconComponent
                        width={14}
                        height={14}
                      />
                    </div>
                    <div className='category-label'>{cat.label}</div>
                    <div className='chevron'>{index === 0 && <ChevronUp />}</div>
                  </li>
                  {index < array.length - 1 && <div className='devider' />}
                </Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ExpenseCategory