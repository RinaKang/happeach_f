import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ExpenseDelete.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ExpenseDelete = ({
  handleDeleteModal,
  id,
}) => {
  const navigate = useNavigate();

  const deleteExpense = async (id) => {
    try {
      // 1. 백엔드(json-server)에 DELETE 요청 전송
      const response = await axios.delete(`${BASE_URL}/expenses/${id}`);

      if (response.status === 200 || response.status === 204) {
        console.log(`${id}번 게시물이 삭제되었습니다.`);
        navigate('/calendar');

        return true;
      }
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
      alert('삭제에 실패했습니다.');
      return false;
    }

    console.log("삭제되었습니다");
  };

  return (
    <div className='modal-overlay' onClick={handleDeleteModal}>
      <div className='expense-delete-modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-text'>
          <div>내역을 삭제할까요?</div>
          <div>삭제한 내역은 다시 되돌릴 수 없어요.<br />내역을 삭제하시겠습니까?</div>
        </div>
        <div className='modal-btn-contents'>
          <div className='cancel' onClick={handleDeleteModal}>취소</div>
          <div className='confirm' onClick={() => { deleteExpense(id) }}>삭제하기</div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseDelete