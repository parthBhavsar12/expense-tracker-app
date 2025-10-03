import clsx from 'clsx';
import Image from 'next/image';
import type { InputHTMLAttributes } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

export interface InputProps<TFormValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  register?: UseFormRegister<TFormValues>;
  error?: string;
  name?: Path<TFormValues>;
  icon?: string;
  onIconClick?: () => void;
  iconClassName?: string;
  width?: number,
  height?: number,
}

const Input = <TFormValues extends FieldValues>({
  label,
  name,
  className,
  error,
  onChange,
  register,
  icon,
  iconClassName,
  onIconClick,
  width,
  height,
  ...props
}: InputProps<TFormValues>) => {
  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {
        label && (
          <label htmlFor={name} className='wrap-break-word w-full text-black pl-1 mt-3'>{label ?? ''}</label>
        )
      }
      <div className={clsx('relative')}>
        <input
          id={name}
          className={clsx(
            'w-full p-2 border-1 rounded-md text-black outline-0 border-[#d5d5d5] bg-white placeholder:text-[#a8a8a8]    focus:border-2 focus:border-blue-400',
            className
          )}
          {...props}
          onChange={onChange}
          {...(register && name && register(name, { onChange }))}
        />
        {icon && width && height && (
          <Image
            width={width}
            height={height}
            className={clsx(
              'absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer',
              iconClassName
            )}
            onClick={onIconClick}
            src={icon}
            alt={name as string}
          />
        )}
      </div>
      {error && <p className='text-[var(--error)]'>{error}</p>}
    </div>
  );
};

export default Input;
