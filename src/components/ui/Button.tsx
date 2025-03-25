'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none';
    
    // Variant classes
    const variantClasses = {
      primary: 'bg-[#007BF9] hover:bg-[#0063cc] text-white',
      secondary: 'bg-[#B8E2F2] hover:bg-[#9dd3e9] text-[#10243E]',
      outline: 'border border-[#E4E7EB] hover:bg-[#F5F5F5] text-[#49617E]',
      ghost: 'hover:bg-[#F5F5F5] text-[#49617E]',
      danger: 'bg-[#F85464] hover:bg-[#e63e4f] text-white',
      success: 'bg-[#30BF89] hover:bg-[#26a176] text-white',
    };
    
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };
    
    // Width class
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Disabled and loading state
    const stateClasses = (disabled || isLoading) 
      ? 'opacity-70 cursor-not-allowed' 
      : '';
    
    return (
      <button
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${widthClass}
          ${stateClasses}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        
        {children}
        
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;