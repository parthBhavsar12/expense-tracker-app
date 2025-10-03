import Button from '@/common/Button';
import Input from '@/common/Input';
import { ExpenseType } from '@/constant';
import { editExpense, newExpense } from '@/lib/dashboard.apis';
import newExpenseValidationSchema, { ExpenseForm } from '@/schemas/newExpense.schema';
import { getAxiosErrorMessage } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GrClose, GrEdit } from 'react-icons/gr';
import { RiAddLargeLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

const NewExpense: React.FC<{
  closeModal: () => void,
  refetchData: () => void,
  initialValues: Partial<ExpenseForm> & {id?: string},
  token: string | null;
  resetInitialValues: () => void;
}> = ({
  closeModal,
  refetchData,
  initialValues,
  token,
  resetInitialValues,
}) => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseForm>({
    defaultValues: initialValues,
    resolver: yupResolver(newExpenseValidationSchema),
    mode: 'onTouched',
  });

  const submitForm = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      if(initialValues.id) {
        await editExpense(initialValues.id, data, {
          headers: {Authorization: `Bearer ${token}`},
        });
        resetInitialValues();
        toast.success('Expense updated successfully');
      }
      else {
        await newExpense(data, {
          headers: {Authorization: `Bearer ${token}`},
        });
        toast.success('New expense added successfully');
      }
      refetchData();
      closeModal();
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
    <div className='mx-auto w-[70%] relative rounded-md my-20 flex flex-col shadow-[0_0_5px_3px_#d5d5d5] p-10 bg-white'>
      <Button onClick={closeModal} className='bg-[var(--error)] absolute top-0 right-0 text-white p-3 rounded-tr-md rounded-bl-md'>
        <GrClose />
      </Button>
      <h1 className='text-center text-[var(--d-blue)] font-bold text-3xl mb-10'>
        {initialValues.id ? 'Edit Expense' : 'Add New Expense'}
      </h1>
      <form onSubmit={submitForm} className='flex flex-col gap-2'>

        <input
          id='date'
          min={moment('2025-01-01').format('YYYY-MM-DD')}
          max={moment().format('YYYY-MM-DD')}
          className='w-full p-2 border-1 rounded-md text-black outline-0 border-[#d5d5d5] bg-white placeholder:text-[#a8a8a8]    focus:border-2 focus:border-blue-400'
          {...(register('date'))}
          type='date'
        />
        {errors.date && <p className='text-[var(--error)]'>{errors.date.message}</p>}

        <Input
          name='title'
          placeholder='Enter title here'
          register={register}
          error={errors.title?.message}
          disabled={isLoading}
        />

        <Input
          name='amount'
          placeholder='Enter amount here'
          register={register}
          error={errors.amount?.message}
          disabled={isLoading}
        />

        <select
          id='expenseType'
          className='w-full p-2 border-1 rounded-md text-black outline-0 border-[#d5d5d5] bg-white placeholder:text-[#a8a8a8]    focus:border-2 focus:border-blue-400'
          {...(register('expenseType'))}
        >
          <option value=''>-- Select Expense Type --</option>
          <option value={ExpenseType.EXPENSE} className='bg-[var(--l-red)]'>Expense</option>
          <option value={ExpenseType.INCOME} className='bg-[var(--l-green)]'>Income</option>
        </select>
        {errors.expenseType && <p className='text-[var(--error)]'>{errors.expenseType.message}</p>}

        <Button
          type='submit'
          isLoading={isLoading}
          disabled={isSubmitting}
          className='bg-[var(--d-blue)] text-white rounded-md p-2 mt-3 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#949494] text-lg w-full flex justify-center items-center gap-3'
        >
          {initialValues.id ? <GrEdit /> : <RiAddLargeLine />}
          {initialValues.id ? 'Edit Expense' : 'Add Expense'}
        </Button>
      </form>
    </div>
  );
};

export default NewExpense;
