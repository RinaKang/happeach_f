import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("디코딩된 전체 payload:", decoded);
    return decoded.sub; // 백엔드가 심어놓은 key 이름
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
};