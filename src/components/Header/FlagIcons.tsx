import React, { useId } from 'react';

interface FlagProps {
  size?: number;
  className?: string;
}

export function UsFlag({ size, className }: FlagProps) {
  const id = useId();
  const clipId = `clip-us-uk-circle-${id}`;
  const starId = `flag-star-${id}`;
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <g id={starId}>
          <polygon
            points="0.0,-12.5 2.8,-3.9 11.9,-3.9 4.5,1.5 7.3,10.1 0.0,4.8 -7.3,10.1 -4.5,1.5 -11.9,-3.9 -2.8,-3.9"
            fill="#F1F1EF"
          />
        </g>
      </defs>
      <clipPath id={clipId}>
        <circle cx="256" cy="256" r="256" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {/* Right Half: UK Flag Base (Navy Blue) */}
        <rect x="256" y="0" width="256" height="512" fill="#142E68" />

        {/* UK Diagonal Saltire - St Andrew (White) */}
        <line x1="256" y1="256" x2="512" y2="0" stroke="#F1F1EF" strokeWidth="54" />
        <line x1="256" y1="256" x2="512" y2="512" stroke="#F1F1EF" strokeWidth="54" />

        {/* UK Diagonal Saltire - St Patrick (Red, counterchanged) */}
        <line x1="262" y1="262" x2="518" y2="6" stroke="#B9162D" strokeWidth="18" />
        <line x1="262" y1="250" x2="518" y2="506" stroke="#B9162D" strokeWidth="18" />

        {/* UK St George Cross White Fimbriation */}
        <rect x="256" y="0" width="64" height="512" fill="#F1F1EF" />
        <rect x="256" y="192" width="256" height="128" fill="#F1F1EF" />

        {/* UK St George Red Cross */}
        <rect x="256" y="0" width="40" height="512" fill="#B9162D" />
        <rect x="256" y="216" width="256" height="80" fill="#B9162D" />

        {/* Left Half: US Flag Stripes (Bottom-Left) */}
        <rect x="0" y="256" width="256" height="256" fill="#F1F1EF" />
        <rect x="0" y="298.67" width="256" height="42.67" fill="#B9162D" />
        <rect x="0" y="384.00" width="256" height="42.67" fill="#B9162D" />
        <rect x="0" y="469.33" width="256" height="42.67" fill="#B9162D" />

        {/* Left Half: US Flag Canton (Top-Left) */}
        <rect x="0" y="0" width="256" height="256" fill="#142E68" />

        {/* 13 Stars in Canton */}
        <use href={`#${starId}`} x="169" y="24" />
        <use href={`#${starId}`} x="123" y="57" />
        <use href={`#${starId}`} x="212" y="57" />
        <use href={`#${starId}`} x="79" y="97" />
        <use href={`#${starId}`} x="168" y="97" />
        <use href={`#${starId}`} x="39" y="138" />
        <use href={`#${starId}`} x="123" y="138" />
        <use href={`#${starId}`} x="212" y="138" />
        <use href={`#${starId}`} x="79" y="177" />
        <use href={`#${starId}`} x="168" y="177" />
        <use href={`#${starId}`} x="34" y="218" />
        <use href={`#${starId}`} x="123" y="218" />
        <use href={`#${starId}`} x="212" y="218" />
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
