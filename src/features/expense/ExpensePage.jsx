import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from './components/DatePickerExpense';
import './styles/ExpensePage.css';
import ExpenseTitle from './components/ExpenseTitle';
import ExpenseAmount from './components/ExpenseAmount';
import ExpenseCategory from './components/ExpenseCategory';
import ExpenseMemo from './components/ExpenseMemo';
import ExpenseEmotion from './components/ExpenseEmotion';
import ExpenseFixToggle from './components/ExpenseFixToggle';
import ExpenseFixSetting from './components/ExpenseFixSetting';

import SystemMore from '../../assets/icons/common/SystemMore';
import Salary from '../../assets/icons/category/Salary';
import SideIncome from '../../assets/icons/category/SideIncome';
import Allowance from '../../assets/icons/category/Allowance';
import Bonus from '../../assets/icons/category/Bouns';
import Investment from '../../assets/icons/category/Investment';
import Food from '../../assets/icons/category/Food';
import Housing from '../../assets/icons/category/Housing';
import Transport from '../../assets/icons/category/Transport';
import Medical from '../../assets/icons/category/Medical';
import Leisure from '../../assets/icons/category/Leisure';
import Shopping from '../../assets/icons/category/Shopping';
import Beauty from '../../assets/icons/category/Beauty';
import Education from '../../assets/icons/category/Education';

import Happy from '../../assets/icons/emotion/Happy';
import Excitement from '../../assets/icons/emotion/Excitement';
import Serenity from '../../assets/icons/emotion/Serenity';
import Depressed from '../../assets/icons/emotion/Depressed';
import Stress from '../../assets/icons/emotion/Stress';
import Impulse from '../../assets/icons/emotion/Impulse';

import Mad from '../../assets/icons/satisfaction/Mad';
import Angry from '../../assets/icons/satisfaction/Angry';
import Common from '../../assets/icons/satisfaction/Common';
import Satisfied from '../../assets/icons/satisfaction/Satisfied';
import Excited from '../../assets/icons/satisfaction/Exited';

