import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 백엔드가 UTC 시각을 타임존 표기 없는 "2026-06-08T16:17:07.483506" 형태로 내려줌
// → UTC로 명시 파싱 후 로컬(KST) 날짜로 변환해야 실제 날짜(예: "2026.06.09")가 정확히 나옴
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const str = String(dateStr);
  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(str);
  const utcStr = hasTimezone ? str : `${str.replace(/(\.\d{3})\d*$/, '$1')}Z`;
  const date = new Date(utcStr);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

// 백엔드 goalType(AMOUNT/PERIOD) → 프론트엔드(amount/period) 변환
const mapGoalType = (type) => 
  (type === 'AMOUNT' ? 'amount' : 'period');

// ArchiveResponse → 프론트엔드 achievement 객체 변환 (목록용)
// rank: 목록에서 계산한 순서 (1회차, 2회차 표시용)
const mapArchive = (a, rank) => ({
  id: a.accountId,            // 백엔드 accountId
  rank,                       // n회차 표시용 (목록 정렬 순서 기반)
  name: a.name,
  balance: a.balance ?? 0,   // totalAmount 역할
  goalType: mapGoalType(a.goalType),
  goalAmount: a.goalAmount ?? null,
  goalDate: a.endDate ? formatDate(a.endDate) : null,
  startDate: formatDate(a.createdAt),
  endDate: a.endDate ? formatDate(a.endDate) : null,
});

// GET /archives - 완료된 통장 목록 조회
const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArchives = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/archives`, {
        headers: getHeader(),
        params: { userId: getUserIdFromToken() },
      });
      console.log('성취기록 목록 응답:', data);
      // createdAt 기준 오름차순 정렬 후 rank(회차) 부여
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : [];
      setAchievements(sorted.map((a, i) => mapArchive(a, i + 1)));
    } catch (err) {
      console.error('성취기록 목록 불러오기 실패', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  return { achievements, isLoading, error, refetch: fetchArchives };
};

export default useAchievements;
