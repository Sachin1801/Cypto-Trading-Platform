import { create } from 'zustand';
import { fetchCryptocurrencies, Cryptocurrency } from '../services/api';

interface CryptoState {
  cryptocurrencies: Cryptocurrency[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  fetchCryptos: () => Promise<void>;
  setSearchTerm: (term: string) => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  cryptocurrencies: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  
  fetchCryptos: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const data = await fetchCryptocurrencies();
      set({ cryptocurrencies: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cryptocurrencies', 
        isLoading: false 
      });
    }
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
}));