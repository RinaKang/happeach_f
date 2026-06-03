import { BarChart, Bar, XAxis, YAxis, Cell, LabelList } from 'recharts';

const RATIO_COLORS = ['#FF9793', '#FFB0AD', '#FFCAC8', '#FFE1E0', '#FFF0EF'];

const X_TICK_STYLE = {
  fill: '#D2D4D6',
  fontFamily: 'Pretendard',
  fontSize: 14,
  fontWeight: 500,
};

const Y_TICK_STYLE = {
  fill: '#6D7882',
  fontFamily: 'Pretendard',
  fontSize: 14,
  fontWeight: 500,
};

// 감정별 평균 만족도를 가로 막대 차트로 표시
// XAxis: 1~5점 범위, YAxis: 감정 이름
function SatisfactionBarChart({ data }) {
  return (
    <BarChart
      width={311}
      height={data.length * (18 + 8) + 34}
      data={data}
      layout="vertical"
      barCategoryGap={8}
      margin={{ top: 0, right: 22, bottom: 0, left: 0 }}
    >
      <XAxis
        type="number"
        domain={[1, 5]}
        ticks={[1, 2, 3, 4, 5]}
        tick={{ ...X_TICK_STYLE, textAnchor: 'middle' }}
        axisLine={false}
        tickLine={false}
        orientation="top"
      />
      <YAxis
        type="category"
        dataKey="emotion"
        tick={{ ...Y_TICK_STYLE, textAnchor: 'end' }}
        axisLine={false}
        tickLine={false}
        width={62}
        interval={0}
      />
      <Bar dataKey="avgScore" radius={[100, 100, 100, 100]} barSize={18} minPointSize={24} background={{ fill: '#F4F5F6', radius: 100 }}>
        {data.map((entry, index) => (
          <Cell key={entry.emotion} fill={RATIO_COLORS[index] ?? RATIO_COLORS[RATIO_COLORS.length - 1]} />
        ))}
        <LabelList
          dataKey="avgScore"
          position="insideRight"
          offset={12}
          content={({ x, y, width, height, value, index }) => {
            const isShort = width < 50;
            return (
              <text
                x={isShort ? x + 8 : x + width - 12}
                y={y + height / 2}
                textAnchor={isShort ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight={600}
                fontFamily="Pretendard"
                fill={isShort ? '#FF9793' : index < 2 ? '#fff' : '#FF9793'}
              >
                {Number(value).toFixed(1)}
              </text>
            );
          }}
        />
      </Bar>
    </BarChart>
  );
}

export default SatisfactionBarChart;
