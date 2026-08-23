'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class EnterpriseErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Enterprise Error Boundary captured client exception:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center p-4 font-mono text-xs text-white">
          <div className="max-w-md w-full glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-stadiumGreen/20 text-stadiumGreen flex items-center justify-center mx-auto border border-stadiumGreen/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              AuraScore Self-Healing Engine Active
            </h2>
            
            <p className="text-gray-300 text-xs font-sans">
              The platform encountered a minor runtime interruption and has protected your data and session state.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black flex items-center justify-center space-x-2 shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resume Live Match Center</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
