import { useEffect, useState } from 'react';
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';
import AddBankButton from './components/AddBankButton';
import BankStartCard from './components/BankStartCard';
import BankSummaryCard from './components/BankSummaryCard';
import DepositPage from './components/deposit/DepositPage';
import WithdrawPage from './components/withdraw/WithdrawPage';
import WithdrawEmptyModal from './components/withdraw/WithdrawEmptyModal';
import EmptyBankState from './components/EmptyBankState';
import BankSetupPage from './components/setup/BankSetupPage';
import SavingsProgressPanel from './components/SavingsProgressPanel';
import SavingsRecordList from './components/SavingsRecordList';
import GoalAchievedModal from './components/detail/GoalAchievedModal';
import SavingsRecordModal from './components/detail/SavingsRecordModal';
import Devider from '../../assets/icons/common/Devider';
import useHappyBank from './hooks/useHappyBank';
import useBankDetail from './hooks/useBankDetail';
import useWithdraw from './hooks/useWithdraw';
import './styles/page.css';

const showUnimplementedAlert = (message) => {
  window.alert(message);
};

// 목표 달성 여부 판단
// - 금액형: balance가 goalAmount 이상이면 달성
// - 기간형: 오늘이 만기일 이후면 달성
function calcIsGoalReached(bank) {
  if (!bank) return false;
  const { goalType, goalAmount, goalDate, balance } = bank;
  if (goalType === 'amount') {
    return balance >= (goalAmount ?? 0) && (goalAmount ?? 0) > 0;
  }
  return goalDate ? new Date() >= new Date(goalDate.replace(/\./g, '-') + 'T00:00:00') : false;
}

