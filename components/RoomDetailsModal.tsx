'use client';

import React, { useState } from 'react';
import { X, Heart, Trash2, ExternalLink, Calendar, User, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { RoomItem } from '@/lib/contract';

interface RoomDetailsModalProps {
  room: RoomItem | null;
  onClose: () => void;
  hasLiked: boolean;
  onLikeToggle: (roomId: bigint, currentlyLiked: boolean) => void;
  onRemoveRoom: (roomId: bigint) => void;
  currentUserAddress?: string;
  isLiking: boolean;
  isRemoving: boolean;
}

export function RoomDetailsModal({
  room,
  onClose,
  hasLiked,
  onLikeToggle,
  onRemoveRoom,
  currentUserAddress,
  isLiking,
  isRemoving,
}: RoomDetailsModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!room) return null;

  const isAuthor = currentUserAddress && room.author.toLowerCase() === currentUserAddress.toLowerCase();

  const formattedDate = new Date(Number(room.timestamp) * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fallbackImage = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#1E1E1A] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#151513]/80 border border-white/10 text-secondaryText hover:text-primaryText hover:bg-[#151513] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Column */}
        <div className="md:w-1/2 relative min-h-[300px] md:min-h-[500px] bg-black">
          <img
            src={imgError ? fallbackImage : room.imageUrl}
            alt={room.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1A] via-transparent to-transparent md:hidden" />

          {/* Floating Category Pill */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#151513]/90 text-accent border border-accent/40 backdrop-blur-md">
              {room.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs tracking-wide bg-black/70 text-[#F5F0E8] border border-white/10 backdrop-blur-md">
              {room.roomType}
            </span>
          </div>
        </div>

        {/* Details & Editorial Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-center gap-2 text-xs text-secondaryText font-mono mb-3">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Published {formattedDate}</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F5F0E8] leading-tight mb-4">
              {room.title}
            </h2>

            {/* Architectural & Decor Notes */}
            <div className="space-y-3 mb-6">
              <p className="text-[11px] font-mono uppercase tracking-widest text-accent">
                Architectural & Styling Notes
              </p>
              <p className="text-sm text-secondaryText leading-relaxed font-light whitespace-pre-wrap">
                {room.description}
              </p>
            </div>

            {/* Author Profile Card */}
            <div className="p-4 rounded-xl bg-card border border-white/5 space-y-2 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-secondaryText">Curator / Author</span>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-xs font-mono text-accent shrink-0">
                    {room.author.slice(2, 4).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[#F5F0E8] truncate">
                      {room.author}
                    </p>
                    <p className="text-[10px] text-secondaryText">Botchain Verified Creator</p>
                  </div>
                </div>

                <a
                  href={`https://scan.bohr.life/address/${room.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-accent transition-colors"
                  title="View on Botchain Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Action Row: Like & Delete (if author) */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              {/* Like Button */}
              <button
                onClick={() => onLikeToggle(room.id, hasLiked)}
                disabled={isLiking}
                className={`flex-1 inline-flex items-center justify-center gap-2.5 py-3 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                  hasLiked
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-sm'
                    : 'bg-accent text-[#151513] hover:bg-accent-hover shadow-gold hover:shadow-goldGlow'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasLiked ? 'fill-rose-400 text-rose-400' : 'text-[#151513]'
                  } ${isLiking ? 'animate-pulse' : ''}`}
                />
                <span>
                  {hasLiked ? 'Liked Space' : 'Inspire Me'} ({room.likes.toString()})
                </span>
              </button>

              {/* Author Delete Button */}
              {isAuthor && !confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all"
                  title="Remove submission"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Confirm Removal State */}
            {isAuthor && confirmDelete && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-xs font-medium mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Remove this room design from Botchain?</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemoveRoom(room.id)}
                    disabled={isRemoving}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {isRemoving ? 'Removing on-chain...' : 'Confirm Remove'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

