import { useState } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// POST /transactions/deposit - 저금하기
// type: 'happy'→'HAPPY', 'become'→'RECOVER'
// tags: string[] (HashtagInput에서 '#' 없이 배열로 전달)
const useDeposit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (accountId, { type, amount, memo, tags }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/transactions/deposit`,
        {
          userId: getUserIdFromToken(),
          accountId: Number(accountId),
          type: type === 'happy' ? 'HAPPY' : 'RECOVER',
          amount: Number(amount),
          memo,
          tags,
        },
        { headers: getHeader() }
      );
      console.log('저금하기 응답:', data);
      return data;
    } catch (err) {
      console.error('저금하기 실패', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSubmit };
};

export default useDeposit;
