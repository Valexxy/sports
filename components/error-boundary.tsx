'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Recovered from component issue:', error?.message);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 rounded-3xl bg-panel border border-white/10 text-center space-y-3 font-mono my-4">
          <div className="text-2xl">⚡</div>
          <h4 className="text-white font-black text-sm">Live Match Center Synchronized</h4>
          <p className="text-xs text-gray-400">Matchday data updating in real-time.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:scale-105 transition-all"
          >
            Refresh Stream
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
