import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute = () => {
  const token = localStorage.getItem('token');

  // 이미 로그인했다면 메인(캘린더) 화면으로 튕겨냄
  if (token) {
    // 💡 원래 가려던 '/'로 보내면 어차피 현재 날짜 캘린더로 리다이렉트되므로 '/'로 보냅니다.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};