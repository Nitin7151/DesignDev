import React from 'react';

export function Bubbles() {
  const bubbles = [
    { top: '10%', left: '20%', size: '40px', delay: '0s' },
    { top: '30%', left: '70%', size: '60px', delay: '2s' },
    { top: '50%', left: '40%', size: '30px', delay: '4s' },
    { top: '70%', left: '80%', size: '50px', delay: '1s' },
    { top: '20%', left: '50%', size: '35px', delay: '3s' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(0) scale(1); opacity: 0.7; }
        }
      `}</style>
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="absolute bg-blue-500 rounded-full opacity-50"
          style={{
            top: bubble.top,
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animation: `float 6s ease-in-out ${bubble.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default Bubbles;
