import React from 'react'
import '../styles/ExpenseMemo.css'

const ExpenseMemo = ({
  formData,
  setFormData,
  handleChange,
}) => {
  return (
    <div className='memo-content'>
      <label for='memo'>메모</label>
      <div className='input-content'>
        <input
          type='text'
          id='memo'
          name='memo'
          placeholder='메모할 내용을 적어 주세요'
          value={formData?.memo}
          onChange={handleChange}
          maxLength={100}
        ></input>
        <span className='char-count'>
          <span className='current'>{formData?.memo?.length || 0}</span>/100
        </span>
      </div>
    </div>
  )
}

export default ExpenseMemo