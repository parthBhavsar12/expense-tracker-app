import clsx from 'clsx';
import Image from 'next/image';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  className,
  isLoading,
  icon,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(className, 'cursor-pointer')}
      onClick={onClick}
      {...props}>
      {icon && (
        <Image
          src={icon}
          alt='Loading...'
          className={clsx('w-5 h-4', { 'mr-2': !!children })}
          width={20}
          height={16}
        />
      )}
      {isLoading && (
        <Image
          src='/assets/loading.svg'
          alt='Loading...'
          className='w-5 h-4 mr-2 animate-spin'
          width={20}
          height={16}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
