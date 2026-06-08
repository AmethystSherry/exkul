import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {

  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none gap-2 cursor-pointer";

  const variants = {
    primary: "bg-[#C62828] text-white hover:bg-[#B71C1C] shadow-[0_4px_0_0_#8e0000] active:shadow-none active:translate-y-1",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    subtle: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    text: "bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-50"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = "Button";
export default Button;