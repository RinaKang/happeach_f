import { useRef, useState } from 'react';
import '../../styles/setup/GoalAmountInput.css';
import Delite from '../../../../assets/icons/common/Delite';
import Feedback from '../../../../assets/icons/common/Feedback';
import { GOAL_AMOUNT_MAX, GOAL_AMOUNT_MIN } from '../../constants/setup';

const AMOUNT_GUIDE_TEXT = '100원부터 100만원까지 설정할 수 있어요';

function GoalAmountInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasTouched, setHasTouched] = useState(false);
  const inputRef = useRef(null);

  const numericValue = Number(value);
  const hasValue = value.length > 0;
  const isInvalid =
    hasValue &&
    (numericValue < GOAL_AMOUNT_MIN || numericValue > GOAL_AMOUNT_MAX);
  const showError = hasTouched && hasValue && isInvalid;
  const showHint = isFocused && !showError;
  const formattedValue = hasValue ? numericValue.toLocaleString('ko-KR') : '';

  const handleChange = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    onChange(numeric);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasTouched(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasTouched(true);
  };

  const handleClear = () => {
    onChange('');
    setHasTouched(true);
    inputRef.current?.focus();
  };

  return (
    <div className="goalAmountInput">
      <label className="goalAmountInput__label">목표금액</label>
      <div
        className={`goalAmountInput__wrapper ${isFocused ? 'goalAmountInput__wrapper--focused' : ''
          } ${showError ? 'goalAmountInput__wrapper--error' : ''}`}
      >
        <div className="goalAmountInput__fieldRow">
          <input
            ref={inputRef}
            className="goalAmountInput__field"
            type="text"
            inputMode="numeric"
            value={formattedValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
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

      {showError ? (
        <p className="goalAmountInput__message goalAmountInput__message--error">
          <Feedback />
          <span>{AMOUNT_GUIDE_TEXT}</span>
        </p>
      ) : (
        showHint && <p className="goalAmountInput__message">{AMOUNT_GUIDE_TEXT}</p>
      )}
    </div>
  );
}

export default GoalAmountInput;
