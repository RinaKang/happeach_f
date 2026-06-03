import { useMemo } from 'react';

/**
 * 데이터를 날짜별(YYYY-MM-DD)로 묶고, 수입/지출 합계를 계산하는 Hook
 * @param {Array} data - 서버 또는 상태에서 가져온 트랜잭션 배열 데이터
 */
export const useWeeksMap = (data) => {
  const summarizedData = useMemo(() => {
    if (!Array.isArray(data)) return {};

    return data.reduce((acc, item) => {
      // 1. paymentAt에서 날짜 부분(YYYY-MM-DD)만 추출
      if (!item.paymentAt) return acc;
      const dateKey = item.paymentAt.split('T')[0]; // "2026-05-20" 추출

      // 2. 해당 날짜의 키가 없으면 초기 객체 생성
      if (!acc[dateKey]) {
        acc[dateKey] = {
          income: 0,
          expense: 0,
          items: [] // 해당 날짜의 원본 데이터들도 확인하고 싶을 때를 위해 포함
        };
      }

      // Number 타입으로 안전하게 변환
      const amount = Number(item.amount) || 0;

      // 3. type(INCOME / EXPENSE)에 따라 합계 누적
      if (item.type === 'INCOME') {
        acc[dateKey].income += amount;
      } else if (item.type === 'EXPENSE') {
        acc[dateKey].expense += amount;
      }

      // 원본 아이템도 함께 보관 (필요 없다면 제외 가능)
      acc[dateKey].items.push(item);

      return acc;
    }, {});
  }, [data]);

  return summarizedData;
};