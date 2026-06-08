import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, Trash } from 'lucide-react';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  type = 'success',
  title, 
  message, 
  buttonText = "Return",
  onButtonClick
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      bgClass: 'bg-[#F0FDF4]', 
      icon: <CheckCircle2 size={36} color="white" fill="#22C55E" strokeWidth={1.5} />
    },
    error: {
      bgClass: 'bg-[#FEF2F2]',
      icon: <XCircle size={36} color="white" fill="#EF4444" strokeWidth={1.5} />
    },
    warning: {
      bgClass: 'bg-[#FFFBEB]',
      icon: <AlertCircle size={36} color="white" fill="#F59E0B" strokeWidth={1.5} />
    },
    info: {
      bgClass: 'bg-[#EFF6FF]',
      icon: <Info size={36} color="white" fill="#3B82F6" strokeWidth={1.5} />
    },
    delete: {
      bgClass: 'bg-[#FEF2F2]',
      icon: <Trash size={32} color="#C1200C" fill="#C1200C" strokeWidth={1.5} />
    }
  };

  const currentConfig = config[type] || config.success;

  return (
    <div className="fixed inset-0 bg-black/40 z-100 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-3xl w-full max-w-100 shadow-2xl flex flex-col text-center overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-8 pb-7 flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${currentConfig.bgClass}`}>
            {currentConfig.icon}
          </div>
          <h3 className="text-[20px] font-bold text-gray-900 mb-2.5 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed px-2">
            {message}
          </p>
        </div>

        <div className="p-6 pt-5 border-t border-gray-100 bg-white">
          <button
            onClick={onButtonClick || onClose}
            className="w-full py-3.5 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationModal;