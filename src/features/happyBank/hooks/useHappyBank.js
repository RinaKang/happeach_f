import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';
import { DEFAULT_BANK_NAME } from '../constants/setup';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 백엔드 goalType(AMOUNT/PERIOD) → 프론트엔드(amount/period) 변환
const mapGoalType = (type) => (type === 'AMOUNT' ? 'amount' : 'period');

// "2026-05-01T14:30:00" → "2026.05.01"
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return String(dateStr).slice(0, 10).replace(/-/g, '.');
};

// 백엔드 Account 응답 → 프론트엔드 bank 객체 변환
const mapAccount = (a) => ({
  id: a.accountId ?? a.id,
  name: a.name,
  balance: a.balance ?? 0,           // 총 잔액 (currentAmount 역할)
  goalType: mapGoalType(a.goalType),
  goalAmount: a.goalAmount ?? null,
  goalDate: a.endDate ?? null,       // 백엔드 endDate → 프론트 goalDate
  startDate: formatDate(a.createdAt),
  isCompleted: a.isCompleted ?? false,
});

const useHappyBank = () => {
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET /accounts - 통장 목록 조회
  const fetchBanks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/accounts`, {
        headers: getHeader(),
        params: { userId: getUserIdFromToken() },
      });
      console.log('통장 목록 응답:', data);
      const mapped = Array.isArray(data) ? data.map(mapAccount) : [];
      // 같은 이름이 여러 개면 첫 번째는 그대로, 이후부터 "이름2", "이름3"...
      const nameCount = {};
      const withDisplayName = mapped.map((bank) => {
        nameCount[bank.name] = (nameCount[bank.name] ?? 0) + 1;
        const count = nameCount[bank.name];
        return { ...bank, displayName: count === 1 ? bank.name : `${bank.name}${count}` };
      });
      setBanks(withDisplayName);
    } catch (err) {
      console.error('통장 목록 불러오기 실패', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  // 같은 이름이 이미 있으면 '이름2', '이름3' ... 으로 고유 이름 생성
  const generateUniqueName = (baseName) => {
    if (banks.length === 0) return baseName;
    const existing = new Set(banks.map((b) => b.name));
    let counter = banks.length + 1;
    while (existing.has(`${baseName}${counter}`)) counter++;
    return `${baseName}${counter}`;
  };

  // POST /accounts - 통장 생성
  // goalType: 'amount'|'period', goalAmount, goalDate(endDate)
  const createBank = async ({ name, goalType, goalAmount, goalDate }) => {
    const uniqueName = name === DEFAULT_BANK_NAME ? generateUniqueName(name) : name;
    try {
      const { data } = await axios.post(
        `${BASE_URL}/accounts`,
        null,
        {
          headers: getHeader(),
          params: {
            userId: getUserIdFromToken(),
            name: uniqueName,
            goalType: goalType === 'amount' ? 'AMOUNT' : 'PERIOD',
            goalAmount: goalType === 'amount' ? Number(goalAmount) : null,
            endDate: goalType === 'period' ? goalDate.replaceAll('.', '-') : null,
          },
        }
      );
      console.log('통장 생성 응답:', data);
      const newId = data.accountId ?? data.id ?? data;
      await fetchBanks(); // 목록 갱신
      return newId;
    } catch (err) {
      console.error('통장 생성 실패', err);
      throw err;
    }
  };

  // PUT /accounts/{id} - 통장 수정
  const updateBank = async (id, { name, goalType, goalAmount, goalDate }) => {
    try {
      await axios.put(
        `${BASE_URL}/accounts/${id}`,
        {
          name,
          goalType: goalType === 'amount' ? 'AMOUNT' : 'PERIOD',
          goalAmount: goalType === 'amount' ? Number(goalAmount) : null,
          endDate: goalType === 'period' ? goalDate?.replaceAll('.', '-') : null,
        },
        { headers: getHeader() }
      );
      await fetchBanks();
    } catch (err) {
      console.error('통장 수정 실패', err);
      throw err;
    }
  };

  // DELETE /accounts/{id} - 통장 삭제
  const deleteBank = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/accounts/${id}`, { headers: getHeader() });
      await fetchBanks();
    } catch (err) {
      console.error('통장 삭제 실패', err);
      throw err;
    }
  };

  // PATCH /accounts/{id}/complete - 통장 완료 처리
  const completeBank = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/accounts/${id}/complete`, {}, { headers: getHeader() });
      await fetchBanks();
    } catch (err) {
      console.error('통장 완료 처리 실패', err);
      throw err;
    }
  };

  return {
    banks,
    hasBank: banks.length > 0,
    isLoading,
    error,
    fetchBanks,
    createBank,
    updateBank,
    deleteBank,
    completeBank,
  };
};

export default useHappyBank;
