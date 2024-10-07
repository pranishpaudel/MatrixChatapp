// src/components/TypingEffect.js
import React from 'react';

const TypingEffect = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-400"></div>
    </div>
  );
};

export default TypingEffect;
