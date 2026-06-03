import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginCallbackPage = () => {
  const navigate = useNavigate();
  // 🔥 StrictMode 등으로 인해 useEffect가 두 번 실행되어 코드가 깨지는 것을 막는 방패
  const hasRequested = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // 1. URL에 코드가 있고, 아직 백엔드에 요청을 보낸 적이 없을 때만 진입
    if (code && !hasRequested.current) {
      hasRequested.current = true; // 진입하자마자 스위치를 꺼서 중복 실행 차단

      axios.get(`${BASE_URL}/auth/kakao?code=${code}`)
        .then((response) => {
          // 백엔드가 토큰을 주는 객체 구조를 확인해야 합니다. (예: response.data.token 등)
          console.log("백엔드 응답 전체 데이터:", response.data);

          const token = response.data.accessToken; // 혹은 백엔드 설계에 맞는 키값 (ex: response.data.accessToken)

          if (token) {
            localStorage.setItem('token', token);
            console.log("👍 토큰 저장 성공! 메인으로 이동합니다.");
            navigate('/');
          } else {
            console.error("❌ 백엔드 통신은 성공했으나 응답 데이터에 token이 없습니다. 백엔드 리턴 구조를 확인하세요.");
          }
        })
        .catch((error) => {
          console.error("❌ 백엔드 카카오 로그인 요청 실패:", error);
        });
    } else if (!code && !hasRequested.current) {
      // 코드가 아예 없는 상태로 이 페이지에 진입했을 때만 에러 출력
      console.error("⚠️ URL에 인가 코드가 존재하지 않습니다.");
    }
  }, [navigate]);

  return (
    <div>로딩중</div>
  )
}

export default LoginCallbackPage