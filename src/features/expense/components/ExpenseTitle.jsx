import React from 'react'
import Delite from '../../../assets/icons/common/Delite'

const ExpenseTitle = ({
  formData,
  setFormData,
  IconComponent,
  handleChange,
  targetCategory,
}) => {
  const handleDeleteTitle = () => {
    setFormData(prev => ({
      ...prev,
      title: '',
    }));
  };

  return (
    <div className='title-contents'>
      <div
        className='title-icon'
        style={{ backgroundColor: targetCategory?.color?.background || 'var(--Category-Light-pink, rgba(255, 176, 173, 0.20)' }}
      >
        {IconComponent &&
          <IconComponent
            width={34}
            height={34}
          />}
      </div>
      <div className='title-content'>
        <label for='title'>{formData?.type === 'INCOME' ? '수입명' : '지출명'}</label>
        <div tabindex="0" className='input-content'>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='입력하기'
            value={formData?.title}
            onChange={handleChange}
          ></input>
          <div className='clear' onClick={handleDeleteTitle}>
            <Delite />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseTitle