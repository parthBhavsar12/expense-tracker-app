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
    const searchBy = searchParams.get('searchBy');

    let starting_date: moment.Moment;
    let ending_date: moment.Moment;

    if (month === 0) {
      starting_date = moment(`${year}-01-01`);
      ending_date = moment(`${year + 1}-01-01`);
    } else {
      starting_date = moment(`${year}-${month}-01`);
      ending_date = moment(starting_date).add(1, 'month');
    }

    const expenses = await Expense.find({
      date: {
        $gte: starting_date,
        $lt: ending_date,
      },
      ...(searchBy && { title: { $regex: searchBy, $options: 'i' } })
    }).sort({ date: -1, expenseType: 1 });

    return NextResponse.json({
      success: true,
      expenses,
    });
  } catch (error: unknown) {
    const status = error instanceof CustomError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await authenticateRequest(req);
    
    await connectDB();
    
    const body = await req.json();
    const { expenseType, amount, title, date } = body;

    if(!(expenseType && amount && title && date)) {
      throw new CustomError('No expense data supplied');
    }

    await Expense.create({
      expenseType,
      amount,
      title,
      date: moment(date).add(330, 'minutes').toDate(),
    });

    return NextResponse.json({
      success: true,
      message: 'New expense added successfully',
    });
  } catch (error: unknown) {
    const status = error instanceof CustomError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status });
  }
}
