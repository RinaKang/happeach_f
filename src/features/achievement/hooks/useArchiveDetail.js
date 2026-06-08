import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatDate = (dateStr) => {
  if (!dateStr) 
    return '';

  const d = new Date(dateStr);

  if (isNaN(d)) 
    return String(dateStr).slice(0, 10).replace(/-/g, '.');

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  return `${yyyy}.${mm}.${dd}`;
};

const mapGoalType = (type) => (type === 'AMOUNT' ? 'amount' : 'period');

// 백엔드 type(HAPPY/RECOVER) → 프론트엔드(happy/become) 변환
const mapTxType = (type) => (type === 'HAPPY' ? 'happy' : 'become');

// TransactionResponse → 프론트엔드 record 변환 (useBankDetail.js와 동일 구조)
const mapTransaction = (t) => ({
  id: t.transactionId ?? t.id,
  type: mapTxType(t.type),
  amount: t.amount,
  memo: t.memo ?? '',
  hashtag: Array.isArray(t.tags) ? t.tags.map((tag) => `#${tag}`).join(' ') : (t.tags ?? ''),
  tags: t.tags ?? [],
  date: formatDate(t.date ?? t.createdAt ?? ''),
  time: t.time ?? '',
  createdAt: t.createdAt ?? '',
  nickname: t.nickname ?? '',
});

// GET /archives/{accountId} - 완료된 통장 상세 + 저금 내역 조회
const useArchiveDetail = (accountId) => {
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!accountId) 
      return;

    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.get(`${BASE_URL}/archives/${accountId}`, {
        headers: getHeader(),
        params: { userId: getUserIdFromToken() },
      });
      console.log(`성취기록 상세 응답 (id: ${accountId}):`, data);

      const txList = data.transactions ?? [];
      console.log('저금 내역:', txList);
      const records = txList.map(mapTransaction);

      // 거래 내역에서 유형별 합계 계산
      const happySavings = records
        .filter((r) => r.type === 'happy')
        .reduce((s, r) => s + r.amount, 0);
      const becomeSavings = records
        .filter((r) => r.type === 'become')
        .reduce((s, r) => s + r.amount, 0);

      // AMOUNT 타입은 endDate가 null이므로 마지막 거래 날짜를 완료일로 사용
      const lastRecordDate = records.length > 0
        ? records.reduce((latest, r) => (r.date > latest ? r.date : latest), records[0].date)
        : null;

      setDetail({
        id: data.accountId,
        name: data.name,
        balance: data.balance ?? 0,
        goalType: mapGoalType(data.goalType),
        goalAmount: data.goalAmount ?? null,
        goalDate: data.endDate ? formatDate(data.endDate) : null,
        startDate: formatDate(data.createdAt),
        endDate: data.endDate ? formatDate(data.endDate) : lastRecordDate,
        happySavings,
        becomeSavings,
        records,
      });
    } catch (err) {
      console.error('성취기록 상세 불러오기 실패', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { detail, isLoading, error };
};

export default useArchiveDetail;
