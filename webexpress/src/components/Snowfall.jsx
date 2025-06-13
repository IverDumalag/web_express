import React, { useEffect, useState } from 'react';

const Snowfall = ({ snowflakeCount = 40, color = '#e6f7ff' }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const newSnowflakes = Array(snowflakeCount).fill().map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 5,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setSnowflakes(newSnowflakes);
  }, [snowflakeCount]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {snowflakes.map(snowflake => (
        <div
          key={snowflake.id}
          style={{
            position: 'absolute',
            top: '-10px',
            left: `${snowflake.left}%`,
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            opacity: snowflake.opacity,
            animation: `fall ${snowflake.duration}s linear ${snowflake.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) translateX(${Math.random() * 50 - 25}px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Snowfall;