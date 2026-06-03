import { useMemo } from 'react';

export const useDaysMap = (days = []) => {
  return useMemo(() => {
    // 배열을 객체로 변환하여 리턴
    return days.reduce((acc, cur) => {
      acc[cur.date] = cur;
      return acc;
    }, {});
  }, [days]);
};