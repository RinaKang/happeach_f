const RATIO_COLORS = ['#FF9793', '#FFB0AD', '#FFCAC8', '#FFE1E0', '#FFF0EF'];

function EmotionLegendList({ data }) {
  return (
    <ul className="emotionLegendList">
      {data.map(({ emotion, ratio }, index) => (
        <li key={emotion} className="emotionLegendList__item">
          <span className="emotionLegendList__dot" style={{ backgroundColor: RATIO_COLORS[index] ?? '#FFECEC' }} />
          <span className="emotionLegendList__name">{emotion}</span>
          <span className="emotionLegendList__ratio">{ratio}%</span>
        </li>
      ))}
    </ul>
  );
}

export default EmotionLegendList;
