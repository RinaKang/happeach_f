import React from 'react'

const Edit = ({ stroke = "#131416" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path d="M12 20.1641H19.359" stroke={stroke} stroke-width="1.63534" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.6797 6.6721C16.005 6.34681 16.4461 6.16406 16.9062 6.16406C17.134 6.16406 17.3595 6.20893 17.57 6.2961C17.7804 6.38327 17.9716 6.51103 18.1327 6.6721C18.2937 6.83316 18.4215 7.02438 18.5087 7.23482C18.5958 7.44527 18.6407 7.67082 18.6407 7.8986C18.6407 8.12639 18.5958 8.35194 18.5087 8.56238C18.4215 8.77283 18.2937 8.96404 18.1327 9.12511L7.9118 19.346L4.64111 20.1637L5.45878 16.893L15.6797 6.6721Z" stroke={stroke} stroke-width="1.63534" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export default Edit