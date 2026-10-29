import React from 'react';

export function UsFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="circle-us">
        <circle cx="16" cy="16" r="16" />
      </clipPath>
      <g clipPath="url(#circle-us)">
        {/* Red background with white stripes */}
        <rect width="32" height="32" fill="#B22234" />
        <path d="M0 4.9h32M0 9.8h32M0 14.7h32M0 19.6h32M0 24.5h32M0 29.4h32" stroke="#FFFFFF" strokeWidth="2.5" />
        {/* Blue canton */}
        <rect width="16" height="17" fill="#3C3B6E" />
        {/* Stars representation */}
        <circle cx="4" cy="4" r="1" fill="#FFFFFF" />
        <circle cx="8" cy="4" r="1" fill="#FFFFFF" />
        <circle cx="12" cy="4" r="1" fill="#FFFFFF" />
        <circle cx="6" cy="8" r="1" fill="#FFFFFF" />
        <circle cx="10" cy="8" r="1" fill="#FFFFFF" />
        <circle cx="4" cy="12" r="1" fill="#FFFFFF" />
        <circle cx="8" cy="12" r="1" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="1" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function GermanFlag({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="circle-de">
        <circle cx="16" cy="16" r="16" />
      </clipPath>
      <g clipPath="url(#circle-de)">
        <rect width="32" height="10.66" y="0" fill="#000000" />
        <rect width="32" height="10.66" y="10.66" fill="#DD0000" />
        <rect width="32" height="10.66" y="21.33" fill="#FFCE00" />
      </g>
    </svg>
  );
}