// ── 통장 상세 뷰 ──────────────────────────────────────────────
// GET /accounts/{accountId} 로 통장 정보 + 거래 내역을 받아 렌더링
function BankDetailView({ accountId, bankSummary, onComplete }) {
  const navigate = useNavigate();
  const { bank: bankDetail, records, isLoading, error } = useBankDetail(accountId);
  // 목록 API 응답(goalType, goalAmount, goalDate)과 상세 API 응답(거래내역)을 합침
  const bank = bankDetail ? { ...bankSummary, ...bankDetail } : null;
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showWithdrawEmpty, setShowWithdrawEmpty] = useState(false);

  const isGoalReached = calcIsGoalReached(bank);

  // 목표 달성 감지 시 모달 자동 표시
  useEffect(() => {
    if (isGoalReached) setShowGoalModal(true);
  }, [isGoalReached]);

  if (isLoading) return <div className="happyBankPage" />;
  if (error || !bank) return <div className="happyBankPage" />;

  const handleWithdraw = () => {
    const hasHappyRecords = records.some((r) => r.type === 'happy');
    if (!hasHappyRecords) setShowWithdrawEmpty(true);
    else navigate(`/happybank/${accountId}/withdraw`);
  };

  return (
    <div className="happyBankPage">
      <BankSummaryCard
        bankInfo={{ ...bank, currentAmount: bank.balance }}
        onDeposit={() => navigate(`/happybank/${accountId}/deposit`)}
        onWithdraw={handleWithdraw}
        onEdit={() => navigate(`/happybank/${accountId}/edit`, { state: { bank } })}
      />
      {records.length === 0 ? (
        <EmptyBankState />
      ) : (
        <>
          <SavingsProgressPanel
            happySavings={bank.happySavings}
            becomeSavings={bank.becomeSavings}
            goalAmount={bank.goalAmount}
            goalType={bank.goalType}
          />
          <SavingsRecordList records={records} onRecordClick={setSelectedRecord} />
        </>
      )}
      {selectedRecord && (
        <SavingsRecordModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
      {showGoalModal && (
        <GoalAchievedModal
          bankName={bank.displayName ?? bank.name}
          onConfirm={async () => {
            try {
              await onComplete(accountId);
              setShowGoalModal(false);
              navigate('/happybank');
            } catch (err) {
              console.error('통장 완료 처리 실패', err);
            }
          }}
          onClose={() => setShowGoalModal(false)}
        />
      )}
      {showWithdrawEmpty && (
        <WithdrawEmptyModal
          onBack={() => setShowWithdrawEmpty(false)}
          onDeposit={() => {
            setShowWithdrawEmpty(false);
            navigate(`/happybank/${accountId}/deposit`);
          }}
        />
      )}
    </div>
  );
}

// ── 행복 인출 뷰 ──────────────────────────────────────────────
// GET /transactions/withdraw?accountId={id} 로 랜덤 기록을 받아 WithdrawPage에 전달
function BankWithdrawView({ accountId, bankName, nickName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { record, isLoading, isEmpty } = useWithdraw(accountId);
  const fromList = location.state?.fromList ?? false;
  const backPath = fromList ? '/happybank' : `/happybank/${accountId}`;

  if (isLoading) return <div className="happyBankPageOverlay" />;

  // 기록 없음 → navigate 없이 현재 오버레이 위에 모달만 표시
  if (isEmpty) {
    return (
      <div className="happyBankPageOverlay">
        <WithdrawEmptyModal
          onBack={() => navigate(backPath, { replace: true })}
          onDeposit={() => navigate(`/happybank/${accountId}/deposit`)}
        />
      </div>
    );
  }

  if (!record) return <div className="happyBankPageOverlay" />;

  return (
    <div className="happyBankPageOverlay">
      <WithdrawPage
        bankInfo={{ name: bankName, userName: nickName ?? record.nickname }}
        record={record}
        onBack={() => navigate(`/happybank/${accountId}`)}
      />
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────
// useMatch 로 현재 URL 패턴을 감지해 적절한 뷰 컴포넌트를 렌더링
// 오버레이 뷰(setup/edit/deposit/withdraw)는 position:fixed 로 헤더/내비를 덮음
function HappyBankPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useParams();

  // URL 패턴 매칭
  const matchSetup = useMatch('/happybank/setup');
  const matchEdit = useMatch('/happybank/:accountId/edit');
  const matchDeposit = useMatch('/happybank/:accountId/deposit');
  const matchWithdraw = useMatch('/happybank/:accountId/withdraw');
  const matchDetail = useMatch('/happybank/:accountId');

  const { banks, hasBank, isLoading, createBank, updateBank, deleteBank, completeBank } = useHappyBank();
  // useDeposit은 DepositPage 내부에서 직접 사용

  // ── 통장 생성 / 수정 화면 ──
  if (matchSetup || matchEdit) {
    const editId = matchEdit?.params?.accountId;
    // 수정 모드: 상세 화면에서 navigate 시 location.state로 bank 전달
    const editBank = location.state?.bank ?? banks.find((b) => String(b.id) === editId) ?? null;

    return (
      <div className="happyBankPageOverlay">
        <BankSetupPage
          mode={matchEdit ? 'edit' : 'create'}
          initialData={editBank}
          onComplete={async (bankData) => {
            try {
              if (matchEdit) {
                await updateBank(editId, bankData);
                navigate(`/happybank/${editId}`);
              } else {
                const newId = await createBank(bankData);
                navigate(`/happybank/${newId}`);
              }
            } catch (err) {
              console.error('통장 저장 실패', err);
            }
          }}
          // 개설 완료 후 바로 저금 화면으로 이동 (생성 모드에서만)
          onCompleteAndDeposit={
            matchSetup
              ? async (bankData) => {
                  try {
                    const newId = await createBank(bankData);
                    navigate(`/happybank/${newId}/deposit`, { state: { initialType: 'happy' } });
                  } catch (err) {
                    console.error('통장 생성 후 저금 이동 실패', err);
                  }
                }
              : undefined
          }
          onDelete={
            matchEdit
              ? async () => {
                  try {
                    await deleteBank(editId);
                    navigate('/happybank');
                  } catch (err) {
                    console.error('통장 삭제 실패', err);
                    showUnimplementedAlert(err.message);
                  }
                }
              : undefined
          }
          onBack={() => navigate(matchEdit ? `/happybank/${editId}` : '/happybank')}
        />
      </div>
    );
  }

  // ── 저금하기 화면 ──
  if (matchDeposit) {
    const depId = matchDeposit.params.accountId;
    const depBank = banks.find((b) => String(b.id) === depId);
    // 넛지 배너에서 진입 시 location.state로 initialType 전달 가능
    const initialType = location.state?.initialType ?? 'happy';

    return (
      <div className="happyBankPageOverlay">
        <DepositPage
          accountId={depId}
          bankName={depBank?.displayName ?? depBank?.name ?? '행복 통장'}
          initialType={initialType}
          onComplete={() => navigate(`/happybank/${depId}`)}
          onBack={() => navigate(-1)}
        />
      </div>
    );
  }

  // ── 행복 인출 화면 ──
  if (matchWithdraw) {
    const wdId = matchWithdraw.params.accountId;
    const wdBank = banks.find((b) => String(b.id) === wdId);

    return (
      <BankWithdrawView
        accountId={wdId}
        bankName={wdBank?.displayName ?? wdBank?.name ?? '행복 통장'}
      />
    );
  }

  // ── 통장 상세 화면 ──
  if (matchDetail && accountId) {
    const summaryBank = banks.find((b) => String(b.id) === accountId) ?? null;
    return <BankDetailView accountId={accountId} bankSummary={summaryBank} onComplete={completeBank} />;
  }

  // ── 통장 목록 / 빈 상태 화면 ──
  if (isLoading) return <div className="happyBankPage" />;

  if (!hasBank) {
    return (
      <div className="happyBankPage">
        <BankStartCard onClick={() => navigate('/happybank/setup')} />
      </div>
    );
  }

  return (
    <div className="happyBankPage">
      {banks.map((bank) => (
        <BankSummaryCard
          key={bank.id}
          bankInfo={{ ...bank, currentAmount: bank.balance }}
          onClick={() => navigate(`/happybank/${bank.id}`)}
          onDeposit={() => navigate(`/happybank/${bank.id}/deposit`)}
          onWithdraw={() => navigate(`/happybank/${bank.id}/withdraw`, { state: { fromList: true } })}
          onEdit={() => navigate(`/happybank/${bank.id}/edit`, { state: { bank } })}
        />
      ))}
      <Devider width={343} fill="#FFE1E0" />
      <AddBankButton onClick={() => navigate('/happybank/setup')} />
    </div>
  );
}

export default HappyBankPage;
