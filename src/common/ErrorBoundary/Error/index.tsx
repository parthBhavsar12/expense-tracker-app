'use client';

import Button from '@/common/Button';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface ErrorProps {
  path?: string;
}

export const ErrorComponent: React.FC<ErrorProps> = ({ path }) => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-5'>
        <Image src='assets/error.svg' alt='error' width={280} height={246} priority={true}/>
        <div className='flex flex-col items-center gap-3 -mt-10'>
          <h3 className='text-xl font-medium leading-9 text-black'>
            Something went wrong.
          </h3>
          {path && (
            <p className='text-xl font-normal leading-6 text-black'>
              Please return to home or try again later.
            </p>
          )}
        </div>
        {path && (
          <div className='inline-block mx-auto'>
            <Button
              title='Back To Home'
              className='px-6 py-3 rounded-lg bg-[var(--error)] text-white'
              onClick={() => redirect(path)}>
              {' '}
              Back To Home{' '}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;
