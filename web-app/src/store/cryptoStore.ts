import { fetchTopCoins, Cryptocurrency } from '../services/api';
import { create } from 'zustand';

interface CryptoStore {
  coins: Cryptocurrency[];
  isLoading: boolean;
  error: string | null;
  fetchCoins: () => Promise<void>;
}

const useCryptoStore = create<CryptoStore>((set) => ({
  coins: [],
  isLoading: false,
  error: null,
  fetchCoins: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchTopCoins();
      set({ coins: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cryptocurrency data', 
        isLoading: false 
      });
    }
  },
}));

export default useCryptoStore;