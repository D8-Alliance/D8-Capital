import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  error,
  helpText,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div id={`form-field-wrapper-${id}`} className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="block text-xs font-mono font-medium text-white/70 tracking-wider uppercase"
      >
        {label}
        {required && <span className="text-[#c4a67e] ml-1 font-bold">*</span>}
      </label>
      {children}
      {helpText && !error && (
        <p className="text-[11px] text-white/40 leading-tight">{helpText}</p>
      )}
      {error && (
        <p className="text-[11px] text-rose-400 font-medium leading-tight flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-400"></span>
          {error}
        </p>
      )}
    </div>
  );
};
