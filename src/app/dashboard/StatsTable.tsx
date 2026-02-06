import moment from 'moment';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import clsx from 'clsx';
import { Statistic } from '@/lib/dashboard.apis';

const StatsTable = ({
  stats,
  total_income,
  total_expenses,
}: {
  stats: Statistic[];
  total_income: number;
  total_expenses: number;
}) => {
  return (
    <table className='w-full'>
      <thead>
        <tr>
          <th className='text-[var(--d-blue)] font-bold text-center rounded-tl-md bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Date</th>
          <th className='text-[var(--d-blue)] font-bold text-center bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Expenses</th>
          <th className='text-[var(--d-blue)] font-bold text-center rounded-tr-md bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Income</th>
        </tr>
      </thead>
      <tbody>
      {
        stats?.map((stat, index) => (
          <tr key={stat.date as string}>

            <td className={clsx(
              'text-md text-center border-b-1 border-[var(--grey)] p-2',
              {'bg-[var(--l-bg)]': index % 2 !== 0}
            )}>
              {moment(`${stat.date}`).format('DD-MM-YYYY')}
            </td>

            <td className={clsx(
              'text-md text-center border-b-1 border-[var(--grey)] p-2 text-[var(--d-red)] font-bold',
              {'bg-[var(--l-bg)]': index % 2 !== 0}
            )}>
              <span className='flex items-center justify-center gap-1'>
                <FaIndianRupeeSign /> {stat.expenses.toLocaleString()}
              </span>
            </td>

            <td className={clsx(
              'text-md text-center border-b-1 border-[var(--grey)] p-2 text-[var(--d-green)] font-bold',
              {'bg-[var(--l-bg)]': index % 2 !== 0}
            )}>
              <span className='flex items-center justify-center gap-1'>
                <FaIndianRupeeSign /> {stat.income.toLocaleString()}
              </span>
            </td>

          </tr>
        ))
      }
        <tr>
          <td className='bg-[var(--d-blue)] text-center rounded-bl-md text-white p-2 border-b-1 border-[var(--grey)]'>Total</td>
          <td className='bg-[var(--d-blue)] text-center text-white p-2 border-b-1 border-[var(--grey)]'>
            <span className='flex items-center justify-center gap-1'>
              <FaIndianRupeeSign /> {total_expenses.toLocaleString()}
            </span>
          </td>
          <td className='bg-[var(--d-blue)] text-center rounded-br-md text-white p-2 border-b-1 border-[var(--grey)]'>
            <span className='flex items-center justify-center gap-1'>
              <FaIndianRupeeSign /> {total_income.toLocaleString()}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default StatsTable;