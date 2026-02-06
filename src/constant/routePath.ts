export type RoutesType = {
  [key in
    | 'DEFAULT'
    | 'LOGIN'
    | 'DASHBOARD']: {
    path: string;
  };
}

export const ROUTES: RoutesType = {
  DEFAULT: {
    path: '/',
  },
  LOGIN: {
    path: '/login',
  },
  DASHBOARD: {
    path: '/dashboard',
  }
} as const;