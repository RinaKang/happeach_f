import React from 'react'

const Devider = ({ width = 100, fill = "#F4F5F6" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="1"
      viewBox={`0 0 ${width} 1`}
      fill="none"
    >
      <g clip-path="url(#clip0_913_4356)">
        <rect width={width} height="1" fill={fill} />
      </g>
      <defs>
        <clipPath id="clip0_913_4356">
          <rect width={width} height="1" rx="0.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Devider