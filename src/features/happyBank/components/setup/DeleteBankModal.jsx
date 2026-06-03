import '../../styles/setup/DeleteBankModal.css';

function DeleteBankModal({ bankName, onCancel, onConfirm }) {
  return (
    <div className="deleteBankModal__overlay">
      <div className="deleteBankModal">
        <h2 className="deleteBankModal__title">통장을 삭제할까요?</h2>
        <p className="deleteBankModal__desc">
          삭제한 통장은 다시 되돌릴 수 없어요.<br/>
          통장을 삭제하시겠습니까?
        </p>
        <div className="deleteBankModal__actions">
          <button className="deleteBankModal__btn deleteBankModal__btn--cancel" onClick={onCancel} type="button">
            취소
          </button>
          <button className="deleteBankModal__btn deleteBankModal__btn--delete" onClick={onConfirm} type="button">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBankModal;
