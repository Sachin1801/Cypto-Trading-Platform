import { useCryptoStore } from '../store/cryptoStore';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useCryptoStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already real-time, but we could add additional functionality here
  };

  return (
    <form onSubmit={handleSearch} className="mb-4 flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          className="p-2 pl-10 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
}