import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Clover2 from '../../assets/icons/happybank/Clover2';
import ChevronRight from '../../assets/icons/common/ChevronRight';
import { updateNickname, logout, deleteAccount } from './hooks/useSetting';
import './styles/page.css';

function getTokenInfo() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function SettingPage() {
  const navigate = useNavigate();
  const tokenInfo = getTokenInfo();
  const nicknameKey = `nickname_${tokenInfo?.sub}`;
  const [displayName, setDisplayName] = useState(
    localStorage.getItem(nicknameKey) ?? tokenInfo?.nickname ?? tokenInfo?.name ?? '사용자'
  );
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNicknameSubmit = async () => {
    if (!nickname.trim()) return;
    setIsLoading(true);
    try {
      await updateNickname(nickname.trim());
      localStorage.setItem(nicknameKey, nickname.trim());
      setDisplayName(nickname.trim());
      setIsEditingNickname(false);
      setNickname('');
    } catch (err) {
      console.error('닉네임 수정 실패', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('회원 탈퇴 실패', err);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="settingPage">

      {/* 프로필 */}
      <div className="settingPage__profile">
        <div className="settingPage__avatar">
          <Clover2 width={26} height={27} fill="#fff" />
        </div>
        <span className="settingPage__nickname">{displayName}</span>
      </div>

      {/* 계정 설정 */}
      <span className="settingPage__sectionLabel">계정 설정</span>
      <div className="settingPage__section">
        <button
          className="settingPage__row"
          type="button"
          onClick={() => setIsEditingNickname((v) => !v)}
        >
          <span className="settingPage__rowLabel">닉네임 수정</span>
          <ChevronRight stroke="#B1B8BE" />
        </button>
        {isEditingNickname && (
          <div className="settingPage__editRow">
            <input
              className="settingPage__input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="새 닉네임 입력"
              maxLength={20}
              autoFocus
            />
            <button
              className="settingPage__confirmBtn"
              type="button"
              onClick={handleNicknameSubmit}
              disabled={isLoading || !nickname.trim()}
            >
              확인
            </button>
            <button
              className="settingPage__cancelBtn"
              type="button"
              onClick={() => { setIsEditingNickname(false); setNickname(''); }}
            >
              취소
            </button>
          </div>
        )}
      </div>

      {/* 계정 */}
      <span className="settingPage__sectionLabel">계정</span>
      <div className="settingPage__section">
        <button
          className="settingPage__row"
          type="button"
          onClick={() => setShowLogoutModal(true)}
        >
          <span className="settingPage__rowLabel">로그아웃</span>
          <ChevronRight stroke="#B1B8BE" />
        </button>
        <button
          className="settingPage__row"
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={isLoading}
        >
          <span className="settingPage__rowLabel settingPage__rowLabel--danger">회원 탈퇴</span>
          <ChevronRight stroke="#E53935" />
        </button>
      </div>

      {showLogoutModal && (
        <div className="settingPage__modalOverlay" onClick={() => setShowLogoutModal(false)}>
          <div className="settingPage__modal" onClick={(e) => e.stopPropagation()}>
            <div className="settingPage__modalTextGroup">
              <p className="settingPage__modalTitle">로그아웃</p>
              <p className="settingPage__modalDesc">정말 로그아웃 하시겠습니까?</p>
            </div>
            <div className="settingPage__modalActions">
              <button
                className="settingPage__modalBtn settingPage__modalBtn--cancel"
                type="button"
                onClick={() => setShowLogoutModal(false)}
              >
                취소
              </button>
              <button
                className="settingPage__modalBtn settingPage__modalBtn--confirm"
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="settingPage__modalOverlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settingPage__modal" onClick={(e) => e.stopPropagation()}>
            <div className="settingPage__modalTextGroup">
              <p className="settingPage__modalTitle">회원 탈퇴</p>
              <p className="settingPage__modalDesc">정말 탈퇴하시겠습니까?{'\n'}모든 데이터가 삭제됩니다.</p>
            </div>
            <div className="settingPage__modalActions">
              <button
                className="settingPage__modalBtn settingPage__modalBtn--cancel"
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                className="settingPage__modalBtn settingPage__modalBtn--danger"
                type="button"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SettingPage;
