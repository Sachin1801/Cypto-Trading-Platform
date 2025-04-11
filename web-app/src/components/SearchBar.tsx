'use client';

import { Search, RotateCw } from 'lucide-react';

interface SearchBarProps {
  search: string;
  handleSearch: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function SearchBar({ search, handleSearch, onRefresh, isLoading }: SearchBarProps) {
  return (
    <div className="flex items-center space-x-3 py-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by name or symbol..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg
            text-sm placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-full 
          hover:bg-gray-100 transition-colors disabled:opacity-50"
        title="Refresh data"
      >
        <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}