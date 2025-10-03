import * as Yup from 'yup';

const newExpenseValidationSchema = Yup.object().shape({
  date: Yup.date()
    .typeError('Date must be valid date')
    .min(new Date('2025-01-01'), 'Date must be from 2025 or beyond')
    .max(new Date(), 'Date cannot be from future')
    .required('Date is required'),

  title: Yup.string()
    .trim()
    .required('Title is required'),

  amount: Yup.number()
    .typeError('Amount must be a number')
    .min(1, 'Amount must be greater than 0')
    .required('Expense type is required'),

  expenseType: Yup.string()
    .required('Expense type is required'),
});

export type ExpenseForm = Yup.InferType<typeof newExpenseValidationSchema>;

export default newExpenseValidationSchema;