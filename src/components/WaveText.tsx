import React from 'react';

interface WaveTextProps {
  text: string;
  className?: string;
}

const WaveText: React.FC<WaveTextProps> = ({ text, className = '' }) => {
  return (
    <span className={`wave-text-container group ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="wave-char inline-block transition-transform duration-200"
          style={{
            animationDelay: `${index * 0.03}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default WaveText;
