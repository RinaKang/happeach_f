import { useState } from 'react';
import '../../styles/deposit/AmountInput.css';
import Delite from '../../../../assets/icons/common/Delite';

function AmountInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  const numeric = value ? Number(value) : 0;
  const formatted = value ? numeric.toLocaleString('ko-KR') : '';

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
    onChange(raw);
  };

  const handleDelete = () => {
    onChange('');
  };

  return (
    <div className="amountInput">
      <label className="amountInput__label">금액</label>
      <div className="amountInput__wrapper">
        <div className={`amountInput__fieldRow ${isFocused ? 'amountInput__fieldRow--active' : ''}`}>
          <input
            className="amountInput__field"
            type="text"
            inputMode="numeric"
            value={formatted}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
            aria-label="금액"
          />
          <span className={`amountInput__unit ${value ? 'amountInput__unit--filled' : ''}`}>원</span>
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
        <div className={`amountInput__underline ${isFocused ? 'amountInput__underline--active' : ''}`} />
      </div>
    </div>
  );
}

export default AmountInput;
