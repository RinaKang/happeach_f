import React from 'react'
import './styles/LoginPage.css';
import kakaoBtn from './styles/KakaoLogin.png';
import KakaoIcon from '../../assets/icons/login/Kakao';

const LoginPage = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // 카카오 공식 인증 URL 양식
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleLogin = () => {
    // 카카오 로그인 화면으로 이동합니다 (현재 창 전환)
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className='login-background'>
      <div className='login-container'>
        <div className='login-text'>
          <div className='login-img' />
          <div className='text1'>로그인</div>
          <div className='text2'>소셜로그인으로 간편하게 시작하세요</div>
        </div>
        <div className='login-kakao' onClick={handleLogin}>
          <div className='login-content'>
            <div className='icon'>
              <KakaoIcon />
            </div>
            <div className='text'>
              카카오 로그인
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage