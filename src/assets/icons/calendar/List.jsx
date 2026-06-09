import React from 'react';

const List = ({ stroke = "#131416"}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M5.33331 4H14" stroke={stroke} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5.33331 8H14" stroke={stroke} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5.33331 12H14" stroke={stroke} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 4H2.0075" stroke={stroke} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 8H2.0075" stroke={stroke} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M2 12H2.0075" stroke={stroke} stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export default List;