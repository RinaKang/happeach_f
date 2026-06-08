import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../shared/components/Header';
import Icon from '../../assets/icons/login/Icon';
import LoadingSpinner from './components/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get('code');

  //   if (code && !hasRequested.current) {
  //     hasRequested.current = true;

  //     axios.get(`${BASE_URL}/auth/kakao?code=${code}`)
  //       .then((response) => {
  //         const token = response.data.accessToken;

  //         if (token) {
  //           localStorage.setItem('token', token);
  //           navigate('/');
  //         } else {
  //           console.error('로그인 응답에 accessToken이 없습니다.', response.data);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('카카오 로그인 요청 실패:', error);
  //       });
  //   } else if (!code && !hasRequested.current) {
  //     console.error('카카오 인증 코드가 URL에 없습니다.');
  //   }
  // }, [navigate]);

  useEffect(() => {
    // URL에서 ?token=... 값을 가져옵니다.
    const token = searchParams.get('token');

    console.log("콜백 페이지에서 감지된 토큰:", token);

    if (token) {
      // 로컬 스토리지에 저장
      localStorage.setItem('accessToken', token);
      console.log("토큰 저장 완료! 메인으로 이동합니다.");

      // 토큰 저장이 완료되었으므로 이제 보호 구역인 메인('/')으로 가도 튕기지 않습니다.
      navigate('/', { replace: true });
    } else {
      console.error("토큰이 URL에 없습니다.");
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <Header />
      <div className='login-background'>
        <div className='login-container'>
          <div className='login-text'>
            <div className='login-img'>
              <Icon />
            </div>
            <div className='loading-bar'>
              <LoadingSpinner />
            </div>
            <div className='text3'>
              잠시만 기다려주세요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCallbackPage;
