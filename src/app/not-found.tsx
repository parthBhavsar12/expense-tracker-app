'use client';

import { useRouter } from 'next/navigation';
import Button from '@/common/Button';
import { ROUTES } from '@/constant/routePath';

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className='flex items-center justify-center flex-col p-20 gap-3'>
      <h1 className='text-9xl font-bold text-[#ff7070]'>404</h1>
      <h1 className='text-3xl text-[#ff7070] font-bold'>Page Not Found</h1>
      <Button
        className='px-5 py-2 rounded-sm bg-[#ff7070] text-white cursor-pointer mt-50 hover:border hover:border-[#193048]'
        onClick={() => router.push(ROUTES.DEFAULT.path)}
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;