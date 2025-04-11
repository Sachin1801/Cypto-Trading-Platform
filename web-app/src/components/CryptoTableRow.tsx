'use client';

import { Cryptocurrency } from '@/services/api';
import Image from 'next/image';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface CryptoTableRowProps {
  coin: Cryptocurrency;
  rank: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CryptoTableRow({ coin, rank, isFavorite, onToggleFavorite }: CryptoTableRowProps) {
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return null;
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <span className="text-[10px] mr-0.5">{isPositive ? '▲' : '▼'}</span>
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      return price.toFixed(6);
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
      <td className="py-4 pl-4 pr-2">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleFavorite}
            className="opacity-50 hover:opacity-100 transition-opacity"
            aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
            title={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
          >
            <Star 
              className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
          <Link href={`/coin/${coin.id}`} className="flex items-center space-x-3">
            <span className="text-gray-500 tabular-nums">{rank}</span>
          </Link>
        </div>
      </td>
      
      <td className="px-2 py-4">
        <div className="flex items-center">
          <div className="h-8 w-8 relative mr-3 flex-shrink-0">
            <Link href={`/coin/${coin.id}`} className="block h-full w-full">
              <Image 
                src={coin.image} 
                alt={coin.name} 
                fill
                sizes="(max-width: 32px) 100vw, 32px"
                className="rounded-full object-cover"
                priority={rank <= 10}
              />
            </Link>
          </div>
          <div className="flex flex-col min-w-[140px]">
            <Link href={`/coin/${coin.id}`} className="font-medium text-gray-900 hover:text-blue-600">
              {coin.name}
            </Link>
            <div className="text-gray-500 text-xs">{coin.symbol.toUpperCase()}</div>
          </div>
          <button 
            className="ml-4 px-3 py-1 text-xs bg-[#edfcf2] text-[#16a34a] rounded hover:bg-[#d1f7df] transition-colors"
            aria-label={`Buy ${coin.name}`}
          >
            Buy
          </button>
        </div>
      </td>

      <td className="px-2 py-4 text-right">
        <span className="font-medium tabular-nums">
          ${formatPrice(coin.current_price)}
        </span>
      </td>

      <td className="px-2 py-4">{formatPercentage(coin.price_change_percentage_1h)}</td>
      <td className="px-2 py-4">{formatPercentage(coin.price_change_percentage_24h)}</td>
      <td className="px-2 py-4">{formatPercentage(coin.price_change_percentage_7d)}</td>

      <td className="px-2 py-4 text-right">
        <span className="text-gray-600 tabular-nums">
          ${coin.total_volume.toLocaleString()}
        </span>
      </td>

      <td className="px-2 py-4 text-right">
        <span className="text-gray-600 tabular-nums">
          ${coin.market_cap.toLocaleString()}
        </span>
      </td>

      <td className="px-4 py-4">
        <div className="w-[164px] h-[40px] flex items-center justify-center mx-auto">
          {typeof coin.price_change_percentage_7d === 'number' ? (
            coin.price_change_percentage_7d >= 0 ? (
              <div className="flex items-center text-green-500">
                <TrendingUp className="w-6 h-6 mr-2" />
                <span>+{coin.price_change_percentage_7d.toFixed(2)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <TrendingDown className="w-6 h-6 mr-2" />
                <span>{coin.price_change_percentage_7d.toFixed(2)}%</span>
              </div>
            )
          ) : (
            <div className="flex items-center text-gray-400">
              <span>N/A</span>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
