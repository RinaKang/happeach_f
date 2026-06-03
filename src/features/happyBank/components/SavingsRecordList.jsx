import MonthDivider from './MonthDivider';
import SavingsRecordItem from './SavingsRecordItem';
import '../styles/SavingsRecordList.css';

function SavingsRecordList({ records, onRecordClick }) {
  // 최신순 정렬 후 월별로 매핑
  // 결과: [{ month: '05월', records: [...] }, { month: '04월', records: [...] }]
  const grouped = records
    .slice() // 원본 배열 변경 방지를 위해 복사 후 정렬
    .sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')))
    .reduce((acc, record) => {
      // date 형식이 'YYYY.MM.DD'이므로 두 번째 요소(MM)를 추출해 'MM월' 형태로 변환
      const month = `${record.date.split('.')[1]}월`;
      const existing = acc.find((group) => group.month === month);

      if (existing) {
        existing.records.push(record);
      } else {
        acc.push({ month, records: [record] });
      }

      return acc;
    }, []);

  return (
    <div className="savingsRecordList">
      {grouped.map(({ month, records: monthRecords }) => (
        <div key={month} className="savingsRecordList__group">
          <MonthDivider month={month} />
          {monthRecords.map((record) => (
            <SavingsRecordItem
              key={record.id}
              {...record}
              onClick={() => onRecordClick?.(record)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SavingsRecordList;
