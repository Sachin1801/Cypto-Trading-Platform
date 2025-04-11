import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';
const PER_PAGE = 100; // Increased to 100 coins per page

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h: number;
  price_change_percentage_7d: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
  market_cap_rank: number;
}

const coinGeckoApi = axios.create({
  baseURL: API_URL,
  params: {
    vs_currency: 'usd',
    sparkline: true,
    price_change_percentage: '1h,24h,7d'
  }
});

export const fetchCryptocurrencies = async (page = 1): Promise<Cryptocurrency[]> => {
  try {
    const response = await coinGeckoApi.get('/coins/markets', {
      params: {
        order: 'market_cap_desc',
        per_page: PER_PAGE,
        page,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    throw error;
  }
};

export const fetchTrendingCoins = async (): Promise<Cryptocurrency[]> => {
  try {
    const response = await coinGeckoApi.get('/search/trending');
    const trendingIds = response.data.coins.map((coin: any) => coin.item.id);
    
    // Fetch full data for trending coins
    const trendingData = await coinGeckoApi.get('/coins/markets', {
      params: {
        ids: trendingIds.join(','),
        order: 'market_cap_desc',
        per_page: trendingIds.length,
        page: 1,
      }
    });
    
    return trendingData.data;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

export const fetchDefiCoins = async (): Promise<Cryptocurrency[]> => {
  try {
    const response = await coinGeckoApi.get('/coins/markets', {
      params: {
        category: 'decentralized-finance-defi',
        order: 'market_cap_desc',
        per_page: PER_PAGE,
        page: 1,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching DeFi coins:', error);
    throw error;
  }
};