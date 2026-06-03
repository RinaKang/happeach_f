import { PieChart, Pie, Cell } from 'recharts';

// 비율 높은 순(index 0)부터 진한 핑크 → 연한 핑크로 그라데이션
const RATIO_COLORS = ['#FF9793', '#FFB0AD', '#FFCAC8', '#FFE1E0', '#FFF0EF'];

// recharts PieChart로 감정별 소비 비율 도넛 차트 렌더링
// innerRadius로 가운데 구멍을 만들어 도넛 형태 구현
function EmotionDonutChart({ data }) {
  const dominant = data[0]; // 비율 높은 순으로 정렬된 첫 번째 항목

  return (
    <div className="emotionDonutChart">
      <PieChart width={100} height={100} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          dataKey="ratio"
          cx={50}
          cy={50}
          innerRadius={32}
          outerRadius={50}
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={entry.emotion} fill={RATIO_COLORS[index] ?? '#FFECEC'} />
          ))}
        </Pie>
      </PieChart>
      {/* 도넛 중앙 텍스트 */}
      <div className="emotionDonutChart__center">
        <p className="emotionDonutChart__centerEmotion">{dominant?.emotion}</p>
        <p className="emotionDonutChart__centerRatio">{dominant?.ratio}%</p>
      </div>
    </div>
  );
}

export default EmotionDonutChart;
