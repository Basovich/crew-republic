import React from 'react';

interface FlagProps {
  size?: number;
  className?: string;
}

export function UsFlag({ size, className }: FlagProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="6 6 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <clipPath id="clip-us-circle">
        <circle cx="24" cy="24" r="18" />
      </clipPath>
      <g clipPath="url(#clip-us-circle)">
        {/* Off-white background stripes */}
        <rect x="6" y="6" width="36" height="36" fill="#EEEEEE" />

        {/* Authentic Red Stripes */}
        <path
          d="M21.75 10.5H42V15H21.75V10.5ZM21.75 19.5H42V24H24L21.75 19.5ZM6 28.5H42V33H6V28.5ZM6 37.5H42V42H6V37.5Z"
          fill="#D80027"
        />

        {/* Blue Canton */}
        <path d="M6 6H24V24H6V6Z" fill="#0052B4" />

        {/* 9 Five-Pointed Stars (3x3 grid) */}
        <path
          d="M19.1484 23.0859L23.1562 20.2031H18.2344L22.2422 23.0859L20.6953 18.375L19.1484 23.0859ZM13.4531 23.0859L17.4609 20.2031H12.5391L16.5469 23.0859L15 18.375L13.4531 23.0859ZM7.75781 23.0859L11.7656 20.2031H6.84375L10.8516 23.0859L9.30469 18.375L7.75781 23.0859ZM19.1484 17.3906L23.1562 14.5078H18.2344L22.2422 17.3906L20.6953 12.6797L19.1484 17.3906ZM13.4531 17.3906L17.4609 14.5078H12.5391L16.5469 17.3906L15 12.6797L13.4531 17.3906ZM7.75781 17.3906L11.7656 14.5078H6.84375L10.8516 17.3906L9.30469 12.6797L7.75781 17.3906ZM19.1484 11.625L23.1562 8.74219H18.2344L22.2422 11.625L20.6953 6.91406L19.1484 11.625ZM13.4531 11.625L17.4609 8.74219H12.5391L16.5469 11.625L15 6.91406L13.4531 11.625ZM7.75781 11.625L11.7656 8.74219H6.84375L10.8516 11.625L9.30469 6.91406L7.75781 11.625Z"
          fill="#EEEEEE"
        />
      </g>
    </svg>
  );
}

export function GermanFlag({ size, className }: FlagProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="6 6 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <clipPath id="clip-de-circle">
        <circle cx="24" cy="24" r="18" />
      </clipPath>
      <g clipPath="url(#clip-de-circle)">
        <rect x="6" y="6" width="36" height="12" fill="#000000" />
        <rect x="6" y="18" width="36" height="12" fill="#DD0000" />
        <rect x="6" y="30" width="36" height="12" fill="#FFCE00" />
      </g>
    </svg>
  );
}
