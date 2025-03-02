import { Cryptocurrency } from '@/services/api';
import Image from 'next/image';

interface CryptoCardViewProps {
  coin: Cryptocurrency;
}

export default function CryptoCardView({ coin }: CryptoCardViewProps) {
  const priceChangeClass = coin.price_change_24h >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 mr-3 relative">
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
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500 dark:text-gray-300">Price:</div>
        <div className="text-gray-900 dark:text-white font-medium text-right">
          ${coin.current_price.toLocaleString()}
        </div>
        
        <div className="text-gray-500 dark:text-gray-300">24h Change:</div>
        <div className={`font-medium text-right ${priceChangeClass}`}>
          {coin.price_change_24h >= 0 ? '↑' : '↓'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
        
        <div className="text-gray-500 dark:text-gray-300">24h Volume:</div>
        <div className="text-gray-900 dark:text-white text-right">
          ${coin.total_volume.toLocaleString()}
        </div>
        
        <div className="text-gray-500 dark:text-gray-300">Market Cap:</div>
        <div className="text-gray-900 dark:text-white text-right">
          ${coin.market_cap.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
