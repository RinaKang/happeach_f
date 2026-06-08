import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getNicknameStorageKey = (userId) => `nickname_${userId}`;

export const getDefaultNickname = (tokenInfo) => (
  localStorage.getItem(getNicknameStorageKey(tokenInfo?.sub))
  ?? tokenInfo?.nickname
  ?? tokenInfo?.name
  ?? '사용자'
);

export const saveNicknameForToken = (token, nickname) => {
  if (!token || !nickname) return;

  try {
    const { sub } = jwtDecode(token);
    if (!sub) return;
    localStorage.setItem(getNicknameStorageKey(sub), nickname);
  } catch {
    // Ignore invalid token payloads.
  }
};

export const fetchAndSaveNickname = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const { data } = await axios.get(`${BASE_URL}/users/me`, { headers: getHeader() });
    const nickname = data.nickname ?? data.name ?? null;

    if (nickname) {
      saveNicknameForToken(token, nickname);
      return nickname;
    }

    return null;
  } catch {
    return null;
  }
};

export const updateNickname = async (nickname) => {
  const { data } = await axios.patch(
    `${BASE_URL}/users/me/nickname`,
    { nickname },
    { headers: getHeader() }
  );
  return data;
};

export const logout = () => {
  localStorage.removeItem('accessToken');
};

export const deleteAccount = async () => {
  const token = localStorage.getItem('accessToken');
  await axios.delete(`${BASE_URL}/users/me`, { headers: getHeader() });

  if (token) {
    try {
      const { sub } = jwtDecode(token);
      localStorage.removeItem(getNicknameStorageKey(sub));
    } catch {
      // Ignore invalid token payloads.
    }
  }

  localStorage.removeItem('accessToken');
};
