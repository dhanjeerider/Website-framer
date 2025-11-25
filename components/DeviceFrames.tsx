import React from 'react';

interface DeviceProps {
  src: string;
  className?: string;
}

// Helper to ensure image URLs are valid for the screenshot service
const getScreenshotUrl = (url: string, device: 'desktop' | 'mobile') => {
  const cleanUrl = url.replace(/^https?:\/\//, '');
  if (!cleanUrl) return 'https://picsum.photos/800/600'; // Fallback
  
  // Use high-res screenshots
  if (device === 'mobile') {
    return `https://image.thum.io/get/width/600/crop/1000/noanimate/https://${cleanUrl}`;
  }
  return `https://image.thum.io/get/width/1200/crop/800/noanimate/https://${cleanUrl}`;
};

export const DesktopMonitor: React.FC<DeviceProps> = ({ src, className = '' }) => {
  const imgUrl = getScreenshotUrl(src, 'desktop');
  return (
    <div className={`relative ${className}`}>
      {/* Stand */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-32 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-xl shadow-xl z-0"></div>
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[10px] w-4 h-12 bg-gray-800 z-0"></div>
      
      {/* Screen Frame */}
      <div className="relative bg-gray-900 rounded-xl p-3 shadow-2xl border border-gray-800 w-[500px]">
        {/* Camera dot */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full opacity-50"></div>
        
        {/* Display Area */}
        <div className="relative bg-white w-full h-[300px] overflow-hidden rounded-md group">
           <img 
            src={imgUrl} 
            alt="Desktop" 
            draggable={false}
            className="w-full h-full object-cover object-top select-none"
            crossOrigin="anonymous"
          />
        </div>
      </div>
    </div>
  );
};

export const Laptop: React.FC<DeviceProps> = ({ src, className = '' }) => {
  const imgUrl = getScreenshotUrl(src, 'desktop');
  return (
    <div className={`relative group flex flex-col items-center ${className}`}>
      {/* Screen Part */}
      <div className="relative bg-[#1a1a1a] rounded-t-2xl p-2 pb-0 shadow-2xl border border-[#333] w-[640px]">
        {/* Camera */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full z-20"></div>
        
        <div className="bg-black w-full h-[400px] rounded-t-lg overflow-hidden relative border border-gray-800">
          <img 
            src={imgUrl} 
            alt="Laptop" 
            draggable={false}
            className="w-full h-full object-cover object-top select-none"
            crossOrigin="anonymous"
          />
          {/* Screen Glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
      
      {/* Base Part (Keyboard deck) */}
      <div className="relative h-4 bg-gray-300 w-[740px] rounded-b-xl shadow-device flex items-center justify-center border-t border-gray-400 z-20">
        <div className="w-24 h-1.5 bg-gray-400 rounded-full opacity-50 mt-0.5"></div>
      </div>
      
      {/* Reflection under laptop */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-10 bg-black/40 blur-2xl rounded-[100%]"></div>
    </div>
  );
};

export const Tablet: React.FC<DeviceProps> = ({ src, className = '' }) => {
  const imgUrl = getScreenshotUrl(src, 'mobile');
  return (
    <div className={`relative ${className}`}>
      <div className="bg-[#1a1a1a] rounded-[24px] p-2.5 shadow-2xl border border-gray-700 w-[280px] h-[380px]">
        <div className="bg-white w-full h-full rounded-[16px] overflow-hidden relative border border-black">
           <img 
            src={imgUrl} 
            alt="Tablet" 
            draggable={false}
            className="w-full h-full object-cover object-top select-none"
            crossOrigin="anonymous"
          />
           {/* Side Button Hint */}
           <div className="absolute -right-3 top-12 w-0.5 h-8 bg-gray-600 rounded-r-md"></div>
           
           {/* Reflection */}
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export const Mobile: React.FC<DeviceProps> = ({ src, className = '' }) => {
  const imgUrl = getScreenshotUrl(src, 'mobile');
  return (
    <div className={`relative ${className}`}>
      {/* Reduced padding (bezel) and thinner border */}
      <div className="bg-[#1a1a1a] rounded-[32px] p-1.5 shadow-2xl border border-[#222] w-[180px] h-[360px]">
        <div className="bg-white w-full h-full rounded-[24px] overflow-hidden relative border border-black">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10"></div>
           <img 
            src={imgUrl} 
            alt="Mobile" 
            draggable={false}
            className="w-full h-full object-cover object-top select-none"
            crossOrigin="anonymous"
          />
          {/* Reflection */}
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-white/10 pointer-events-none"></div>
        </div>
        {/* Power Button */}
        <div className="absolute -right-2 top-24 w-0.5 h-8 bg-gray-700 rounded-r-md"></div>
      </div>
    </div>
  );
};
