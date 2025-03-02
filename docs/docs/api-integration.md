---
sidebar_position: 3
---

# API Integration Details

The Crypto Price Tracker uses the CoinGecko API to fetch cryptocurrency data. This document explains how the API integration is implemented.

## CoinGecko API

[CoinGecko](https://www.coingecko.com/en/api/documentation) provides a free API for cryptocurrency data, which is used to fetch current prices, market caps, and 24-hour price changes.

### API Endpoints Used

The main endpoint used in this project is: GET /coins/markets

This endpoint returns a list of cryptocurrencies with market data, including:
- Current price
- 24h price change percentage
- Market cap
- Images and other metadata

### API Service Implementation

The API integration is implemented in the `src/services/api.ts` file:

```typescript
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  try {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    throw error;
  }
};
```

## Error Handling

The API integration includes error handling to manage situations when the API is unavailable or returns errors. Errors are caught and displayed to the user with appropriate messages.

## Data Refresh Strategy

Data is refreshed in two ways:

1. **Automatic Refresh**: Prices are automatically refreshed every 60 seconds to ensure data is current.
2. **Manual Refresh**: Users can manually refresh the data by clicking the "Refresh" button.

This approach ensures that users always have access to up-to-date cryptocurrency prices.