import { useMatch, useNavigate, useParams, useLocation } from 'react-router-dom';
import AchievementList from './components/AchievementList';
import EmptyAchievementState from './components/EmptyAchievementState';
import AchievementDetailPage from './components/detail/AchievementDetailPage';
import useAchievements from './hooks/useAchievements';
import './styles/page.css';

function AchievementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useParams();
  const matchDetail = useMatch('/record/:accountId');

  const { achievements, isLoading } = useAchievements();

  // 상세 화면
  if (matchDetail && accountId) {
    // 목록에서 navigate 시 location.state로 rank 전달
    const rank = location.state?.rank;
    return (
      <AchievementDetailPage
        accountId={accountId}
        rank={rank}
        onBack={() => navigate('/record')}
      />
    );
  }

  // 목록 화면
  if (isLoading) return <div className="achievementPage" />;

  return (
    <div className="achievementPage">
      {achievements.length === 0 ? (
        <EmptyAchievementState />
      ) : (
        <AchievementList
          achievements={achievements}
          onItemClick={(a) =>
            navigate(`/record/${a.id}`, { state: { rank: a.rank } })
          }
        />
      )}
    </div>
  );
}

export default AchievementPage;
