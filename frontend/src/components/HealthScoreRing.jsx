import React from 'react';

export default function HealthScoreRing({ score = 0, size = 80 }) {
  const strokeWidth = Math.max(3, Math.round(size / 12));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Determine color theme based on score threshold
  const getColor = (s) => {
    if (s < 40) return '#EF4444'; // red-500
    if (s < 70) return '#F59E0B'; // amber-500
    return '#10B981'; // emerald-500
  };

  const currentColor = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#334155"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={currentColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Central Score Text */}
      <span 
        className="absolute font-mono font-bold text-center tracking-tighter" 
        style={{ 
          color: currentColor, 
          fontSize: Math.max(10, Math.round(size / 3.2)) 
        }}
      >
        {score}
      </span>
    </div>
  );
}
