import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// PATCH /users/me/nickname - 닉네임 수정
export const updateNickname = async (nickname) => {
  const { data } = await axios.patch(
    `${BASE_URL}/users/me/nickname`,
    { nickname },
    { headers: getHeader() }
  );
  return data;
};

// 로그아웃 - 프론트에서 토큰 삭제 (닉네임은 userId별로 보존)
export const logout = () => {
  localStorage.removeItem('token');
};

// DELETE /users/me - 회원 탈퇴
export const deleteAccount = async () => {
  const token = localStorage.getItem('token');
  await axios.delete(`${BASE_URL}/users/me`, { headers: getHeader() });
  if (token) {
    try {
      const { sub } = jwtDecode(token);
      localStorage.removeItem(`nickname_${sub}`);
    } catch { /* ignore */ }
  }
  localStorage.removeItem('token');
};
