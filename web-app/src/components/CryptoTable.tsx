import { useCryptoStore } from '../store/cryptoStore';
import LoadingIndicator from './LoadingIndicator';
import { useEffect } from 'react';

export default function CryptoTable() {
  const { cryptocurrencies, isLoading, error, fetchCryptos, searchTerm } = useCryptoStore();
  
  useEffect(() => {
    fetchCryptos();
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => fetchCryptos(), 60000);
    return () => clearInterval(intervalId);
  }, [fetchCryptos]);

  // Filter cryptocurrencies based on search term
  const filteredCryptos = cryptocurrencies.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display only the top 5 results if no search term
  const displayCryptos = searchTerm ? filteredCryptos : filteredCryptos.slice(0, 5);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (isLoading && cryptocurrencies.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {displayCryptos.map((crypto) => (
            <tr key={crypto.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 mr-2" />
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-gray-500">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${crypto.current_price.toLocaleString()}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${crypto.market_cap.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && <div className="mt-4"><LoadingIndicator /></div>}
    </div>
  );
}