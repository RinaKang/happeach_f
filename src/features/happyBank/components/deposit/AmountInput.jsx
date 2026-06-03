import { useState } from 'react';
import Feedback from '../../../../assets/icons/common/Feedback';
import '../../styles/deposit/AmountInput.css';
import Delite from '../../../../assets/icons/common/Delite';

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 1_000_000;

function AmountInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const numeric = value ? Number(value) : 0;
  const hasError = isTouched && !isFocused && (!value || numeric < MIN_AMOUNT);
  const formatted = value ? numeric.toLocaleString('ko-KR') : '';

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (Number(raw) <= MAX_AMOUNT) onChange(raw);
  };

  const handleDelete = () => {
    onChange('');
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
  };

  return (
    <div className="amountInput">
      <label className="amountInput__label">금액</label>
      <div className="amountInput__wrapper">
        <div className={`amountInput__fieldRow
            ${isFocused ? 'amountInput__fieldRow--active' : ''}
            ${hasError ? 'amountInput__fieldRow--error' : ''}`}>
          <input
            className="amountInput__field"
            type="text"
            inputMode="numeric"
            value={formatted}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder="0"
            aria-label="금액"
          />
          <span className={`amountInput__unit
            ${value ? 'amountInput__unit--filled' : ''}`}>원</span>
          {isFocused && value && (
            <button
              className="amountInput__deleteBtn"
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleDelete}
              aria-label="금액 삭제"
            >
              <Delite />
            </button>
          )}
        </div>
        <div className={`amountInput__underline
            ${isFocused ? 'amountInput__underline--active' : ''}
            ${hasError ? 'amountInput__underline--error' : ''}`} />

        {isFocused && (
          <p className="amountInput__helper">
            {MIN_AMOUNT.toLocaleString()}원부터 {(MAX_AMOUNT / 10000).toLocaleString()}만원까지 저금할 수 있어요
          </p>
        )}
        {hasError && (
          <p className="amountInput__error">
            <Feedback className="amountInput__errorIcon" />
            {MIN_AMOUNT.toLocaleString()}원부터 {(MAX_AMOUNT / 10000).toLocaleString()}만원까지 저금할 수 있어요
          </p>
        )}
      </div>
    </div>
  );
}

export default AmountInput;
