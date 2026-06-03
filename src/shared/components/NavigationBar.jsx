import '../styles/NavigationBar.css';
import { NavLink } from 'react-router-dom';

function NavigationBar() {
  return (
    <div className='menu'>
      <NavLink to="/calendar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        감정가계부
      </NavLink>
      <NavLink to="/happybank" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        행복통장
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        리포트
      </NavLink>
      <NavLink to="/record" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        성취기록
      </NavLink>
    </div>
  );
}

export default NavigationBar;
