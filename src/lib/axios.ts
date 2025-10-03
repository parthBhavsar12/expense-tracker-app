import axios, { type AxiosRequestConfig } from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getApi = <T>(url: string, config?: AxiosRequestConfig) =>
  axios.get<T>(url, config);

export const postApi = <T, B>(url: string, body: B, config?: AxiosRequestConfig) =>
  axios.post<T>(url, body, {withCredentials: true, ...config});

export const putApi = <T, B>(url: string, body?: B , config?: AxiosRequestConfig) =>
  axios.put<T>(url, body, {...config});

export const deleteApi = <T>(url: string, config?: AxiosRequestConfig) =>
  axios.delete<T>(url, config);
