import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ChevronLeft from '../../assets/icons/common/ChevronLeft';
import Icon from '../../assets/icons/login/Icon';
import Delite from '../../assets/icons/common/Delite';
import {
  getDefaultNickname,
  getNicknameStorageKey,
  updateNickname,
} from './hooks/useSetting';
import './styles/NicknamePage.css';

function getTokenInfo() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function NicknamePage() {
  const navigate = useNavigate();
  const tokenInfo = getTokenInfo();
  const nicknameKey = getNicknameStorageKey(tokenInfo?.sub);
  const savedNickname = getDefaultNickname(tokenInfo);
  const [nickname, setNickname] = useState(savedNickname);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname || trimmedNickname === savedNickname) {
      navigate(-1);
      return;
    }

    setIsLoading(true);
    try {
      await updateNickname(trimmedNickname);
      localStorage.setItem(nicknameKey, trimmedNickname);
      navigate(-1);
    } catch (err) {
      console.error('닉네임 수정 실패', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nicknamePage">
      <div className="nicknamePage__header">
        <button className="nicknamePage__backBtn" type="button" onClick={() => navigate(-1)}>
          <ChevronLeft stroke="#131416" />
        </button>
        <button
          className="nicknamePage__doneBtn"
          type="button"
          onClick={handleComplete}
          disabled={isLoading || !nickname.trim()}
        >
          완료
        </button>
      </div>

      <div className="nicknamePage__body">
        <div className="nicknamePage__avatar">
          <Icon width={80} height={80} />
        </div>

        <div className="nicknamePage__field">
          <label className="nicknamePage__label">닉네임</label>
          <div className="nicknamePage__inputRow">
            <input
              className={`nicknamePage__input ${isFocused ? 'nicknamePage__input--focused' : ''}`}
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={20}
            />
            {isFocused && nickname && (
              <button
                className="nicknamePage__clearBtn"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setNickname('')}
              >
                <Delite />
              </button>
            )}
          </div>
          <div className={`nicknamePage__underline ${isFocused ? 'nicknamePage__underline--focused' : ''}`} />
        </div>
      </div>
    </div>
  );
}

export default NicknamePage;
