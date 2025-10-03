'use client';

import loginValidationSchema, { UserLoginForm } from '@/schemas/login.schema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/common/Button';
import { toast } from 'react-toastify';
import { getAxiosErrorMessage } from '@/utils';
import PasswordInput from '@/common/Input/PasswordInput';
import { BiLogIn } from 'react-icons/bi';
import { getCookie, loginUser } from '@/lib/auth.apis';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constant/routePath';

const initialValues: UserLoginForm = {
  password: '',
};

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCookie();
      if(user.success) {
        router.push(ROUTES.DASHBOARD.path);
      }
    };
    fetchUser();
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginForm>({
    defaultValues: initialValues,
    resolver: yupResolver(loginValidationSchema),
    mode: 'onTouched',
  });

  const submitForm = handleSubmit(async ({password}) => {
    try {
      setIsLoading(true);
      await loginUser({password});
      toast.success('Logged in successfully');
      router.push(ROUTES.DASHBOARD.path);
    }
    catch(error) {
      const msg = getAxiosErrorMessage(error);
      toast.error(msg);
    }
    finally {
      setIsLoading(false);
    }
  });

  return (
    <div className='w-4/5 sm:w-4/5 lg:w-1/3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_3px_#d5d5d5] rounded-md flex flex-col items-center p-5 gap-5'>
      <h1 className='text-[var(--d-blue)] font-bold text-3xl'>Log In</h1>
      <form onSubmit={submitForm} className='w-full flex flex-col gap-2'>
        <PasswordInput
          name='password'
          placeholder='Enter password here'
          register={register}
          error={errors.password?.message}
          disabled={isLoading}
          className='w-full text-center'
        />
        <Button
          type='submit'
          isLoading={isLoading}
          disabled={isSubmitting}
          className='bg-[var(--d-blue)] text-white rounded-md p-2 mt-3 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#949494] text-lg w-full flex justify-center items-center gap-3'
        >
          <BiLogIn/>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
