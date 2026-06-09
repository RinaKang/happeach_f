import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../../calendar/hook/auth';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EMOTION_LABEL = {
  CALM: '평온',
  DEPRESSED: '우울',
  EXCITED: '설렘',
  IMPULSIVE: '충동',
  JOY: '기쁨',
  STRESSED: '스트레스',
};
const toKorean = (key) => EMOTION_LABEL[key] ?? key;

const useMonthlyReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 월 (DatePicker 연동)
  const [report, setReport] = useState(null);                   // API 응답 데이터
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // 데이터가 존재하는 월 목록 (Set<"YYYY-M">), null이면 아직 로딩 중
  const [availableMonths, setAvailableMonths] = useState(null);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // 마운트 시 데이터 존재 월 목록 조회
  useEffect(() => {
    const fetchAvailableMonths = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${BASE_URL}/reports/available-months`, {
          params: { userId: getUserIdFromToken() },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('데이터 존재 월 목록:', data);
        // 백엔드 응답 형태에 따라 "YYYY-M" Set으로 변환
        // ex) [{year:2026,month:5},] 또는 ["2026-05"]
        const set = new Set(
          data.map((item) =>
            typeof item === 'string'
              ? item.replace(/^(\d{4})-0?(\d+)$/, '$1-$2') // "2026-05" → "2026-5"
              : `${item.year}-${item.month}`
          )
        );
        setAvailableMonths(set);
      } catch (err) {
        console.error('데이터 존재 월 목록 불러오기 실패', err);
        setAvailableMonths(new Set()); // 실패 시 빈 Set (미래 월만 막힘)
      }
    };

    fetchAvailableMonths();
  }, []);

  // selectedDate(년/월)가 바뀔 때마다 API 재호출
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${BASE_URL}/reports/monthly`, {
          params: { year, month, userId: getUserIdFromToken() },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log(`월별 리포트 응답 (${year}년 ${month}월):`, data);

        const sorted = Object.entries(data.emotionExpenseRatio ?? {})
          .map(([emotion, ratio]) => ({ emotion: toKorean(emotion), ratio }))
          .sort((a, b) => b.ratio - a.ratio);

        const top4 = sorted.slice(0, 4);
        const rest = sorted.slice(4);
        const etcRatio = rest.reduce((sum, e) => sum + e.ratio, 0);
        const emotionRatio = etcRatio > 0 ? [...top4, { emotion: '기타', ratio: etcRatio }] : top4;

        const satisfactionByEmotion = Object.entries(data.emotionAvgEvaluation ?? {})
          .map(([emotion, avgScore]) => ({ emotion: toKorean(emotion), avgScore: avgScore + 1 }))
          .sort((a, b) => b.avgScore - a.avgScore);

        setReport({
          totalExpense: data.totalExpense ?? 0,
          emotionCount: data.emotionCount ?? 0,
          emotionRatio,
          satisfactionByEmotion,
        });
      } catch (err) {
        console.error('월별 리포트 불러오기 실패', err);
        setError(err);
        setReport(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [year, month]);

  return {
    selectedDate,
    setSelectedDate,
    year,
    month,
    report,
    isLoading,
    error,
    availableMonths,
  };
};

export default useMonthlyReport;
