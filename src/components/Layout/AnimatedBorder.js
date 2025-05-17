import React, { useEffect, useRef } from 'react';

const AnimatedBorder = ({ children }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative rounded-xl p-px bg-transparent group"
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px',
      }}
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.2), transparent 40%)`
        }}
      />
      <div className="relative rounded-xl bg-gray-900 h-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorder;