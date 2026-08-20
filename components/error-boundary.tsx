'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('⚡ Stadium ErrorBoundary caught an exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl glass-panel border border-crimson/40 text-center space-y-4 my-8 font-mono text-xs max-w-lg mx-auto">
          <div className="p-3 rounded-2xl bg-crimson/20 text-crimson w-fit mx-auto border border-crimson/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-white">System Self-Healing Protection Active</h2>
          <p className="text-gray-300 font-sans">
            A minor display event occurred. AuraScore Stadium has isolated the component to protect your active match tickets.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restore Display</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
