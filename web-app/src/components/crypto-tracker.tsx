'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export default function CryptoTracker() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCryptos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load crypto data');
        setLoading(false);
      }
    };

    fetchCryptos();
    const interval = setInterval(fetchCryptos, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Crypto Price Tracker
      </h1>
      <div className="grid gap-4">
        {cryptos.map((crypto) => (
          <motion.div
            key={crypto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  {crypto.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 uppercase">
                  {crypto.symbol}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800 dark:text-white">
                ${crypto.current_price.toLocaleString()}
              </p>
              <p
                className={`flex items-center space-x-1 ${
                  crypto.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {crypto.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
