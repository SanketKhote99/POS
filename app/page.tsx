'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Loading from './loading';

// Dynamically import the App component with SSR disabled
const App = dynamic(() => import('../src/App'), { 
  ssr: false,
  loading: () => <Loading />
});

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  );
}
