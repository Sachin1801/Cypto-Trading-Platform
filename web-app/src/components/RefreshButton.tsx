import { RefreshCw } from 'lucide-react';
import useCryptoStore from '../store/cryptoStore';

export default function RefreshButton() {
  const { fetchCoins, isLoading } = useCryptoStore();

  return (
    <button
      onClick={() => fetchCoins()}
      disabled={isLoading}
      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
    </button>
  );
}