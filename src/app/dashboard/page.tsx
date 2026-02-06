'use client';

import { ROUTES } from '@/constant/routePath';
import { getCookie } from '@/lib/auth.apis';
import { deleteExpense, getExpenses, getStats, Statistic } from '@/lib/dashboard.apis';
import { IExpense } from '@/models/expense.model';
import { getAxiosErrorMessage, isConfirmed } from '@/utils';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import NewExpense from './NewExpense';
import { ExpenseForm } from '@/schemas/newExpense.schema';
import ExpensesSkeleton from '@/components/Skeletons/ExpensesSkeleton';
import StatisticsSkeleton from '@/components/Skeletons/StatisticsSkeletons';
import ExpensesTable from '@/app/dashboard/ExpensesTable';
import TopOfPage from '@/app/dashboard/TopOfPage';
import StatsSummary from '@/app/dashboard/StatsSummary';
import ExpenseSearchBar from '@/app/dashboard/ExpenseSearchBar';
import StatsTable from '@/app/dashboard/StatsTable';

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
  const [ searchBy, setSearchBy ] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
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

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const user = await getCookie();
      setToken(user.token);
    } catch {
      router.push(ROUTES.DEFAULT.path);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [router]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const result = await getExpenses({
        params: {
          month: monthsMap[selectedMonth],
          year: selectedYear,
          searchBy: searchBy.trim(),
        },
        headers: {Authorization: `Bearer ${token}`},
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
        headers: {Authorization: `Bearer ${token}`},
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
    if (!token) return;

    if (selectedView === 'expenses') {
      fetchExpenses();
    } else {
      fetchStats();
    }
  }, [token, selectedView, selectedMonth, selectedYear]);

  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(() => {
      fetchExpenses();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchBy, token]);

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
  
      if(confirmed && token) {
        await deleteExpense(id, {
          headers: {Authorization: `Bearer ${token}`},
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
      token={token}
      resetInitialValues={resetFormInitialValues}
    /> :
    <>
      <h1 className='text-center text-[var(--d-blue)] font-bold lg:text-3xl text-lg lg:my-10 my-2'>Expense Tracker Dashboard</h1>
      <TopOfPage
        selectedView={selectedView}
        setIsExpenseModalVisible={setIsExpenseModalVisible}
        setSelectedView={setSelectedView}
        isMonthDisabled={isMonthDisabled}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        years={years}
      />
      {
        selectedView === 'stats' ? (
          <StatsSummary
            isLoading={isLoading}
            total_expenses={total_expenses.current}
            total_income={total_income.current}
          />
        ) : (
          <ExpenseSearchBar
            isLoading={isLoading}
            expenses={expenses}
            searchBy={searchBy}
            setSearchBy={setSearchBy}
          />
        )
      }
      <div className={clsx(
        'mx-auto w-[90%] bg-white shadow-[0_0_5px_3px_#d5d5d5] rounded-md border-1 border-[var(--grey)] my-5',
      )}>
      {
        isLoading ? <>
          { selectedView === 'expenses' ? <ExpensesSkeleton/> : <StatisticsSkeleton/> }
        </> : <>
          {
            selectedView === 'expenses' ?
            <>{
              expenses && expenses.length > 0 ? (
                <ExpensesTable
                  expenses={expenses}
                  handleExpenseDelete={handleExpenseDelete}
                  handleExpenseEdit={handleExpenseEdit}
                />
              ) : (
                <p className='text-center p-5 text-[var(--error)] text-xl'>
                  {isLoading ? 'Loading...' : 'No expense found'}
                </p>
              )
            }</> : <>{
              stats && stats.length > 0 ? (
                <StatsTable
                  stats={stats}
                  total_expenses={total_expenses.current}
                  total_income={total_income.current}
                />
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
