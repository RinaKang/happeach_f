import { useState } from 'react';
import Clover2 from '../../../../assets/icons/happybank/Clover2';
import ChevronLeft from '../../../../assets/icons/common/ChevronLeft';
import useDeposit from '../../hooks/useDeposit';
import AmountInput from './AmountInput';
import HashtagInput from './HashtagInput';
import MemoInput from './MemoInput';
import SavingsTypeSelect from './SavingsTypeSelect';
import '../../styles/deposit/DepositPage.css';

// accountId: 저금할 통장 ID (POST /transactions/deposit 에 필요)
function DepositPage({ accountId, onComplete, onBack, bankName = '행복통장', initialType = 'happy' }) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [tags, setTags] = useState([]);
  const { isLoading, handleSubmit } = useDeposit();

  const isValid = amount.length > 0 && memo.trim().length > 0;

  const onSubmit = async () => {
    if (!isValid) {
      return;
    }

    // tags 배열을 그대로 전달 (API에서 List<String> 형태로 처리)
    await handleSubmit(accountId, { type, amount, memo, tags });
    onComplete?.();
  };

  return (
    <div className="depositPage">
      <div className="depositPage__header">
        <button
          className="depositPage__backBtn"
          onClick={onBack}
          type="button"
          aria-label="뒤로가기"
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="depositPage__profile">
        <div className="depositPage__avatar">
          <Clover2 width={28.33} height={29.73} fill="#FFF"  />
        </div>
        <span className="depositPage__bankName">{bankName}</span>
      </div>

      <div className="depositPage__form">
        <SavingsTypeSelect value={type} onChange={setType} />
        <AmountInput value={amount} onChange={setAmount} />
        <MemoInput value={memo} onChange={setMemo} />
        <HashtagInput tags={tags} onChange={setTags} />
      </div>

      <button
        className={`depositPage__submitBtn 
          ${isValid ? 'depositPage__submitBtn--active' : ''}`}
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        type="button"
      >
        {isLoading ? '저장 중...' : '확인'}
      </button>
    </div>
  );
}

export default DepositPage;
