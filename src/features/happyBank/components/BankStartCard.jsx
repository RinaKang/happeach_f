import '../styles/BankStartCard.css';
import Clover2 from "../../../assets/icons/happybank/Clover2";
import ChevronRight from "../../../assets/icons/common/ChevronRight";

function BankStartCard({ onClick }) {
  return (
    <div className="bankStartCard" onClick={onClick}>
      <div className="bankStartCard__avatar">
        <Clover2 width={28.33} height={29.73} fill="#FFF" />
      </div>
      <div className="bankStartCard__text">
        <span className="bankStartCard__sub">행복해지고 싶다면?</span>
        <span className="bankStartCard__title">행복저금 시작하기</span>
      </div>
      <span className="bankStartCard__arrow">
        <ChevronRight stroke="#B1B8BE" />
      </span>
    </div>
  );
}

export default BankStartCard;
