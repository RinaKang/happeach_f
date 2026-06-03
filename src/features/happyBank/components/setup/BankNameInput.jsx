import Edit from '../../../../assets/icons/happybank/Edit';
import '../../styles/setup/BankNameInput.css';


function BankNameInput({ value, onChange }) {
  return (
    <div className="bankNameInput">
      <label className="bankNameInput__label">통장 이름</label>
      <div className="bankNameInput__wrapper">
        <input
          className="bankNameInput__field"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="통장 이름을 입력하세요"
          maxLength={20}
        />
        <span className="bankNameInput__icon">
          <Edit />
        </span>
      </div>
    </div>
  );
}

export default BankNameInput;
