import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// LocalDateTime("2026-05-19T14:30:00") → "2026.05.19"
const formatDate = (dateStr) => {
  if (!dateStr) 
    return '';
  return String(dateStr).slice(0, 10).replace(/-/g, '.');
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
