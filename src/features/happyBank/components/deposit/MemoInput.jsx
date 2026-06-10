import { useState, useRef, useEffect } from 'react';
import Feedback from '../../../../assets/icons/common/Feedback';
import Delite from '../../../../assets/icons/common/Delite';
import '../../styles/deposit/MemoInput.css';

const MAX_LENGTH = 100;

function MemoInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const textareaRef = useRef(null);

  const hasError = value.length >= MAX_LENGTH;
  const showCounter = isFocused || isTouched || value.length > 0;

  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
  };

  // value가 바뀔 때마다 높이 자동 조절
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="memoInput">
      <label className="memoInput__label">메모</label>
      <div className="memoInput__wrapper">
        <div className="memoInput__fieldRow">
          <textarea
            ref={textareaRef}
            className="memoInput__field"
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder="메모할 내용을 적어주세요"
            maxLength={MAX_LENGTH}
            rows={1}
            lang="ko"
            inputMode="text"
            aria-label="메모"
          />
          {showCounter && (
            <span className="memoInput__count">
              <span className="memoInput__count--current">{value.length}</span>/{MAX_LENGTH}
            </span>
          )}
          {isFocused && value && (
            <button
              className="memoInput__deleteBtn"
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange('')}
              aria-label="메모 전체 삭제"
            >
              <Delite />
            </button>
          )}
        </div>
        <div className={`memoInput__underline ${isFocused ? 'memoInput__underline--active' : ''} ${hasError ? 'memoInput__underline--error' : ''}`} />
        {hasError && (
          <p className="memoInput__error">
            <Feedback className="memoInput__errorIcon" />
            최대 {MAX_LENGTH}자까지 작성 가능합니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default MemoInput;
