import type { PropsWithChildren } from 'react';
import ErrorBoundary from '@/common/ErrorBoundary';
import { ROUTES } from '@/constant/routePath';

const Layout = ({ children }: PropsWithChildren) => (
  <ErrorBoundary path={ROUTES.DEFAULT.path}>
    <div>
      {children}
    </div>
  </ErrorBoundary>
);

export default Layout;