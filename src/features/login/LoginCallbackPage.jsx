import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { saveNicknameForToken } from '../setting/hooks/useSetting';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginCallbackPage = () => {
  const navigate = useNavigate();
  const hasRequested = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !hasRequested.current) {
      hasRequested.current = true;

      axios.get(`${BASE_URL}/auth/kakao?code=${code}`)
        .then((response) => {
          const token = response.data.accessToken;

          if (token) {
            localStorage.setItem('token', token);

            const tokenInfo = jwtDecode(token);
            const defaultNickname = response.data.nickname
              ?? response.data.name
              ?? tokenInfo?.nickname
              ?? tokenInfo?.name;

            saveNicknameForToken(token, defaultNickname);
            navigate('/');
          } else {
            console.error('로그인 응답에 accessToken이 없습니다.', response.data);
          }
        })
        .catch((error) => {
          console.error('카카오 로그인 요청 실패:', error);
        });
    } else if (!code && !hasRequested.current) {
      console.error('카카오 인증 코드가 URL에 없습니다.');
    }
  }, [navigate]);

  return (
    <div>로딩중</div>
  );
};

export default LoginCallbackPage;
