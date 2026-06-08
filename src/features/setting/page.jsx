import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ChevronLeft from '../../assets/icons/common/ChevronLeft';
import UserIcon from '../../assets/icons/common/UserIcon';
import ChevronRight from '../../assets/icons/common/ChevronRight';
import {
  deleteAccount,
  fetchAndSaveNickname,
  getDefaultNickname,
  logout,
} from './hooks/useSetting';
import './styles/page.css';

function getTokenInfo() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function SettingPage() {
  const navigate = useNavigate();
  const tokenInfo = getTokenInfo();
  const [displayName, setDisplayName] = useState(getDefaultNickname(tokenInfo));
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchAndSaveNickname().then((name) => {
      if (name) setDisplayName(name);
    });
  }, []);

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
      <button className="settingPage__backBtn" type="button" onClick={() => navigate(-1)}>
        <ChevronLeft stroke="#B1B8BE" />
      </button>

      <div className="settingPage__profile">
        <div className="settingPage__avatar">
          <UserIcon width={20} height={22} />
        </div>
        <span className="settingPage__nickname">{displayName}</span>
      </div>

      <div className="settingPage__divider" />

      <span className="settingPage__sectionLabel">개인 설정</span>
      <div className="settingPage__section">
        <button
          className="settingPage__row"
          type="button"
          onClick={() => navigate('/setting/nickname')}
        >
          <span className="settingPage__rowLabel">닉네임 수정</span>
          <ChevronRight stroke="#B1B8BE" />
        </button>
      </div>

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
          <span className="settingPage__rowLabel settingPage__rowLabel--danger">회원탈퇴</span>
          <ChevronRight stroke="#B1B8BE" />
        </button>
      </div>

      {showLogoutModal && (
        <div className="settingPage__modalOverlay" onClick={() => setShowLogoutModal(false)}>
          <div className="settingPage__modal" onClick={(e) => e.stopPropagation()}>
            <div className="settingPage__modalTextGroup">
              <p className="settingPage__modalTitle">로그아웃</p>
              <p className="settingPage__modalDesc">로그아웃하시겠습니까?</p>
            </div>
            <div className="settingPage__modalActions">
              <button className="settingPage__modalBtn settingPage__modalBtn--cancel" type="button" onClick={() => setShowLogoutModal(false)}>취소</button>
              <button className="settingPage__modalBtn settingPage__modalBtn--confirm" type="button" onClick={handleLogout}>로그아웃</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="settingPage__modalOverlay" onClick={() => setShowDeleteModal(false)}>
          <div className="settingPage__modal" onClick={(e) => e.stopPropagation()}>
            <div className="settingPage__modalTextGroup">
              <p className="settingPage__modalTitle">회원탈퇴</p>
              <p className="settingPage__modalDesc">회원을 탈퇴하시겠습니까?{'\n'}모든 데이터가 삭제됩니다.</p>
            </div>
            <div className="settingPage__modalActions">
              <button className="settingPage__modalBtn settingPage__modalBtn--cancel" type="button" onClick={() => setShowDeleteModal(false)} disabled={isLoading}>취소</button>
              <button className="settingPage__modalBtn settingPage__modalBtn--danger" type="button" onClick={handleDeleteAccount} disabled={isLoading}>탈퇴하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingPage;
