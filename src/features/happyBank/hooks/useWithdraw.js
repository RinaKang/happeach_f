import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const mapTxType = (type) => (type === 'HAPPY' ? 'happy' : 'become');

// GET /transactions/random?accountId={id} - 랜덤 저금 기록 조회 (행복 인출)
// 기록이 없으면 백엔드가 RuntimeException("empty") 를 throw 함
const useWithdraw = (accountId) => {
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false); // 기록 없음 상태

  const fetchRandom = useCallback(async () => {
    if (!accountId) return;
    setIsLoading(true);
    setError(null);
    setIsEmpty(false);
    try {
      const { data } = await axios.get(`${BASE_URL}/transactions/withdraw`, {
        params: { accountId: Number(accountId) },
        headers: getHeader(),
      });
      console.log('행복 인출 응답:', data);

      setRecord({
        id: data.transactionId ?? data.id,
        type: mapTxType(data.type),
        amount: data.amount,
        memo: data.memo ?? '',
        // tags 배열 → '#태그' 형태의 문자열로 변환 (WithdrawPage 표시용)
        hashtag: Array.isArray(data.tags)
          ? data.tags.map((tag) => `#${tag}`).join(' ')
          : (data.tags ?? ''),
        tags: data.tags ?? [],
        date: data.date ?? '',
        time: data.time ?? '',
        createdAt: data.createdAt ?? '',
        nickname: data.nickname ?? '',
      });
    } catch (err) {
      const status = err.response?.status;
      // 백엔드가 기록 없을 때 RuntimeException("empty") → 500 반환하므로 함께 처리
      if (status === 404 || status === 400 || status === 500) {
        console.warn('행복 인출 - 기록 없음:', err.response?.data ?? err.message);
        setIsEmpty(true);
      } else {
        console.error('행복 인출 실패 (서버 에러):', err.response?.data ?? err.message);
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchRandom();
  }, [fetchRandom]);

  // DELETE /transactions/{id} - 행복저금 기록 삭제
  const deleteRecord = async (recordId) => {
    await axios.delete(`${BASE_URL}/transactions/${recordId}`, { headers: getHeader() });
  };

  return { record, isLoading, error, isEmpty, deleteRecord };
};

export default useWithdraw;
