---
sidebar_position: 4
---

# State Management Explanation

This document explains the state management approach used in the Crypto Price Tracker.

## Zustand State Management

For this project, [Zustand](https://github.com/pmndrs/zustand) is used for state management. Zustand is a small, fast, and scalable state management solution that uses a simple API and doesn't require complex setup like Redux.

### Why Zustand?

There were several options for state management:

1. **React Context API**: While built-in to React, it can lead to unnecessary re-renders and doesn't offer built-in performance optimizations.

2. **Redux**: Powerful but comes with significant boilerplate code and complexity.

3. **React Query**: Excellent for server-state management but less suited for UI state.

4. **Zustand**: Simple, lightweight, and provides a straightforward way to create global state with minimal boilerplate.

The reason behind choosing Zustand is:
- It's simple to implement and understand
- It has minimal boilerplate
- It's highly performant
- It works well with TypeScript
- It allows for selective component re-rendering

### Implementation

Our Zustand store is implemented in `src/store/cryptoStore.ts`:

```typescript
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
```
## Alternative: React Query

While Zustand is used for this project, [React Query](https://react-query.tanstack.com/) would be an excellent alternative, especially if the focus is primarily on data fetching. React Query provides:

- Automatic caching
- Background data refetching
- Easy loading and error states
- Optimistic updates

A React Query implementation would look like:

```tsx
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { fetchCryptocurrencies } from '../services/api';

// In your component:
const { data, isLoading, error, refetch } = useQuery(
  'cryptocurrencies',
  fetchCryptocurrencies,
  {
    refetchInterval: 60000 // Auto-refresh every minute
  }
);

```

## Combining Approaches

For larger applications, you might combine React Query for server state with Zustand for UI state, getting the best of both worlds:

- React Query for data fetching, caching, and server state
- Zustand for UI state, user preferences, and application state