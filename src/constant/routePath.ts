export type RoutesType = {
  [key in
    | 'DEFAULT'
    | 'DASHBOARD']: {
    path: string;
  };
}

export const ROUTES: RoutesType = {
  DEFAULT: {
    path: '/',
  },
  DASHBOARD: {
    path: '/dashboard',
  }
} as const;