import React from 'react';
import { Landmark, ShieldAlert } from 'lucide-react';

interface LogoProps {
  isAdmin?: boolean;
  className?: string;
  iconSize?: number;
  textSize?: string;
  subTextSize?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  isAdmin = false, 
  className = '',
  iconSize = 20,
  textSize = 'text-xl',
  subTextSize = 'text-[9px]',
  onClick
}) => {
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`} onClick={onClick}>
      <div className={`relative flex items-center justify-center p-2.5 rounded-xl shadow-lg transition-all group-hover:scale-105 duration-300 ${
        isAdmin 
          ? 'bg-red-600 shadow-red-600/20' 
          : 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-600/20'
      }`}>
        {isAdmin ? (
          <ShieldAlert size={iconSize} className="text-white relative z-10" />
        ) : (
          <>
            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="High SL Global Bank Logo" className="bank-logo hidden" />
            <Landmark size={iconSize} className="text-slate-950 relative z-10" />
            <div className="absolute inset-0 bg-white/20 rounded-xl blur-[2px]"></div>
          </>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <h1 className={`${textSize} font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none group-hover:text-amber-500 transition-colors`}>
          HIGH <span className="text-amber-500">SL</span>
        </h1>
        <p className={`${subTextSize} font-bold tracking-[0.2em] uppercase mt-1 ${
          isAdmin ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'
        }`}>
          {isAdmin ? 'Admin Portal' : 'Premium Banking'}
        </p>
      </div>
    </div>
  );
};
