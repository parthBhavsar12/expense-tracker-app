import Button from '@/common/Button';
import Input from '@/common/Input';
import { IExpense } from '@/models/expense.model';
import { MdClear } from 'react-icons/md';

const ExpenseSearchBar = ({
  isLoading,
  expenses,
  searchBy,
  setSearchBy,
}: {
  isLoading: boolean;
  expenses: IExpense[] | undefined;
  searchBy: string;
  setSearchBy: (value: string) => void;
}) => {
  return (
    <>
      {
        expenses && expenses.length > 0 && (
          <div className='my-5 w-[90%] mx-auto rounded-md shadow-[0_0_5px_3px_#d5d5d5] flex justify-between items-center p-1 bg-[var(--d-blue)]'>
            <Input
              placeholder='Search By Title'
              onChange={(e) => setSearchBy(e.target.value)}
              value={searchBy}
              className='w-[calc(100%-44px)]'
              disabled={isLoading}
            />
            <Button
              onClick={() => setSearchBy('')}
              className='text-white p-3 disabled:opacity-50 disabled:cursor-not-allowed text-xl'
              disabled={searchBy.length === 0 || isLoading}
            >
              <MdClear/>
            </Button>
          </div>
        )
      }
    </>
  );
};

export default ExpenseSearchBar;