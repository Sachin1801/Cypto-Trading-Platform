import { useCryptoStore } from '../store/cryptoStore';
import LoadingIndicator from './LoadingIndicator';
import { useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CryptoTable() {
  const { cryptocurrencies, isLoading, error, fetchCryptos, searchTerm } = useCryptoStore();

  useEffect(() => {
    fetchCryptos();
    const intervalId = setInterval(() => fetchCryptos(), 60000);
    return () => clearInterval(intervalId);
  }, [fetchCryptos]);

  const filteredCryptos = cryptocurrencies.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCryptos = searchTerm ? filteredCryptos : filteredCryptos.slice(0, 5);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (isLoading && cryptocurrencies.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Crypto Price Tracker
        </h1>
        <button
          onClick={() => fetchCryptos()}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {displayCryptos.map((crypto) => (
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
      {isLoading && <div className="mt-4"><LoadingIndicator /></div>}
    </div>
  );
}