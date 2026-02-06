'use client';

import { IExpense } from '@/models/expense.model';
import moment from 'moment';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import clsx from 'clsx';
import { ExpenseType } from '@/constant';
import Button from '@/common/Button';
import { GrEdit } from 'react-icons/gr';
import { RiDeleteBinFill } from 'react-icons/ri';

const ExpensesTable = ({
  expenses,
  handleExpenseEdit,
  handleExpenseDelete,
}: {
  expenses: IExpense[];
  handleExpenseEdit: (id: string, data: {
    title: string;
    date: Date;
    amount: number;
    expenseType: string;
  }) => Promise<void>;
  handleExpenseDelete: (id: string) => Promise<void>;
}) => {
  return (
    <table className='w-full'>
      <thead>
        <tr>
          <th className='text-[var(--d-blue)] font-bold text-center rounded-tl-md bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Date</th>
          <th className='text-[var(--d-blue)] font-bold text-center bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Title</th>
          <th className='text-[var(--d-blue)] font-bold text-center bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Amount</th>
          <th className='text-[var(--d-blue)] font-bold text-center rounded-tr-md bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Action</th>
        </tr>
      </thead>
      <tbody>
        {
          expenses?.map((expense, index) => (
            <tr key={expense._id as string}>

              <td className={clsx(
                'text-md text-center border-b-1 border-[var(--grey)] p-2',
                expense.expenseType === ExpenseType.EXPENSE ? 'bg-[var(--l-red)]' : 'bg-[var(--l-green)]',
                {'rounded-bl-md': index + 1 === expenses.length},
              )}>
                {moment(`${expense.date}`).format('DD-MM-YYYY')}
              </td>

              <td className={clsx(
                'text-md text-center border-b-1 border-[var(--grey)] p-2',
                expense.expenseType === ExpenseType.EXPENSE ? 'bg-[var(--l-red)]' : 'bg-[var(--l-green)]',
              )}>
                {expense.title}
              </td>

              <td className={clsx(
                'text-md text-center border-b-1 border-[var(--grey)] p-2',
                expense.expenseType === ExpenseType.EXPENSE ? 'bg-[var(--l-red)]' : 'bg-[var(--l-green)]',
              )}>
                <div>
                  <span className={clsx(
                    'flex items-center justify-center gap-1 font-bold',
                    expense.expenseType === ExpenseType.EXPENSE ? 'text-[var(--d-red)]' : 'text-[var(--d-green)]'
                  )}>
                    {expense.expenseType === ExpenseType.EXPENSE ? '-' : '+'}
                    <FaIndianRupeeSign/>
                    {expense.amount.toLocaleString()}
                  </span>
                </div>
              </td>

              <td className={clsx(
                'text-md text-center border-b-1 border-[var(--grey)]',
                expense.expenseType === ExpenseType.EXPENSE ? 'bg-[var(--l-red)]' : 'bg-[var(--l-green)]',
                {'rounded-br-md': index + 1 === expenses.length},
              )}>
                <Button
                  className='bg-white p-2 m-1 shadow-[0_0_3px_#d5d5d5] rounded-md text-[var(--d-green)]'
                  onClick={() => handleExpenseEdit(expense._id as string, {
                    date: expense.date as Date,
                    expenseType: expense.expenseType,
                    title: expense.title,
                    amount: expense.amount,
                  })}
                >
                  <GrEdit />
                </Button>
                <Button
                  className='bg-white p-2 m-1 shadow-[0_0_3px_#d5d5d5] rounded-md text-[var(--d-red)]'
                  onClick={() => handleExpenseDelete(expense._id as string)}
                >
                  <RiDeleteBinFill />
                </Button>
              </td>

            </tr>
          ))
        }
      </tbody>
    </table>
  );
};

export default ExpensesTable;