import clsx from 'clsx';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

const StatsSummary = ({
  isLoading,
  total_income,
  total_expenses,
}: {
  isLoading: boolean;
  total_income: number;
  total_expenses: number;
}) => {
  if (isLoading) {
    return (
      <span className={clsx(
        'my-5 w-[90%] mx-auto text-xl font-bold p-2 rounded-md shadow-[0_0_5px_3px_#d5d5d5] flex items-center justify-center gap-3',
        total_income - total_expenses >= 0 ? 'bg-[var(--l-green)] text-[var(--d-green)]' : 'text-[var(--d-red)] bg-[var(--l-red)] ',
      )}>
        <Skeleton width={100}/>
        <Skeleton width={100}/>
        <Skeleton width={100}/>
      </span>
    );
  };

  return (
    <span className={clsx(
      'my-5 w-[90%] mx-auto text-xl font-bold p-2 rounded-md shadow-[0_0_5px_3px_#d5d5d5] flex items-center justify-center gap-3',
      total_income - total_expenses >= 0 ? 'bg-[var(--l-green)] text-[var(--d-green)]' : 'text-[var(--d-red)] bg-[var(--l-red)] ',
    )}>
      {total_income - total_expenses >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
      {total_income - total_expenses >= 0 ? 'Profit : ' : 'Loss : '} <FaIndianRupeeSign /> {Math.abs((total_income - total_expenses)).toLocaleString() }
      {total_income > 0 && total_expenses > 0 && (` (${(Math.abs(total_income - total_expenses) / total_expenses * 100).toFixed(2)}%)`)}
    </span>
  );
};

export default StatsSummary;