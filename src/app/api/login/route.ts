import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user.model';
import bcrypt from 'bcrypt';
import { connectDB } from '@/lib/mongodb';
import Token from '@/models/token.model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: 'parth.12012004@gmail.com' });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials', user },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    await Token.deleteMany();

    await Token.create({token});

    const response = NextResponse.json({ success: true, token });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
