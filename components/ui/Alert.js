'use client';

import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export default function Alert({ type = 'info', title, message, onClose, className = '' }) {
  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      textColor: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      textColor: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700'
    }
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${config.textColor}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
