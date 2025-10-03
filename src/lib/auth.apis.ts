import { getApi, postApi } from '@/lib/axios';

export type LoginRequest = {
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
}

export type GetCookieResponse = {
  success: boolean;
  email: string;
  token: string;
};

export const loginUser = async (data: LoginRequest) => {
  const response = await postApi<LoginResponse, LoginRequest>('/api/login', data);
  return response.data;
};

export const getCookie = async () => {
  const response = await getApi<GetCookieResponse>('/api/cookies');
  return response.data;
};
