'use client';

import { ExpenseType } from '@/constant';
import { ROUTES } from '@/constant/routePath';
import { getCookie } from '@/lib/auth.apis';
import { deleteExpense, getExpenses, getStats, Statistic } from '@/lib/dashboard.apis';
import { IExpense } from '@/models/expense.model';
import { getAxiosErrorMessage, isConfirmed } from '@/utils';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import SectionLoader from '@/common/Loader/SectionLoader';
import Button from '@/common/Button';
import { RiAddLargeLine, RiDeleteBinFill } from 'react-icons/ri';
import { IoStatsChartSharp } from 'react-icons/io5';
import { GiExpense } from 'react-icons/gi';
import NewExpense from './NewExpense';
import { GrEdit } from 'react-icons/gr';
import { ExpenseForm } from '@/schemas/newExpense.schema';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';

export type Month = 'full_year' | 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export type Months = Array<Month>;

const monthsMap: Record<string, number> = {
  full_year: 0,
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const Dashboard = () => {
  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ expenses, setExpenses ] = useState<IExpense[]>();
  const [ stats, setStats ] = useState<Statistic[]>();
  const [ disabledMonths, setDisabledMonths ] = useState<Months>([]);
  const [ years, setYears ] = useState<number[]>([]);
  const currentYear = Number(moment().format('YYYY'));
  const currentMonth = moment().format('MMMM');
  const [ selectedYear, setSelectedYear ] = useState<number>(currentYear);
  const [ selectedMonth, setSelectedMonth ] = useState<Month>(currentMonth as Month);
  const startingYear = 2025;
  const [ isExpenseModalVisible, setIsExpenseModalVisible ] = useState<boolean>(false);
  const token = useRef<string | null>(null);
  const formInitialValues = useRef<Partial<ExpenseForm> & {id?: string}>({
    expenseType: '',
    title: '',
  });
  const total_income = useRef<number>(0);
  const total_expenses = useRef<number>(0);

  const resetFormInitialValues = () => {
    formInitialValues.current = {
      expenseType: '',
      title: '',
    };
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const user = await getCookie();
        token.current = user.token;
      }
      catch(error) {
        const msg = getAxiosErrorMessage(error);
        console.error(msg);
        toast.error('Something went wrong');
        router.push(ROUTES.DEFAULT.path);
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const result = await getExpenses({
        params: {month: monthsMap[selectedMonth], year: selectedYear},
        headers: {Authorization: `Bearer ${token.current}`},
      }
      );
      setExpenses(result.expenses);
    }
    catch(error) {
      const msg = getAxiosErrorMessage(error);
      console.error(msg);
      toast.error('Something went wrong');
    }
    finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const result = await getStats({
        params: {month: monthsMap[selectedMonth], year: selectedYear},
        headers: {Authorization: `Bearer ${token.current}`},
      });
      total_expenses.current = result.stats.reduce((sum, stat) => sum + (stat.expenses || 0), 0) || 0;
      total_income.current = result.stats.reduce((sum, stat) => sum + (stat.income || 0), 0);
      setStats(result.stats);
    }
    catch(error) {
      const msg = getAxiosErrorMessage(error);
      console.error(msg);
      toast.error('Something went wrong');
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {    
    for(let i = startingYear; i <= currentYear; i++) {
      setYears(prev => [...prev, i]);
    }
  }, []);

  useEffect(() => {    
    if(currentYear === selectedYear) {
      setDisabledMonths(Object.entries(monthsMap).filter(entry => entry[1] > monthsMap[currentMonth]).map(entry => entry[0]) as Months);
    }
    else {
      setDisabledMonths([]);
    }
  }, [selectedYear]);

  const [ selectedView, setSelectedView ] = useState<'stats' | 'expenses'>('stats');

  useEffect(() => {
    if(token.current) {
      if(selectedView === 'expenses') {
        fetchExpenses();
      }
      else {
        fetchStats();
      }
    }
  }, [selectedView, selectedMonth, selectedYear]);

  const isMonthDisabled = (month: string) => disabledMonths.includes(month as Month);

  const handleExpenseEdit = async (id: string, data: ExpenseForm) => {
    try {
      setIsLoading(true);
      const confirmed: boolean = await isConfirmed(
        'Edit Expense',
        'Are you sure?',
        'Yes, Continue',
        'No, Cancel'
      );
  
      if(confirmed) {
        formInitialValues.current = {
          id,
          date: moment(data.date).format('YYYY-MM-DD') as unknown as Date,
          expenseType: data.expenseType,
          title: data.title,
          amount: data.amount,
        };
        setIsExpenseModalVisible(true);
      }
    }
    catch(error) {
      const msg = getAxiosErrorMessage(error);
      console.error(msg);
      toast.error('Something went wrong');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleExpenseDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const confirmed: boolean = await isConfirmed(
        'Delete Expense',
        'Are you sure?',
        'Yes, Delete it',
        'No, Keep it'
      );
  
      if(confirmed && token.current) {
        await deleteExpense(id, {
          headers: {Authorization: `Bearer ${token.current}`},
        });
        await fetchExpenses();
        await fetchStats();
        toast.success('Expense deleted successfully');
      }
    }
    catch(error) {
      const msg = getAxiosErrorMessage(error);
      console.error(msg);
      toast.error('Something went wrong');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    isExpenseModalVisible ?
    <NewExpense
      closeModal={() => {setIsExpenseModalVisible(false);}}
      refetchData={() => {fetchExpenses(); fetchStats();}}
      initialValues={formInitialValues.current}
      token={token.current}
      resetInitialValues={resetFormInitialValues}
    /> :
    <>
      <h1 className='text-center text-[var(--d-blue)] font-bold text-3xl my-10'>Expense Tracker Dashboard</h1>
      <div className='w-[90%] flex justify-center lg:justify-between lg:flex-row flex-col mx-auto gap-3 flex-wrap items-center'>
        <Button
          title='New Expense'
          className='py-2 px-4 rounded-lg bg-[var(--d-blue)] text-white flex items-center justify-center gap-3'
          onClick={() => setIsExpenseModalVisible(true)}>
          <RiAddLargeLine />
          New Expense
        </Button>
        <div className='flex rounded-lg shadow-[0_0_5px_3px_#d5d5d5]'>
          <Button
            title='Statistics'
            className={clsx(
              'py-2 px-4 rounded-l-lg flex items-center justify-center gap-3',
              selectedView === 'stats' ? 'bg-[var(--d-blue)] text-white' : 'bg-white text-[var(--d-blue)]'
            )}
            onClick={() => setSelectedView('stats')}>
            <IoStatsChartSharp />
            Statistics
          </Button>
          <Button
            title='Expenses'
            className={clsx(
              'py-2 px-4 rounded-r-lg flex items-center justify-center gap-3',
              selectedView === 'expenses' ? 'bg-[var(--d-blue)] text-white' : 'bg-white text-[var(--d-blue)]'
            )}
            onClick={() => setSelectedView('expenses')}>
            <GiExpense />
            Expenses
          </Button>
        </div>
        <div className='flex gap-3'>
          <select value={selectedMonth} onChange={e => {setSelectedMonth(e.target.value as Month);}} className='cursor-pointer bg-white p-2 rounded-md shadow-[0_0_5px_3px_#d5d5d5] focus:outline-0 focus:text-[var(--d-blue)] focus:font-bold'>
            <option value='full_year' disabled={isMonthDisabled('January')} className='bg-white'>Full year</option>
            <option value='January' disabled={isMonthDisabled('January')} className='bg-white'>January</option>
            <option value='February' disabled={isMonthDisabled('February')} className='bg-white'>February</option>
            <option value='March' disabled={isMonthDisabled('March')} className='bg-white'>March</option>
            <option value='April' disabled={isMonthDisabled('April')} className='bg-white'>April</option>
            <option value='May' disabled={isMonthDisabled('May')} className='bg-white'>May</option>
            <option value='June' disabled={isMonthDisabled('June')} className='bg-white'>June</option>
            <option value='July' disabled={isMonthDisabled('July')} className='bg-white'>July</option>
            <option value='August' disabled={isMonthDisabled('August')} className='bg-white'>August</option>
            <option value='September' disabled={isMonthDisabled('September')} className='bg-white'>September</option>
            <option value='October' disabled={isMonthDisabled('October')} className='bg-white'>October</option>
            <option value='November' disabled={isMonthDisabled('November')} className='bg-white'>November</option>
            <option value='December' disabled={isMonthDisabled('December')} className='bg-white'>December</option>
          </select>
          <select value={selectedYear} onChange={e => {setSelectedYear(Number(e.target.value));}} className='cursor-pointer bg-white p-2 rounded-md shadow-[0_0_5px_3px_#d5d5d5] focus:outline-0 focus:text-[var(--d-blue)] focus:font-bold'>
            {
              years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))
            }
          </select>
        </div>
      </div>
      {
        selectedView === 'stats' && (
          <span className={clsx(
            'my-5 w-[90%] mx-auto text-xl font-bold p-2 rounded-md shadow-[0_0_5px_3px_#d5d5d5] flex items-center justify-center gap-3',
            total_income.current - total_expenses.current >= 0 ? 'bg-[var(--l-green)] text-[var(--d-green)]' : 'text-[var(--d-red)] bg-[var(--l-red)] ',
          )}>
          {total_income.current - total_expenses.current >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            {total_income.current - total_expenses.current >= 0 ? 'Profit : ' : 'Loss : '} <FaIndianRupeeSign /> {Math.abs((total_income.current - total_expenses.current)).toLocaleString() }
          </span>
        )
      }
      <div className={clsx(
        'mx-auto w-[90%] bg-white shadow-[0_0_5px_3px_#d5d5d5] rounded-md border-1 border-[var(--grey)] my-5',
      )}>
      {
        isLoading ? <SectionLoader/> : <>
        {
          selectedView === 'expenses' ?
          <>{
            expenses && expenses.length > 0 ? (
              <table className='w-full'>
                <thead>
                  <tr>
                    <th className='text-[var(--d-blue)] font-bold text-center rounded-tl-md bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Date</th>
                    <th className='text-[var(--d-blue)] font-bold text-center bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Title</th>
                    <th className='text-[var(--d-blue)] font-bold text-center bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Amount</th>
                    <th className='text-[var(--d-blue)] font-bold text-center bg-[var(--l-blue)] p-2 border-b-1 border-[var(--grey)]'>Type</th>
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
                          <span className='flex items-center justify-center gap-1'>
                            <FaIndianRupeeSign /> {expense.amount.toLocaleString()}
                          </span>
                        </td>

                        <td className={clsx(
                          'text-md text-center border-b-1 border-[var(--grey)] p-2',
                          expense.expenseType === ExpenseType.EXPENSE ? 'bg-[var(--l-red)]' : 'bg-[var(--l-green)]',
                        )}>
                          {expense.expenseType}
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
            ) : (
              <p className='text-center p-5 text-[var(--error)] text-xl'>
                {isLoading ? 'Loading...' : 'No expense found'}
              </p>
            )
          }</> : <>{
            stats && stats.length > 0 ? (
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
                        'text-md text-center border-b-1 border-[var(--grey)] p-2',
                        {'bg-[var(--l-bg)]': index % 2 !== 0}
                      )}>
                        <span className='flex items-center justify-center gap-1'>
                          <FaIndianRupeeSign /> {stat.expenses.toLocaleString()}
                        </span>
                      </td>

                      <td className={clsx(
                        'text-md text-center border-b-1 border-[var(--grey)] p-2',
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
                        <FaIndianRupeeSign /> {total_expenses.current.toLocaleString()}
                      </span>
                    </td>
                    <td className='bg-[var(--d-blue)] text-center rounded-br-md text-white p-2 border-b-1 border-[var(--grey)]'>
                      <span className='flex items-center justify-center gap-1'>
                        <FaIndianRupeeSign /> {total_income.current.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className='text-center p-5 text-[var(--error)] text-xl'>
                {isLoading ? 'Loading...' : 'No stats found'}
              </p>
            )
          }</>
        }
        </>
      }
      </div>
    </>
  );
};

export default Dashboard;