import ChevronLeft from '../../assets/icons/common/ChevronLeft';
import ExpenseDelete from './components/ExpenseDelete';
import { getUserIdFromToken } from '../calendar/hook/auth.js';
import { formatDate } from '../calendar/hook/dateUtil.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ExpensePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 수정, 삭제를 위한 id
  const { id } = useParams();
  // navigate로 보낸 state 꺼내기 (데이터가 없을 경우를 대비해 옵셔널 체이닝 ?. 사용)
  const type = location.state?.type;
  const editData = location.state?.data;
  const isEditMode = location.state?.mode === 'edit';
  const isReEva = location.state?.mode === 'reevaluated';
  const [formData, setFormData] = useState({
    title: '',
    type: "INCOME",
    amount: '',
    paymentAt: new Date(),
    category: "NONE",
    memo: '',
    emotion: null,
    evaluation: null,
    isRecurring: false,
    repeatCycle: 'DAILY',
    repeatDays: [],
    repeatStartDate: null,
    repeatEndDate: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preEva, setPreEva] = useState(null);
  const [disable, setDisable] = useState(true);


  // 거래유형에 따른 카테고리 목록
  const categoryOptions = {
    "INCOME": [
      { value: "NONE", label: '카테고리 없음', icon: SystemMore },
      { value: "SALARY", label: '급여', icon: Salary, color: { background: 'var(--Category-Purple-2, #ABD8E3)' } },
      { value: "SIDE_INCOME", label: '부수입', icon: SideIncome, color: { background: 'var(--Category-Deep-Blue, #B7CFD6)' } },
      { value: "ALLOWANCE", label: '용돈', icon: Allowance, color: { background: 'var(--Category-Green-2, #7EC88E)' } },
      { value: "BONUS", label: '상여금', icon: Bonus, color: { background: 'var(--Category-Purple-3, #D6B7FF)' } },
      { value: "FINANCIAL", label: '금융수입', icon: Investment, color: { background: 'var(--Category-Deep-Blue-2, #9FBFC9)' } },
      { value: "INCOME_ETC", label: '기타', icon: SystemMore },
    ],
    "EXPENSE": [
      { value: "NONE", label: '카테고리 없음', icon: SystemMore },
      { value: "FOOD", label: '식비', icon: Food, color: { background: 'var(--Category-Blue, #9ED2FA)' } },
      { value: "HOUSING", label: '주거/통신', icon: Housing, color: { background: 'var(--Category-Purple, #E2CCFF)' } },
      { value: "TRANSPORT", label: '교통/차량', icon: Transport, color: { background: 'var(--Category-Mint, #B5E2DF)' } },
      { value: "HEALTH", label: '의료/건강', icon: Medical, color: { background: 'var(--Category-Green, #A9DAB4)' } },
      { value: "CULTURE", label: '문화/여가', icon: Leisure, color: { background: 'var(--Category-Pink, #FFCAC8)' } },
      { value: "SHOPPING", label: '쇼핑', icon: Shopping, color: { background: 'var(--Category-Peach, #F7AFA1)' } },
      { value: "BEAUTY", label: '미용', icon: Beauty, color: { background: 'var(--Category-Lavender, #EFCAF2)' } },
      { value: "EDUCATION", label: '교육', icon: Education, color: { background: 'var(--Category-Gray, #CDD1D5)' } },
      { value: "EXPENSE_ETC", label: '기타', icon: SystemMore },
    ]
  };

  // 감정 목록
  const emotionOptions = [
    { value: "JOY", label: '기쁨', icon: <Happy /> },
    { value: "EXCITED", label: '설렘', icon: <Excitement /> },
    { value: "CALM", label: '평온', icon: <Serenity /> },
    { value: "DEPRESSED", label: '우울', icon: <Depressed /> },
    { value: "STRESSED", label: '스트레스', icon: <Stress /> },
    { value: "IMPULSIVE", label: '충동', icon: <Impulse /> },
  ];

  // 소비 만족도 목록
  const satisfactionOptions = [
    { value: 0, label: '매우 불만족', percent: '0%', icon: <Mad isActive={formData.evaluation === 'mad'} /> },
    { value: 1, label: '불만족', percent: '25%', icon: <Angry isActive={formData.evaluation === 'angry'} /> },
    { value: 2, label: '보통', percent: '50%', icon: <Common isActive={formData.evaluation === 'common'} /> },
    { value: 3, label: '만족', percent: '75%', icon: <Satisfied isActive={formData.evaluation === 'satisfied'} /> },
    { value: 4, label: '매우 만족', percent: '100%', icon: <Excited isActive={formData.evaluation === 'excited'} /> },
  ];

  // selectedCycle에서 사용하는 기간 리스트(매주)
  const weekList = [
    { value: 'mon', label: '월' },
    { value: 'tue', label: '화' },
    { value: 'wed', label: '수' },
    { value: 'thr', label: '목' },
    { value: 'fri', label: '금' },
    { value: 'sat', label: '토' },
    { value: 'sun', label: '금' },
  ];

  // selectedCycle에서 사용하는 기간 리스트(매달)
  // 날짜라서 1~31 map으로 돌렸는데 혹시나 List로 관리해야된다면 해당 변수 사용
  // const monthList = [
  //   {}
  // ];


  // navigate로 전달된 state를 formData에 반영 (한 번만 실행되도록)
  // 가계부 페이지에서 INCOME이냐 EXPENSE이냐를 선택하고 오기 때문에
  useEffect(() => {
    if (type) {
      setFormData(prev => ({
        ...prev,
        type: type   // formData.type 업데이트
      }));
    }
  }, [type]);   // location.state가 바뀔 때만 실행

  useEffect(() => {
    // 수정 모드이고 넘어온 데이터가 있다면 state에 세팅
    if ((isEditMode || isReEva) && editData && Object.keys(editData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...editData,
        paymentAt: new Date(editData.paymentAt),
        repeatStartDate: editData.repeatStartDate ? new Date(editData.repeatStartDate) : null,
        repeatEndDate: editData.repeatEndDate ? new Date(editData.repeatEndDate) : null,
      }));
    }

    if (isReEva) {
      setPreEva(editData.evaluation);
    }
  }, [editData, isEditMode, isReEva]);

  useEffect(() => {
    if (formData.amount == '' || formData.category == 'NONE') {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [formData.category, formData.amount]);

  // 카테고리와 내역명 옆 아이콘 동기화
  const targetCategory = useMemo(() => {
    return categoryOptions[formData.type]?.find(item => item.value === formData.category);
  }, [formData.type, formData.category]);

  const IconComponent = useMemo(() => {
    return targetCategory?.icon;
  }, [targetCategory])


  // formData 기본 값들은 handleChange로 관리
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 메모 100자 제한
    if (name === 'memo' && value.length > 100) return;

    // 컴포넌트 전체에서 쓰는 공통 값 저장 변수
    let finalValue = value;

    // input의 name이 'amount'일 때만 콤마 포맷팅 적용
    if (name === 'amount') {
      finalValue = formatNumberWithCommas(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // 숫자에만 3자리마다 콤마를 찍어주는 함수
  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    // 1. 숫자만 남기고 모두 제거
    const rawValue = value.toString().replace(/[^0-9]/g, '');
    // 2. 3자리마다 콤마 추가
    return Number(rawValue).toLocaleString();
  };

  // (옵션) 나중에 서버 전송이나 계산을 위해 콤마를 제거하고 숫자로 만드는 함수
  const unformatCommas = (value) => {
    if (!value) return 0;
    return Number(value.toString().replace(/,/g, ''));
  };


  // 삭제하기 모달
  const handleDeleteModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 뒤로가기 
  const handleBack = () => {
    navigate(-1);
  };


  // 전송
  const handleSubmit = async (e) => {
    const userId = getUserIdFromToken();

    // 1. formatDate로 구한 날짜 문자열("2026-04-26") 뒤에 "T00:00:00"을 바로 붙여줍니다.
    const formattedDate = formatDate(formData.paymentAt); // "2026-04-26"
    const localDateTimeString = formattedDate ? `${formattedDate}T00:00:00` : null; // "2026-04-26T00:00:00"
    const numberAmount = unformatCommas(formData.amount);

    // 2. 서버에 보낼 데이터를 그 자리에서 완벽하게 합치기 (날짜 보정 + userId 주입)
    const submitData = {
      ...formData,
      userId: userId,                // 작성 시 필요한 userId 확실하게 주입
      paymentAt: localDateTimeString, // 시차 오류 없는 백엔드 맞춤형 날짜 주입
      amount: numberAmount,
    };

    // 3. 컴포넌트 state도 동기화 (필요시)
    setFormData(submitData);

    e.preventDefault();

    // 재평가 모드일 때 + 행복 저금으로 안 가고 저장할 때
    if (isReEva) {
      // 엔드포인트로 보낸 후 함수 끝나야됨 
      try {
        // PATCH /expenses/{id}/reevaluate?evaluation=1
        const response = await axios.patch(`${BASE_URL}/expenses/${id}/reevaluate?evaluation=${formData.evaluation}`, {})
        // console.log("보낸 데이터", formData);
        navigate('/');
        return;
      } catch (error) {
        console.log(error)
        return;
      }
    }


    try {
      if (isEditMode) {
        // 가계부 수정
        const response = await axios.put(`${BASE_URL}/expenses/${id}`, submitData);
        // console.log("보낸 데이터", submitData);

      } else {
        // 가계부 작성
        const response = await axios.post(`${BASE_URL}/expenses`, submitData);
        // console.log("보낸 데이터", submitData);
      }
      navigate('/');
      return;
    } catch (error) {
      console.log(error);
      return;
    }

  };



  return (
    <div className='expense-content'>
      {isModalOpen &&
        <ExpenseDelete
          handleDeleteModal={handleDeleteModal}
          id={id}
        />}
      <div className='header'>
        <div className='back-btn' onClick={handleBack}>
          <ChevronLeft stroke='#B1B8BE' />
        </div>
        {isEditMode && <div className='delete' onClick={handleDeleteModal}>
          삭제하기
        </div>}
      </div>
      <form className='contents'>
        <div className='contents-f'>
          {/* ExpenseTitle : 내역명(title) */}
          <ExpenseTitle
            formData={formData}
            setFormData={setFormData}
            IconComponent={IconComponent}
            handleChange={handleChange}
            targetCategory={targetCategory}
          />

          {/* ExpenseAmount : 거래유형(type), 금액(amount) */}
          <ExpenseAmount
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />

          {/* ExpenseCategory : 카테고리 설정(category) */}
          <ExpenseCategory
            formData={formData}
            setFormData={setFormData}
            categoryOptions={categoryOptions}
            targetCategory={targetCategory}
            IconComponent={IconComponent}
          />

          {/* 이체일시(selectedDate) */}
          <div className='payment-at-content'>
            <div className='label'>{formData.type === 'INCOME' ? '수입 일시' : '지출 일시'}</div>
            <div className='input-content'>
              <DatePicker
                formData={formData}
                setFormData={setFormData}
                datetype={'paymentAt'}
              />
            </div>
          </div>

          {/* ExpenseMemo : 메모(memo) */}
          <ExpenseMemo
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />
          
          {/* ExpenseEmotion : 감정(selectedEmo), 소비만족도(selectedSat) */}
          {formData.type === "EXPENSE" &&
            <ExpenseEmotion
              formData={formData}
              setFormData={setFormData}
              emotionOptions={emotionOptions}
              satisfactionOptions={satisfactionOptions}
              isEditMode={isEditMode}
              isReEva={isReEva}
              id={id}
            />
          }
        </div>
        <div className='devider2' />
        <div className='contents-fix'>
          {/* ExpenseFixToggle : 고정 지출로 설정(isFix) */}
          <ExpenseFixToggle
            formData={formData}
            setFormData={setFormData}
          />

          {/* ExpenseFixSetting : 매일/매주/매달(selectedPeriod), 날짜설정(selectedCycle), 시작일(startDate), 종료일(endDate) */}
          {formData.isRecurring &&
            <ExpenseFixSetting
              formData={formData}
              setFormData={setFormData}
              weekList={weekList}
            />
          }
        </div>
        <button
          type='submit'
          className={`submit-btn ${disable ? 'disable' : ''}`}
          disabled={disable}
          onClick={handleSubmit}
        >
          확인
        </button>
      </form>
    </div>
  )
}

export default ExpensePage