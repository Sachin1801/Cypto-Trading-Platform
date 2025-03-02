'use client';

import { Suspense } from 'react';
import CryptoTable from '../components/CryptoTable';
import SearchBar from '../components/SearchBar';
import RefreshButton from '../components/RefreshButton';
import LoadingIndicator from '../components/LoadingIndicator';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Crypto Price Tracker</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <SearchBar />
        </div>
        <div>
          <RefreshButton />
        </div>
      </div>
      
      <Suspense fallback={<LoadingIndicator />}>
        <CryptoTable />
      </Suspense>
    </main>
  );
}