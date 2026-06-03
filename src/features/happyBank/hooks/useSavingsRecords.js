import { useState } from 'react';

// 통장별 저금 기록을 저장하는 localStorage 키
const STORAGE_KEY = 'lagom_records';

// 앱 시작 시 localStorage에서 기록 전체를 불러옴
// 데이터 구조: { [bankId]: Record[] }
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // JSON 파싱 실패 시 빈 객체로 초기화 (데이터 손상 대비)
    return {};
  }
};

const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const useSavingsRecords = () => {
  // useState에 함수(load)를 전달하면 초기 렌더링 시 한 번만 실행됨 (lazy initialization)
  const [recordsByBank, setRecordsByBank] = useState(load);

  // 새 기록을 해당 통장의 맨 앞에 추가 (최신순 정렬 유지)
  const addRecord = (bankId, record) => {
    setRecordsByBank((prev) => {
      const next = { ...prev, [bankId]: [record, ...(prev[bankId] ?? [])] };
      save(next);
      return next;
    });
  };

  // bankId가 number로 저장된 경우와 string으로 저장된 경우 모두 대응
  // Date.now()로 생성한 id는 number지만 localStorage 직렬화 과정에서 key가 string으로 바뀔 수 있음
  const getRecords = (bankId) => recordsByBank[String(bankId)] ?? recordsByBank[bankId] ?? [];

  // 특정 기록 한 건만 삭제 (행복인출 화면에서 사용)
  const removeRecord = (bankId, recordId) => {
    setRecordsByBank((prev) => {
      const key = String(bankId);
      const next = { ...prev, [key]: (prev[key] ?? []).filter((r) => r.id !== recordId) };
      save(next);
      return next;
    });
  };

  // 통장 전체 기록 삭제 (통장 완료/삭제 시 사용)
  // number key, string key 둘 다 지워야 localStorage 잔존 데이터 방지
  const resetRecords = (bankId) => {
    setRecordsByBank((prev) => {
      const next = { ...prev };
      delete next[bankId];
      delete next[String(bankId)];
      save(next);
      return next;
    });
  };

  return { addRecord, getRecords, removeRecord, resetRecords };
};

export default useSavingsRecords;
