import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth.middleware';
import { cookies } from 'next/headers';
import { CustomError } from '@/utils/CustomError';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      throw new CustomError('Unauthorized', 401);
    }

    const { decodedUser } = await authenticateRequest({
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    } as NextRequest);

    return NextResponse.json({
      success: true,
      email: decodedUser.email,
      token,
    });
  } catch (error: unknown) {
    const status = error instanceof CustomError ? error.statusCode : 500;
    const message = error instanceof CustomError ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status });
  }
}
