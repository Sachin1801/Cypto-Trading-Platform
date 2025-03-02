import { useCryptoStore } from '../store/cryptoStore';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useCryptoStore();

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        className="p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}