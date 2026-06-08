import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');

  // 토큰이 없으면 로그인 화면으로 강제 이동
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 토큰이 있으면 하위 자식 라우트들을 정상적으로 렌더링
  return <Outlet />;
};