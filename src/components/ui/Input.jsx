import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Info } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  description,
  error,
  trailingIcon,
  isTextarea = false,
  ...props
}, ref) => {

  const inputBaseStyles = "w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500";

  const stateStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder:text-red-300"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400";

  const InputComponent = isTextarea ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
          {label}
          <Info size={14} className="text-gray-400" />
        </label>
      )}

      <div className="relative flex items-center">
        <InputComponent
          ref={ref}
          type={type}
          className={cn(
            inputBaseStyles,
            stateStyles,
            trailingIcon && !isTextarea ? "pr-10" : "",
            isTextarea ? "min-h-25 resize-y" : "",
            className
          )}
          {...props}
        />

        {trailingIcon && !isTextarea && (
          <div className="absolute right-3 text-gray-400 flex items-center justify-center">
            {trailingIcon}
          </div>
        )}
      </div>

      {error ? (
        <span className="text-sm text-red-500">{error}</span>
      ) : description ? (
        <span className="text-sm text-gray-500">{description}</span>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";
export default Input;