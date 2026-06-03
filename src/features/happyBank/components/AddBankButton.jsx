import Plus from '../../../assets/icons/common/Plus';
import '../styles/AddBankButton.css';

function AddBankButton({ onClick }) {
  return (
    <button className="addBankButton" type="button" onClick={onClick}>
      <span className="addBankButton__iconWrap">
        <Plus fill="#FFF" />
      </span>
      통장 개설하기
    </button>
  );
}

export default AddBankButton;
