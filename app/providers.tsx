'use client';

import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { useEffect, useState } from 'react';

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ClientOnly>
        {children}
      </ClientOnly>
    </Provider>
  );
}
