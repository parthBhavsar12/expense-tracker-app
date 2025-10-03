import { connectDB } from '@/lib/mongodb';
import { authenticateRequest } from '@/middlewares/auth.middleware';
import Expense from '@/models/expense.model';
import { CustomError } from '@/utils/CustomError';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await authenticateRequest(req);
    
    await connectDB();
    const { searchParams } = new URL(req.url);

    const month = Number(searchParams.get('month'));
    const year = Number(searchParams.get('year'));

    const starting_date = moment(`${year}-${month}-01`).startOf('day').toDate();
    const ending_date = moment(`${month === 12 ? year + 1 : year}-${month === 12 ? '01' : month + 1}-01`).startOf('day').toDate();

    const stats = await Expense.aggregate([
      {
        $match: {
          date: { $gte: starting_date, $lt: ending_date },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: 'Asia/Kolkata' } },
            expenseType: '$expenseType',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$_id.expenseType', 'EXPENSE'] }, '$total', 0],
            },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.expenseType', 'INCOME'] }, '$total', 0],
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          expenses: 1,
          income: 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: unknown) {
    const status = error instanceof CustomError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status });
  }
}
