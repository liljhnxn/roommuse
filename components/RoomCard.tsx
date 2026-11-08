'use client';

import React, { useState } from 'react';
import { Heart, Maximize2, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { RoomItem } from '@/lib/contract';

interface RoomCardProps {
  room: RoomItem;
  hasLiked: boolean;
  onLikeToggle: (roomId: bigint, currentlyLiked: boolean) => void;
  onSelect: (room: RoomItem) => void;
  isLiking: boolean;
  currentUserAddress?: string;
}

export function RoomCard({
  room,
  hasLiked,
  onLikeToggle,
  onSelect,
  isLiking,
  currentUserAddress,
}: RoomCardProps) {
  const [imgError, setImgError] = useState(false);
  const isAuthor = currentUserAddress && room.author.toLowerCase() === currentUserAddress.toLowerCase();

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const formatTimestamp = (ts: bigint) => {
    const date = new Date(Number(ts) * 1000);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group relative rounded-2xl bg-card border border-white/5 hover:border-accent/40 transition-all duration-500 overflow-hidden flex flex-col shadow-card hover:shadow-gold hover:-translate-y-1">
      {/* Room Image Container */}
      <div 
        onClick={() => onSelect(room)}
        className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer bg-[#151513]"
      >
        <img
          src={imgError ? fallbackImage : room.imageUrl}
          alt={room.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151513]/90 via-[#151513]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Category & Room Type Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-[#151513]/80 backdrop-blur-md text-accent border border-accent/30">
              {room.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] tracking-wide bg-white/10 backdrop-blur-md text-[#F5F0E8] border border-white/10">
              {room.roomType}
            </span>
          </div>

          {isAuthor && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-accent/20 border border-accent/40 text-accent backdrop-blur-md">
              Author
            </span>
          )}
        </div>

        {/* Quick View Icon Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-[#151513]/90 text-accent border border-accent/40 text-xs tracking-wider uppercase font-medium flex items-center gap-2 shadow-xl backdrop-blur-md">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>View Architecture</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-secondaryText/90 font-mono pointer-events-none">
          <Clock className="w-3 h-3 text-accent/80" />
          <span>{formatTimestamp(room.timestamp)}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Room Title */}
          <h3 
            onClick={() => onSelect(room)}
            className="font-serif text-lg font-light text-[#F5F0E8] group-hover:text-accent transition-colors line-clamp-1 cursor-pointer"
          >
            {room.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-secondaryText font-light line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Card Footer: Author & Like Button */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          {/* Author */}
          <a
            href={`https://scan.bohr.life/address/${room.author}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/author inline-flex items-center gap-2 text-xs text-secondaryText hover:text-accent transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-[9px] font-mono text-accent">
              {room.author.slice(2, 4).toUpperCase()}
            </div>
            <span className="font-mono text-[11px]">{shortenAddress(room.author)}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/author:opacity-100 transition-opacity text-accent" />
          </a>

          {/* Like / Unlike Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(room.id, hasLiked);
            }}
            disabled={isLiking}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 ${
              hasLiked
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-sm'
                : 'bg-white/5 border border-white/10 text-secondaryText hover:text-accent hover:border-accent/40 hover:bg-accent/5'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform ${
                hasLiked ? 'fill-rose-400 text-rose-400 scale-110' : ''
              } ${isLiking ? 'animate-pulse' : ''}`}
            />
            <span className="font-medium">{room.likes.toString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

