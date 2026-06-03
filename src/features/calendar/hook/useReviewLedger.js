import { useMemo } from 'react';
import { formatDate } from './dateUtil.js';

export const useReviewLedger = (records) => {
  return useMemo(() => {
    if (!records || records.length === 0) {
      return { itemsByDate: {} };
    }

    const itemsByDate = records.reduce((acc, cur) => {
      const month = new Date(cur.paymentAt).getMonth() + 1;
      const dateKey = formatDate(cur.paymentAt); // "2026-05-01" 형태

      if (!acc[dateKey]) {
        acc[dateKey] = { dayItems: [] };
      }

      acc[dateKey].dayItems.push(cur);

      return acc;
    }, {});

    return { itemsByDate };
  }, [records]);
};