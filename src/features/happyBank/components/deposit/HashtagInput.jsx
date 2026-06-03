import { useState } from 'react';
import Feedback from '../../../../assets/icons/common/Feedback';
import Delite from '../../../../assets/icons/common/Delite';
import '../../styles/deposit/HashtagInput.css';

const MAX_TAGS = 5;


function HashtagInput({ tags, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const tagCount = tags.length;
  const hasError = tagCount >= MAX_TAGS;
  const hasContent = tagCount > 0 || inputValue.length > 0;

  const addTag = (raw) => {
    const tag = raw.trim().replace(/^#+/, '');
    if (tag && !tags.includes(tag) && tagCount < MAX_TAGS) {
      onChange([...tags, tag]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && inputValue === '' && tagCount > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleDelete = () => {
    setInputValue('');
    onChange([]);
  };

  return (
    <div className="hashtagInput">
      <label className="hashtagInput__label">해시태그</label>
      <div className="hashtagInput__fieldArea">
        <div className="hashtagInput__inputRow">
          <div className="hashtagInput__tagsAndInput">
            {tags.map((tag, i) => (
              <span key={i} className="hashtagInput__tagText">#{tag}</span>
            ))}
            {tagCount < MAX_TAGS && (
              <span className="hashtagInput__inputWrapper">
                <span className={`hashtagInput__prefix ${isFocused && inputValue ? 'hashtagInput__prefix--active' : ''}`}>#</span>
                <input
                  className="hashtagInput__field"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/^#+/, ''))}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  aria-label="해시태그 입력"
                />
              </span>
            )}
          </div>
          <span className={`hashtagInput__count ${hasError ? 'hashtagInput__count--error' : ''}`}>
            <span className="hashtagInput__count--current">{tagCount}</span>/{MAX_TAGS}
          </span>
          {isFocused && hasContent && (
            <button
              className="hashtagInput__deleteBtn"
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleDelete}
              aria-label="해시태그 전체 삭제"
            >
              <Delite />
            </button>
          )}
        </div>
        <div className={`hashtagInput__underline ${isFocused ? 'hashtagInput__underline--active' : ''} ${hasError ? 'hashtagInput__underline--error' : ''}`} />
        {hasError && (
          <p className="hashtagInput__error">
            <Feedback />
            해시태그는 최대 {MAX_TAGS}개까지 입력 가능해요
          </p>
        )}
      </div>
    </div>
  );
}

export default HashtagInput;
