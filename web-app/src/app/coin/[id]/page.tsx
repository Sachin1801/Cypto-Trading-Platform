'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCoinDetail, fetchCoinHistory, CoinDetail, HistoricalData, timeframeToParams, APIError } from '@/services/api';
import Image from 'next/image';
import { Star, ArrowUpRight, ChevronRight, ExternalLink, Globe, Twitter, ArrowUp, ArrowDown, Clock, DollarSign, TrendingUp } from 'lucide-react';
import SparklineChart from '@/components/SparklineChart';
import Link from 'next/link';

const timeframes = [
  { label: '1h', key: 'price_change_percentage_1h_in_currency' },
  { label: '24h', key: 'price_change_percentage_24h' },
  { label: '7d', key: 'price_change_percentage_7d' },
  { label: '14d', key: 'price_change_percentage_14d' },
  { label: '30d', key: 'price_change_percentage_30d' },
  { label: '1y', key: 'price_change_percentage_1y' }
];

export default function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('24h');
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoinData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [coinData, historyData] = await Promise.all([
          fetchCoinDetail(id as string),
          fetchCoinHistory(
            id as string,
            timeframeToParams[activeTimeframe].days,
            timeframeToParams[activeTimeframe].interval
          )
        ]);
        setCoin(coinData);
        setHistoricalData(historyData);
      } catch (err) {
        console.error('Error loading coin data:', err);
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while loading coin data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCoinData();
  }, [id, activeTimeframe]);

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!id) return;
      try {
        setError(null);
        const data = await fetchCoinHistory(
          id as string,
          timeframeToParams[activeTimeframe].days,
          timeframeToParams[activeTimeframe].interval
        );
        setHistoricalData(data);
      } catch (err) {
        console.error('Error loading historical data:', err);
        if (err instanceof APIError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while loading historical data');
        }
      }
    };

    loadHistoricalData();
  }, [id, activeTimeframe]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !coin || !historicalData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-center">
          <div className="text-lg font-semibold mb-2">Error</div>
          <div>{error || 'Failed to load coin data'}</div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    }
  };

  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const getPercentageChange = () => {
    const timeframeKey = timeframes.find(tf => tf.label === activeTimeframe)?.key;
    if (!timeframeKey) return 0;
    
    if (timeframeKey === 'price_change_percentage_1h_in_currency') {
      return coin.market_data.price_change_percentage_1h_in_currency.usd;
    }
    return coin.market_data[timeframeKey];
  };

  const chartData = historicalData.prices.map(([timestamp, price]) => ({
    time: timestamp / 1000,
    value: price,
  }));

  const percentageChange = getPercentageChange();

  const priceChangeColor = (value: number) => 
    value >= 0 ? 'text-green-500' : 'text-red-500';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">Cryptocurrencies</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{coin.name} Price</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Coin Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12">
                <Image
                  src={coin.image.large}
                  alt={coin.name}
                  fill
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{coin.name}</h1>
                  <span className="text-gray-500 text-lg">{coin.symbol.toUpperCase()}</span>
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="ml-2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  Rank #{coin.market_cap_rank}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatPrice(coin.market_data.current_price.usd)}
              </div>
              <div className="mt-1">
                <div className={`flex items-center space-x-2 ${priceChangeColor(coin.market_data.price_change_percentage_24h)}`}>
                  {coin.market_data.price_change_percentage_24h >= 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                  <span>{Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}% (24h)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.label}
                    onClick={() => setActiveTimeframe(tf.label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTimeframe === tf.label
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px] bg-white rounded-lg">
              <SparklineChart
                data={chartData}
                height={400}
                width={1000}
                color={percentageChange >= 0 ? '#22c55e' : '#ef4444'}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Market Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Market Cap</span>
                <span className="font-medium">{formatLargeNumber(coin.market_data.market_cap.usd)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">24h Volume</span>
                <span className="font-medium">{formatLargeNumber(coin.market_data.total_volume.usd)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Circulating Supply</span>
                <span className="font-medium">
                  {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Total Supply</span>
                <span className="font-medium">
                  {coin.market_data.total_supply?.toLocaleString() || '∞'} {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Max Supply</span>
                <span className="font-medium">
                  {coin.market_data.max_supply?.toLocaleString() || '∞'} {coin.symbol.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Price Changes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Price Change</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">1h</span>
                <span className={priceChangeColor(coin.market_data.price_change_percentage_1h_in_currency.usd)}>
                  {coin.market_data.price_change_percentage_1h_in_currency.usd.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">24h</span>
                <span className={priceChangeColor(coin.market_data.price_change_percentage_24h)}>
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">7d</span>
                <span className={priceChangeColor(coin.market_data.price_change_percentage_7d)}>
                  {coin.market_data.price_change_percentage_7d.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">30d</span>
                <span className={priceChangeColor(coin.market_data.price_change_percentage_30d)}>
                  {coin.market_data.price_change_percentage_30d.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Info</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-500 mb-2">Website</h3>
                <div className="flex flex-wrap gap-2">
                  {coin.links.homepage.filter(Boolean).map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{new URL(url).hostname}</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-500 mb-2">Community</h3>
                <div className="flex flex-wrap gap-4">
                  {coin.links.subreddit_url && (
                    <a
                      href={coin.links.subreddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <span>Reddit</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  {coin.links.twitter_screen_name && (
                    <a
                      href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-gray-500 mb-2">Source Code</h3>
                <div className="flex flex-wrap gap-2">
                  {coin.links.repos_url.github.filter(Boolean).map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">About {coin.name}</h2>
            <div 
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: coin.description.en }}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 