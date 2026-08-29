'use client';

import { useEffect, useRef } from 'react';

/**
 * Universal Mobile Back Button & History Interceptor
 * Prevents the browser / phone from exiting the web app when a user presses the back button with a modal or drawer open.
 */
export function useModalBackHandler(isOpen: boolean, onClose: () => void) {
  const hasPushedState = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      // Push state into history when modal opens
      window.history.pushState({ modalOpen: true, timestamp: Date.now() }, '');
      hasPushedState.current = true;

      const handlePopState = (event: PopStateEvent) => {
        if (hasPushedState.current) {
          hasPushedState.current = false;
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        // If modal was closed via button (not back gesture), go back 1 state to keep history clean
        if (hasPushedState.current && window.history.state?.modalOpen) {
          hasPushedState.current = false;
          window.history.back();
        }
      };
    }
  }, [isOpen, onClose]);
}
