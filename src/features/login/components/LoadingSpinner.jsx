import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = () => {
  // 이미지 속 점의 개수인 3개로 구성
  return (
    <div className="loading-container">
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </div>
  );
};

export default LoadingSpinner;