import { useCryptoStore } from '../store/cryptoStore';

export default function RefreshButton() {
  const { fetchCryptos, isLoading } = useCryptoStore();

  return (
    <button
      onClick={() => fetchCryptos()}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
    >
      {isLoading ? 'Refreshing...' : 'Refresh Prices'}
    </button>
  );
}