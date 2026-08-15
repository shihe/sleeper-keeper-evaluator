
import React from 'react';

interface SleeperIconProps {
    className?: string;
}

export const SleeperIcon: React.FC<SleeperIconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="sleeper-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#12A5C9" />
            </linearGradient>
        </defs>
        <path
            fill="url(#sleeper-gradient)"
            d="M239.05 106.1c-15.02-30.03-39.73-54.74-69.76-69.76C139.26 21.32 101.44 21.32 71.41 36.34 41.38 51.36 16.67 76.07 16.67 106.1c0 14.82 2.94 29.2 8.52 42.61l-1.39 1.39c-5.46 5.46-5.46 14.31 0 19.77l19.77 19.77c5.46 5.46 14.31 5.46 19.77 0l1.39-1.39c13.41 5.58 27.79 8.52 42.61 8.52 23.95 0 47.9-11.83 62.92-29.41 15.02-17.58 23.95-39.73 23.95-62.92 0-11.41-2.07-22.82-6.19-33.51zM127.83 175.7c-37.4 0-68.04-30.64-68.04-68.04s30.64-68.04 68.04-68.04c37.4 0 68.04 30.64 68.04 68.04s-30.64 68.04-68.04 68.04z"
        />
        <path
            fill="currentColor"
            className="text-slate-900"
            d="M127.83 59.39a48.27 48.27 0 100 96.54 48.27 48.27 0 000-96.54zm0 29.41c-9.05 0-16.4 7.35-16.4 16.4s7.35 16.4 16.4 16.4 16.4-7.35 16.4-16.4-7.35-16.4-16.4-16.4z"
        />
    </svg>
);
