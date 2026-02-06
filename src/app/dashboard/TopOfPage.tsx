import Button from '@/common/Button';
import { RiAddLargeLine } from 'react-icons/ri';
import clsx from 'clsx';
import { IoStatsChartSharp } from 'react-icons/io5';
import { GiExpense } from 'react-icons/gi';
import { Month } from '@/app/dashboard/page';

const TopOfPage = ({
  selectedView,
  selectedMonth,
  selectedYear,
  years,
  isMonthDisabled,
  setIsExpenseModalVisible,
  setSelectedView,
  setSelectedMonth,
  setSelectedYear,
}: {
  selectedView: 'stats' | 'expenses';
  selectedMonth: Month;
  selectedYear: number;
  years: number[];
  isMonthDisabled: (month: string) => boolean;
  setIsExpenseModalVisible: (value: boolean) => void;
  setSelectedView: (value: 'stats' | 'expenses') => void;
  setSelectedMonth: (value: Month) => void;
  setSelectedYear: (value: number) => void;
}) => {
  return (
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
  );
};

export default TopOfPage;