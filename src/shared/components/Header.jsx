import { useNavigate } from 'react-router-dom';
import Settings from '../../assets/icons/common/Settings';
import logo from '../../assets/logo.svg';
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='Header'>
      <div className='logo' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="logo" />
      </div>
      <div className='setting' onClick={() => navigate('/setting')} style={{ cursor: 'pointer' }}>
        <Settings />
      </div>
    </div>
  )
}

export default Header