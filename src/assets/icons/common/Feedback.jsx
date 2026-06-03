import React from 'react'

const Feedback = ({ width = 12, height = 12, stroke = "white", fill = "#DE3412" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
        >
            <rect width="12" height="12" rx="6" fill={fill} />
            <path d="M5.99927 3.5V6" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.99927 8.5H6.00656" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default Feedback