import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import CalendarPage from './features/calendar/CalendarPage';
import HappyBankPage from './features/happyBank/page'
import AchievementPage from './features/achievement/page'
import ReportPage from './features/report/page'
import ExpensePage from './features/expense/ExpensePage'
import LoginPage from './features/login/LoginPage';
import LoginCallbackPage from './features/login/LoginCallbackPage';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { PublicRoute } from './shared/components/PublicRoute';
import SettingPage from './features/setting/page';
import NicknamePage from './features/setting/NicknamePage';

// Header, NavigationBar 가 필요한 화면 
const MainLayout = () => (
  <>
    <Header />
    <NavigationBar />
    <Outlet /> {/* 이 자리에 자식 컴포넌트들이 렌더링됨 */}
  </>
);

function App() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

  return (
    <div className='app_content'>
      <Router>
      <Routes>
        
        {/* 1. 🔒 로그인 필수 구역 (토큰 없으면 진입 불가) */}
        <Route element={<ProtectedRoute />}>
          {/* 레이아웃이 필요한 서비스 화면들 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to={`/calendar/${currentYear}/${currentMonth}`} replace />} />
            <Route path="/calendar" element={<Navigate to={`/calendar/${currentYear}/${currentMonth}`} replace />} />
            <Route path="/calendar/:year/:month" element={<CalendarPage />} />

            <Route path='/happybank' element={<HappyBankPage />} />
            <Route path='/happybank/setup' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId/edit' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId/deposit' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId/withdraw' element={<HappyBankPage />} />

            <Route path='/record' element={<AchievementPage />} />
            <Route path='/record/:accountId' element={<AchievementPage />} />

            <Route path='/report' element={<ReportPage />} />
          </Route>

          {/* 레이아웃이 필요 없는 서비스 화면들 */}
          <Route path='/setting' element={<SettingPage />} />
          <Route path='/setting/nickname' element={<NicknamePage />} />
          <Route path='/expense' element={<ExpensePage />} />
          <Route path='/expense/:id' element={<ExpensePage />} />
        </Route>

        {/* 2. 🔓 미로그인 전용 구역 (이미 로그인했으면 접근 불가, 메인으로 튕김) */}
        <Route element={<PublicRoute />}>
          <Route path='/login' element={<LoginPage />} />
        </Route>

        {/* 3. 🌐 오픈 구역 (카카오 인증 처리를 위한 통로) */}
        <Route path='/auth/kakao' element={<LoginCallbackPage />} />

      </Routes>
    </Router>
    </div>
  )
}

export default App