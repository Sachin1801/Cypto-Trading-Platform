'use client';

import { useState, useEffect } from 'react';
import { fetchCryptocurrencies, Cryptocurrency } from '@/services/api';
import CryptoTableRow from './CryptoTableRow';
import SearchBar from './SearchBar';
import CryptoCardView from './CryptoCardView';

export default function CryptoTable() {
  const [coins, setCoins] = useState<Cryptocurrency[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Cryptocurrency[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadCryptoData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCryptocurrencies();
      const topFiveCoins = data.slice(0, 5);
      setCoins(topFiveCoins);
      setFilteredCoins(topFiveCoins);
      // setCoins(data);
      // setFilteredCoins(data);
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
  }, []);

  useEffect(() => {
    const filtered = coins.filter(coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCoins(filtered);
  }, [search, coins]);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800 dark:text-white">
        Cryptocurrency Price Tracker
      </h1>
      <SearchBar 
        search={search} 
        handleSearch={handleSearch} 
        onRefresh={loadCryptoData}
        isLoading={isLoading} 
      />

      {isLoading ? (
        <div className="text-center py-6 sm:py-10 text-gray-600 dark:text-gray-300">
          <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          Loading cryptocurrency data...
        </div>
      ) : (
        <>
          {/* Desktop table view - hidden on mobile */}
          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-6 bg-gray-100 dark:bg-gray-700 font-medium text-sm text-gray-500 dark:text-gray-300">
              <div className="col-span-2 p-4">Name</div>
              <div className="p-4">Price</div>
              <div className="p-4 hidden md:block">24h Volume</div>
              <div className="p-4">24h Change</div>
              <div className="p-4 hidden md:block">Market Cap</div>
            </div>

            {filteredCoins.length > 0 ? (
              filteredCoins.map((coin) => (
                <CryptoTableRow key={coin.id} coin={coin} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-600 dark:text-gray-300">
                No cryptocurrencies found matching your search.
              </div>
            )}
          </div>

          {/* Mobile card view - shown only on small screens */}
          <div className="sm:hidden">
            {filteredCoins.length > 0 ? (
              <div className="space-y-4">
                {filteredCoins.map((coin) => (
                  <CryptoCardView key={coin.id} coin={coin} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-600 dark:text-gray-300">
                No cryptocurrencies found matching your search.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}