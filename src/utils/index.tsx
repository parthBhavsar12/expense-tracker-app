// Axios Error

import { AxiosError } from 'axios';

export const  getAxiosErrorMessage = (error: unknown) => {
  if(error instanceof AxiosError) {
    return error.response?.data.message || 'An error occurred';
  }
  return 'Something went wrong. Please try again!';
};

////////////////////////////////////////////////////////////////////////////

// Sweet alert

import alert from 'sweetalert2';

export const isConfirmed = async (
  title: string,
  text: string,
  confirmButtonText: string,
  cancelButtonText: string,
): Promise<boolean> => {
  const result = await alert.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: '#004585',
    cancelButtonColor: '#d33',
  });
  return result.isConfirmed;
};

////////////////////////////////////////////////////////////////

// JWT

import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) for a user.
 * 
 * - Embeds the given `data` as the payload.
 * - Signs the token using the application's secret key.
 * - Supports expiration in seconds (number).
 *
 * @param {object} data - Payload to include in the token.
 * @param {number} expiresIn - Expiration time in seconds (e.g., `3600`).
 * 
 * @returns {string} The signed JWT.
 * 
 * @example
 * const token = generateToken({ user_id: 'abc123' }, '3600');
 */
export const generateToken = (data: object, expiresIn: number): string => {
  return jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn });
};

/**
 * Verifies and decodes a JWT.
 * 
 * - Uses the secret key to validate the token.
 * - Returns the decoded payload if valid.
 * 
 * @param {string} token - JWT to verify.
 * 
 * @returns {string | JwtPayload} Decoded token payload.
 * 
 * @throws {JsonWebTokenError | TokenExpiredError} If the token is invalid or expired.
 * 
 * @example
 * const payload = verifyToken(token);
 */
export const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
