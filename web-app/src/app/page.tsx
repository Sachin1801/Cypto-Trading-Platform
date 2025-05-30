'use client';

import CryptoTable from '@/components/CryptoTable';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <CryptoTable />
    </main>
  );
}