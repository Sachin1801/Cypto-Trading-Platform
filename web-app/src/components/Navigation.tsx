'use client';

import { useState } from 'react';
import { Star, TrendingUp, Wallet, Zap, Settings } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

const categories: Category[] = [
  { id: 'all', name: 'All', icon: <Star className="w-4 h-4 text-green-500" /> },
  { id: 'highlights', name: 'Highlights', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'pump', name: 'Pump.fun', icon: <Zap className="w-4 h-4" /> },
  { id: 'defi', name: 'DeFi', icon: <Wallet className="w-4 h-4" /> },
  { id: 'terminal', name: 'Terminal of Truths', icon: <Zap className="w-4 h-4 text-orange-500" /> },
  { id: 'polkadot', name: 'Polkadot Ecosystem', icon: <Zap className="w-4 h-4 text-orange-500" /> },
  { id: 'ai', name: 'AI Meme', icon: <Zap className="w-4 h-4 text-orange-500" /> },
  { id: 'pump-eco', name: 'Pump.fun Ecosystem', icon: <Zap className="w-4 h-4 text-orange-500" /> },
  { id: 'customize', name: 'Customise', icon: <Settings className="w-4 h-4" /> },
];

interface NavigationProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function Navigation({ activeCategory, onCategoryChange }: NavigationProps) {
  return (
    <nav className="bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap
                transition-colors text-sm font-medium
                ${activeCategory === category.id 
                  ? 'bg-[#edfcf2] text-[#16a34a]' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'}
              `}
            >
              {category.icon}
              <span>{category.name}</span>
              {category.count && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
} 