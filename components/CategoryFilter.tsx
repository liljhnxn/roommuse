'use client';

import React from 'react';
import { Search, Sparkles, User, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, CategoryType } from '@/lib/contract';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: 'explore' | 'my-designs';
  onTabChange: (tab: 'explore' | 'my-designs') => void;
  sortBy: 'latest' | 'likes';
  onSortChange: (sort: 'latest' | 'likes') => void;
  myDesignsCount: number;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  myDesignsCount,
}: CategoryFilterProps) {
  return (
    <div className="space-y-6 mb-10">
      {/* Top Bar: Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Navigation Tabs: Explore Spaces vs My Designs */}
        <div className="inline-flex p-1 rounded-full bg-card border border-white/5 self-start">
          <button
            onClick={() => onTabChange('explore')}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
              activeTab === 'explore'
                ? 'bg-accent text-[#151513] shadow-gold'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Spaces</span>
          </button>

          <button
            onClick={() => onTabChange('my-designs')}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
              activeTab === 'my-designs'
                ? 'bg-accent text-[#151513] shadow-gold'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Designs ({myDesignsCount})</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryText" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search style, room type..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-card border border-white/10 text-xs text-primaryText placeholder:text-secondaryText/60 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'latest' | 'likes')}
              className="appearance-none pl-8 pr-8 py-2 rounded-full bg-card border border-white/10 text-xs text-primaryText focus:outline-none focus:border-accent cursor-pointer transition-colors"
            >
              <option value="latest">Latest First</option>
              <option value="likes">Most Inspiring</option>
            </select>
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondaryText pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                isSelected
                  ? 'bg-white/15 text-accent border border-accent/40 shadow-sm'
                  : 'bg-card/60 text-secondaryText border border-white/5 hover:border-white/20 hover:text-primaryText'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

