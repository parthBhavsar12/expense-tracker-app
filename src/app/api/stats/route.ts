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

    let starting_date: moment.Moment;
    let ending_date: moment.Moment;

    if (month === 0) {
      starting_date = moment(`${year}-01-01`);
      ending_date = moment(`${year + 1}-01-01`);
    } else {
      starting_date = moment(`${year}-${month}-01`);
      ending_date = moment(starting_date).add(1, 'month');
    }

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
