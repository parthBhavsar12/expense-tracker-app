import { ExpenseType } from '@/constant';
import mongoose, { Model, Schema } from 'mongoose';

export interface IExpense extends Document {
  date: Date | string;
  expenseType: string;
  amount: number;
  title: string;
  [key: string]: unknown;
};

const ExpenseSchema = new Schema<IExpense>(
  {
    date: { type: Date, required: true },
    expenseType: { type: String, required: true, enum: Object.values(ExpenseType) },
    amount: { type: Number, required: true },
    title: { type: String, required: false },
  },
  { timestamps: true },
);

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
