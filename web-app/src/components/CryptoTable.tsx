'use client';

import { useState, useEffect } from 'react';
import { fetchTopCoins, Cryptocurrency } from '@/services/api';
import CryptoTableRow from './CryptoTableRow';
import SearchBar from './SearchBar';
import Navigation from './Navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: '🟢' },
  { id: 'highlights', name: 'Highlights', icon: '📋' },
  { id: 'pump', name: 'Pump.fun', icon: '📈' },
  { id: 'categories', name: 'Categories', icon: '📁' },
  { id: 'terminal', name: 'Terminal of Truths', icon: '🔥' },
  { id: 'polkadot', name: 'Polkadot Ecosystem', icon: '🔥' },
  { id: 'ai', name: 'AI Meme', icon: '🔥' },
  { id: 'pump-eco', name: 'Pump.fun Ecosystem', icon: '🔥' },
  { id: 'customize', name: 'Customise', icon: '⚙️' },
];

export default function CryptoTable() {
  const [coins, setCoins] = useState<Cryptocurrency[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Cryptocurrency[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const rowsPerPage = 100;

  const loadCryptoData = async (category: string = activeCategory, page: number = currentPage) => {
    setIsLoading(true);
    try {
      // For now, we'll just use fetchTopCoins for all categories
      // In the future, we can add more specific API endpoints for different categories
      const data = await fetchTopCoins(rowsPerPage);
      setCoins(data);
      setFilteredCoins(data);
      setTotalResults(data.length); // For now, just show what we have
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData(activeCategory, currentPage);
  }, [activeCategory, currentPage]);

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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const toggleFavorite = (coinId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(coinId)) {
        newFavorites.delete(coinId);
      } else {
        newFavorites.add(coinId);
      }
      return newFavorites;
    });
  };

  const totalPages = Math.ceil(totalResults / rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navigation 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <div className="max-w-[1400px] mx-auto px-4">
        <SearchBar 
          search={search} 
          handleSearch={handleSearch} 
          onRefresh={() => loadCryptoData(activeCategory, currentPage)}
          isLoading={isLoading} 
        />

        {isLoading && !coins.length ? (
          <div className="text-center py-8 text-gray-600">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
            Loading cryptocurrency data...
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="py-3 pl-4 pr-2 text-left w-[50px]">#</th>
                    <th className="px-2 text-left">Coin</th>
                    <th className="px-2 text-right">Price</th>
                    <th className="px-2 text-right">1h</th>
                    <th className="px-2 text-right">24h</th>
                    <th className="px-2 text-right">7d</th>
                    <th className="px-2 text-right">24h Volume</th>
                    <th className="px-2 text-right">Market Cap</th>
                    <th className="px-4 text-center w-[180px]">Last 7 Days</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoins.length > 0 ? (
                    filteredCoins.map((coin) => (
                      <CryptoTableRow 
                        key={coin.id} 
                        coin={coin} 
                        rank={coin.market_cap_rank}
                        isFavorite={favorites.has(coin.id)}
                        onToggleFavorite={() => toggleFavorite(coin.id)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-gray-600">
                        No cryptocurrencies found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between py-4 text-sm text-gray-600">
              <div>
                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalResults)} of {totalResults} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {totalPages > 5 && <span>...</span>}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}