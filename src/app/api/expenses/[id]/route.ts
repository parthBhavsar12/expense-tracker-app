/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from '@/lib/mongodb';
import { authenticateRequest } from '@/middlewares/auth.middleware';
import Expense from '@/models/expense.model';
import { CustomError } from '@/utils/CustomError';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, context: any ) {
  try {
    await authenticateRequest(req);
  
    await connectDB();
    
    const { id } = context.params;

    const body = await req.json();
    const { expenseType, amount, title, date } = body;

    await Expense.updateOne({
      _id: id,
    }, {
      expenseType,
      amount,
      title,
      date: moment(date).add(330, 'minutes').toDate(),
    });
    
    return NextResponse.json({
      success: true,
      message: `Expense edited with id ${id} successfully`,
    });
  } catch (error: unknown) {
    const status = error instanceof CustomError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    await authenticateRequest(req);
  
    await connectDB();
    
    const { id } = context.params;

    await Expense.deleteOne({
      _id: id,
    });
    
    return NextResponse.json({
      success: true,
      message: `Expense deleted with id ${id} successfully`,
    });
  } catch (error: unknown) {
    const status = error instanceof CustomError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status });
  }
}
