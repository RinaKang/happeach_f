import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 백엔드 type(HAPPY/RECOVER) → 프론트엔드(happy/become) 변환
const mapTxType = (type) => (type === 'HAPPY' ? 'happy' : 'become');

// 백엔드가 UTC 시각을 타임존 표기 없는 "2026-06-08T16:17:07.483506" 형태로 내려줌
// → UTC로 명시 파싱 후 로컬(KST) 날짜로 변환해야 실제 날짜(예: "2026.06.09")가 정확히 나옴
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const str = String(dateStr);
  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(str);
  const utcStr = /^\d{4}-\d{2}-\d{2}T/.test(str) && !hasTimezone
    ? `${str.replace(/(\.\d{3})\d*$/, '$1')}Z`
    : str;
  const d = new Date(utcStr);
  if (isNaN(d)) return dateStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

// TransactionResponse → 프론트엔드 record 객체 변환
// tags: ['절약', '카페'] → hashtag: '#절약 #카페' 형태로 변환
const mapTransaction = (t) => ({
  id: t.transactionId ?? t.id,
  type: mapTxType(t.type),
  amount: t.amount,
  memo: t.memo ?? '',
  hashtag: Array.isArray(t.tags) ? t.tags.map((tag) => `#${tag}`).join(' ') : (t.tags ?? ''),
  tags: t.tags ?? [],
  date: formatDate(t.date ?? t.createdAt ?? ''),
  time: t.time ?? '',          // 백엔드 가공 시간 (예: "14:30")
  createdAt: t.createdAt ?? '',
  nickname: t.nickname ?? '',
});

// GET /accounts/{id} - 통장 상세 + 거래 내역 조회
const useBankDetail = (accountId) => {
  const [bank, setBank] = useState(null);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!accountId || accountId === 'undefined') return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/accounts/${accountId}`, {
        headers: getHeader(),
      });
      console.log(`통장 상세 응답 (id: ${accountId}):`, data);

      setBank({
        id: data.accountId ?? data.id ?? accountId,
        name: data.name,
        balance: data.balance ?? 0,
        // 백엔드 상세 응답에 goalType이 없으면 undefined → bankSummary 값 유지됨
        ...(data.goalType && { goalType: data.goalType === 'PERIOD' ? 'period' : 'amount' }),
        ...(data.goalAmount != null && { goalAmount: data.goalAmount }),
        ...(data.endDate && { goalDate: data.endDate }),
        startDate: data.createdAt ? formatDate(data.createdAt) : null,
        happySavings: data.happyTotal ?? data.happySavings ?? data.happyAmount ?? 0,
        becomeSavings: data.recoverTotal ?? data.becomeSavings ?? data.recoverAmount ?? 0,
      });

      const txList = data.transactions ?? data.transactionList ?? [];
      console.log('거래 내역:', txList);
      const sorted = [...txList].sort(
        (a, b) => new Date(b.createdAt ?? b.date ?? 0) - new Date(a.createdAt ?? a.date ?? 0)
      );
      setRecords(sorted.map(mapTransaction));
    } catch (err) {
      console.error('통장 상세 불러오기 실패', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { bank, records, isLoading, error, refetch: fetchDetail };
};

export default useBankDetail;
