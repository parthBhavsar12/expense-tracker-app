'use client';

import { Component, type ReactNode } from 'react';
import ErrorComponent from '@/common/ErrorBoundary/Error';

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  path?: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorInfo: error.message };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent path={this.props.path} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
