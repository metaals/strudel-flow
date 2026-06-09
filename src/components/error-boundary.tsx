import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SF] Error boundary caught:', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-sm text-destructive">
          <p className="font-medium">Something went wrong</p>
          <p className="text-xs text-muted-foreground max-w-48 truncate">
            {this.state.error?.message}
          </p>
          <button
            onClick={this.reset}
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
          >
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
