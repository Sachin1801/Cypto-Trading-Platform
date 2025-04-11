import axios, { AxiosError } from 'axios';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Add retry configuration
const axiosInstance = axios.create({
  baseURL: COINGECKO_API_BASE,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response) {
      // Rate limit error
      if (error.response.status === 429) {
        console.warn('Rate limit reached, waiting before retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return axiosInstance.request(error.config!);
      }
      
      // Handle other API errors
      throw new APIError(
        (error.response.data as any)?.error || `API Error: ${error.response.status} - ${error.response.statusText}`,
        error.response.status
      );
    }
    
    if (error.request) {
      // Network error
      throw new APIError('Network error. Please check your connection and try again.', 0, 'NETWORK_ERROR');
    }
    
    // Unknown error
    throw new APIError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
  }
);

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    price_change_percentage_1h_in_currency: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
    twitter_screen_name: string;
  };
  sparkline_in_7d: {
    price: number[];
  };
}

export interface HistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export async function fetchTopCoins(limit = 100): Promise<Cryptocurrency[]> {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d'
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to fetch top coins', 500);
  }
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  try {
    const response = await axiosInstance.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Failed to fetch details for ${id}`, 500);
  }
}

export async function fetchCoinHistory(
  id: string,
  days: string | number,
  interval?: string
): Promise<HistoricalData> {
  try {
    const response = await axiosInstance.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Failed to fetch history for ${id}`, 500);
  }
}

export const timeframeToParams = {
  '1h': { days: 1, interval: '5m' },
  '24h': { days: 1, interval: 'hourly' },
  '7d': { days: 7, interval: 'hourly' },
  '14d': { days: 14, interval: 'daily' },
  '30d': { days: 30, interval: 'daily' },
  '1y': { days: 365, interval: 'daily' },
};