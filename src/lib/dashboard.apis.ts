import { deleteApi, getApi, postApi, putApi } from '@/lib/axios';
import { IExpense } from '@/models/expense.model';
import { ExpenseForm } from '@/schemas/newExpense.schema';
import { AxiosRequestConfig } from 'axios';

export type GetExpensesResponse = {
  success: boolean;
  expenses: IExpense[];
};

export type NewExpenseResponse = {
  success: boolean;
  expense: IExpense;
};

export type Statistic = {
  date: Date | string;
  expenses: number;
  income: number;
};

export type GetStatsResponse = {
  success: boolean;
  stats: Statistic[];
};

export type ActionExpenseResponse = {
  success: boolean;
  message: string;
};

export const getExpenses = async (config: AxiosRequestConfig) => {
  const response = await getApi<GetExpensesResponse>('/api/expenses', config);
  return response.data;
};

export const editExpense = async (id: string, data: ExpenseForm, config: AxiosRequestConfig) => {
  const response = await putApi<ActionExpenseResponse, ExpenseForm>(`/api/expenses/${id}`, data, config);
  return response.data;
};

export const deleteExpense = async (id: string, config: AxiosRequestConfig) => {
  const response = await deleteApi<ActionExpenseResponse>(`/api/expenses/${id}`, config);
  return response.data;
};

export const newExpense = async (data: ExpenseForm, config: AxiosRequestConfig) => {
  const response = await postApi<NewExpenseResponse, ExpenseForm>('/api/expenses', data, config);
  return response.data;
};

export const getStats = async (config: AxiosRequestConfig) => {
  const response = await getApi<GetStatsResponse>('/api/stats', config);
  return response.data;
};