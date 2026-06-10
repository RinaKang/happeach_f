import React from 'react'
import SystemMore from '../../../assets/icons/common/SystemMore';
import Salary from '../../../assets/icons/category/Salary';
import SideIncome from '../../../assets/icons/category/SideIncome';
import Allowance from '../../../assets/icons/category/Allowance';
import Bonus from '../../../assets/icons/category/Bouns';
import Investment from '../../../assets/icons/category/Investment';
import Food from '../../../assets/icons/category/Food';
import Housing from '../../../assets/icons/category/Housing';
import Transport from '../../../assets/icons/category/Transport';
import Medical from '../../../assets/icons/category/Medical';
import Leisure from '../../../assets/icons/category/Leisure';
import Shopping from '../../../assets/icons/category/Shopping';
import Beauty from '../../../assets/icons/category/Beauty';
import Education from '../../../assets/icons/category/Education';
import Happy from '../../../assets/icons/emotion/Happy';
import Excitement from '../../../assets/icons/emotion/Excitement';
import Depressed from '../../../assets/icons/emotion/Depressed';
import Serenity from '../../../assets/icons/emotion/Serenity';
import Stress from '../../../assets/icons/emotion/Stress';
import Impulse from '../../../assets/icons/emotion/Impulse';
import Mad from '../../../assets/icons/satisfaction/Mad';
import Angry from '../../../assets/icons/satisfaction/Angry';
import Common from '../../../assets/icons/satisfaction/Common';
import Satisfied from '../../../assets/icons/satisfaction/Satisfied';
import Excited from '../../../assets/icons/satisfaction/Exited';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = ({
  dayData,
  selectedDate,
}) => {
  const navigate = useNavigate();
  const newData = (item) => ({
    ...item,
    paymentAt: selectedDate,
  });


  const goEdit = (item) => {
    const daydata = newData(item);

    // 첫 번째 인자는 이동할 경로, 
    // 두 번째 인자의 state 속성에 보낼 객체를 담습니다.
    navigate(`/expense/${item.expenseId}`, {
      state: {
        data: daydata,
        mode: 'edit'
      }
    });

    // console.log(item);
  };

  const category = {
    "NONE": { label: '카테고리 없음', icon: <SystemMore width={24} height={24} />, color: { background: 'var(--Category-Light-pink, rgba(255, 176, 173, 0.20))' } },
    "SALARY": { label: '급여', icon: <Salary width={24} height={24} />, color: { background: 'var(--Category-Purple-2, #ABD8E3)' } },
    "SIDE_INCOME": { label: '부수입', icon: <SideIncome width={24} height={24} />, color: { background: 'var(--Category-Deep-Blue, #B7CFD6)' } },
    "ALLOWANCE": { label: '용돈', icon: <Allowance width={24} height={24} />, color: { background: 'var(--Category-Green-2, #7EC88E)' } },
    "BONUS": { label: '상여금', icon: <Bonus width={24} height={24} />, color: { background: 'var(--Category-Purple-3, #D6B7FF)' } },
    "FINANCIAL": { label: '금융수입', icon: <Investment width={24} height={24} />, color: { background: 'var(--Category-Deep-Blue-2, #9FBFC9)' } },
    "INCOME_ETC": { label: '기타', icon: <SystemMore width={24} height={24} />, color: { background: 'var(--Category-Light-pink, rgba(255, 176, 173, 0.20))'} },
    "FOOD": { label: '식비', icon: <Food width={24} height={24} />, color: { background: 'var(--Category-Blue, #9ED2FA)' } },
    "HOUSING": { label: '주거/통신', icon: <Housing width={24} height={24} />, color: { background: 'var(--Category-Purple, #E2CCFF)' } },
    "TRANSPORT": { label: '교통/차량', icon: <Transport width={24} height={24} />, color: { background: 'var(--Category-Mint, #B5E2DF)' } },
    "HEALTH": { label: '의료/건강', icon: <Medical width={24} height={24} />, color: { background: 'var(--Category-Green, #A9DAB4)' } },
    "CULTURE": { label: '문화/여가', icon: <Leisure width={24} height={24} />, color: { background: 'var(--Category-Pink, #FFCAC8)' } },
    "SHOPPING": { label: '쇼핑', icon: <Shopping width={24} height={24} />, color: { background: 'var(--Category-Peach, #F7AFA1)' } },
    "BEAUTY": { label: '미용', icon: <Beauty width={24} height={24} />, color: { background: 'var(--Category-Lavender, #EFCAF2)' } },
    "EDUCATION": { label: '교육', icon: <Education width={24} height={24} />, color: { background: 'var(--Category-Gray, #CDD1D5)' } },
    "EXPENSE_ETC": { label: '카테고리 없음', icon: <SystemMore width={24} height={24} />, color: { background: 'var(--Category-Light-pink, rgba(255, 176, 173, 0.20))' } },
  };

  const emotion = {
    "JOY": { label: '기쁨', icon: <Happy width={12} height={12} /> },
    "EXCITED": { label: '설렘', icon: <Excitement width={12} height={12} /> },
    "CALM": { label: '평온', icon: <Serenity width={12} height={12} /> },
    "DEPRESSED": { label: '우울', icon: <Depressed width={12} height={12} /> },
    "STRESSED": { label: '스트레스', icon: <Stress width={12} height={12} /> },
    "IMPULSIVE": { label: '충동', icon: <Impulse width={12} height={12} /> },
  };

  const satisfaction = {
    0: { label: '매우 불만족', icon: <Mad /> },
    1: { label: '불만족', icon: <Angry /> },
    2: { label: '보통', icon: <Common /> },
    3: { label: '만족', icon: <Satisfied /> },
    4: { label: '매우 만족', icon: <Excited /> },
  };

  const getCategory = (categoryName) => {
    return category[categoryName];
  };

  const getEmotion = (emotionName) => {
    return emotion[emotionName];
  };

  const getSatisfaction = (satName) => {
    return satisfaction[satName];
  };

  const renderTransactionList = () => {
    if (dayData?.length === 0) {
      return <div className='no-transacton'>기록이 존재하지 않아요!</div>
    }

    return dayData?.map((item, index) => {
      const amount = item.amount;
      const isIncome = item.type === "INCOME";
      const category = getCategory(item.category);
      const emo = getEmotion(item.emotion);
      const sat = getSatisfaction(item.evaluation);

      return (
        <li key={item.expenseId} className='transaction-detail-list' onClick={() => goEdit(item)}>
          <div className='category-icon' style={category.color}>
            {category.icon}
          </div>
          <div className='detail'>
            <div className='title-content'>
              <div className='title'>{item.title}</div>
              <div className='category-text'>{category.label}</div>
            </div>
            {emo && <div className='emotion-tag'>
              {emo.icon}{emo.label}
            </div>}
            <div className='memo-text'>{item.memo}</div>
          </div>
          <div className={`amount-row ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '' : '- '}{amount.toLocaleString()}원
          </div>
        </li>
      )
    })
  }

  return (
    <div className='transaction-history'>
      <div className='section-header'>
        총 {dayData?.length}건의 기록
      </div>
      <ul className='transaction-list'>
        {renderTransactionList()}
      </ul>
    </div>
  )
}

export default TransactionHistory