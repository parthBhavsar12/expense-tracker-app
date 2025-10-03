import { NextRequest } from 'next/server';
import jwt, { JwtPayload, JsonWebTokenError } from 'jsonwebtoken';
import Token from '@/models/token.model';
import { connectDB } from '@/lib/mongodb';
import { CustomError } from '@/utils/CustomError';

export async function authenticateRequest(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      throw new CustomError('Missing or invalid authorization header', 401);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new CustomError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const dbToken = await Token.findOne({ token });

    if (!dbToken) {
      throw new CustomError('Invalid token', 401);
    }

    return { decodedUser: decoded };
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw new CustomError(err.message || 'Invalid or expired token', 401);
    }
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError('Internal server error', 500);
  }
}
