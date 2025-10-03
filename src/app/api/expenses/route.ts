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


    const starting_date = moment(`${year}-${month}-01`);
    const ending_date = moment(`${month === 12 ? year + 1 : year}-${month === 12 ? '01' :month+1}-01`);

    const expenses = await Expense.find({
      date: {
        $gte: starting_date,
        $lt: ending_date,
      }
    }).sort({ date: -1 });

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
