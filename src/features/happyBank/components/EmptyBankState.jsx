import AddBankButton from './AddBankButton';
import '../styles/EmptyBankState.css';
import Devider from '../../../assets/icons/common/Devider';
import Clover2 from '../../../assets/icons/happybank/Clover2';

function EmptyBankState({ onSetup }) {
  return (
    <div className="emptyBankState">
      <Devider width={343} fill="#E6E8EA" />
      {onSetup && <AddBankButton onClick={onSetup} />}

      <div className="emptyBankState__content">
        <Clover2 width={37} height={37} fill="#B1B8BE" />
        <p className="emptyBankState__message">첫 행복의 순간을 기록해보세요!</p>
      </div>
    </div>
  );
}

export default EmptyBankState;
