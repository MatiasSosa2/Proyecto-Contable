import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;