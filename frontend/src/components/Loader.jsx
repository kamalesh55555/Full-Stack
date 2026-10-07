import React from 'react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="flex items-center justify-center w-16 h-16 bg-chalk/10 rounded-full shadow-inner">
        <span className="font-display font-bold text-chalk text-4xl animate-[spin_1.5s_linear_infinite]">P</span>
      </div>
      <p className="text-ink/60 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default Loader;
