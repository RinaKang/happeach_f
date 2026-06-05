import { useRef, useState } from 'react';
import '../../styles/setup/GoalAmountInput.css';
import Delite from '../../../../assets/icons/common/Delite';

function GoalAmountInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const numericValue = Number(value);
  const hasValue = value.length > 0;
  const formattedValue = hasValue ? numericValue.toLocaleString('ko-KR') : '';

  const handleChange = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    onChange(numeric);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="goalAmountInput">
      <label className="goalAmountInput__label">목표금액</label>
      <div className={`goalAmountInput__wrapper ${isFocused ? 'goalAmountInput__wrapper--focused' : ''}`}>
        <div className="goalAmountInput__fieldRow">
          <input
            ref={inputRef}
            className="goalAmountInput__field"
            type="text"
            inputMode="numeric"
            value={formattedValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
            aria-label="목표 금액"
          />
          <span className="goalAmountInput__unit">원</span>
          {isFocused && hasValue && (
            <button
              className="goalAmountInput__clear"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              type="button"
              aria-label="목표 금액 지우기"
            >
              <Delite />
            </button>
          )}
        </div>
        <div className="goalAmountInput__underline" />
      </div>
    </div>
  );
}

export default GoalAmountInput;
