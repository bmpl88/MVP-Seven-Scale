import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ToggleSwitch({ isOn, onToggle, disabled = false, size = 'md' }: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-8'
  };

  const thumbSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-7 w-7'
  };

  const translateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-6'
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        ${isOn ? 'bg-blue-600' : 'bg-gray-200'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        relative inline-flex items-center rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2
      `}
      role="switch"
      aria-checked={isOn}
    >
      <span
        className={`
          ${thumbSizeClasses[size]}
          ${isOn ? translateClasses[size] : 'translate-x-0'}
          pointer-events-none inline-block rounded-full bg-white shadow-lg 
          transform ring-0 transition duration-200 ease-in-out
        `}
      />
    </button>
  );
}