'use client';

import { Cryptocurrency } from '@/services/api';
import Image from 'next/image';

interface CryptoTableRowProps {
  coin: Cryptocurrency;
}

export default function CryptoTableRow({ coin }: CryptoTableRowProps) {
  const priceChangeClass = coin.price_change_24h >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  return (
    <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="col-span-2 p-4 flex items-center">
        <div className="h-8 w-8 mr-3 relative">
          <Image 
            src={coin.image} 
            alt={coin.name} 
            fill
            className="rounded-full object-contain"
          />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{coin.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div className="p-4 flex items-center text-gray-900 dark:text-white">
        ${coin.current_price.toLocaleString()}
      </div>
      <div className="p-4 flex items-center hidden md:flex text-gray-600 dark:text-gray-300">
        ${coin.total_volume.toLocaleString()}
      </div>
      <div className={`p-4 flex items-center ${priceChangeClass}`}>
        {coin.price_change_24h >= 0 ? '↑' : '↓'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
      </div>
      <div className="p-4 hidden md:flex items-center text-gray-600 dark:text-gray-300">
        ${coin.market_cap.toLocaleString()}
      </div>
    </div>
  );
}
