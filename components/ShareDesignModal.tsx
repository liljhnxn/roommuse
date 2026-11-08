'use client';

import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Loader2, Wand2, Check } from 'lucide-react';
import { CATEGORIES, CategoryType, CURATED_INSPIRATION_PRESETS } from '@/lib/contract';

interface ShareDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    roomType: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  isConnected: boolean;
  onConnectWallet: () => void;
}

export function ShareDesignModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  isConnected,
  onConnectWallet,
}: ShareDesignModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Living Room');
  const [roomType, setRoomType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (index: number) => {
    const preset = CURATED_INSPIRATION_PRESETS[index];
    setTitle(preset.title);
    setCategory(preset.category);
    setRoomType(preset.roomType);
    setImageUrl(preset.imageUrl);
    setDescription(preset.description);
    setSelectedPresetIndex(index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !roomType.trim() || !category) {
      return;
    }
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      category,
      roomType: roomType.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1E1E1A] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/30 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-light text-[#F5F0E8]">
                Share a Room Design
              </h2>
              <p className="text-xs text-secondaryText">
                Chronicle an architectural space onto Botchain Testnet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-secondaryText hover:text-primaryText hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Curated Preset Inspiration Quick Picker */}
        <div className="mt-5 p-3.5 rounded-xl bg-card border border-white/5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-accent">
              <Wand2 className="w-3.5 h-3.5" />
              Quick Inspiration Presets (Click to autofill)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CURATED_INSPIRATION_PRESETS.map((preset, idx) => {
              const isSelected = selectedPresetIndex === idx;
              return (
                <button
                  type="button"
                  key={preset.title}
                  onClick={() => handleApplyPreset(idx)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/10 text-primaryText'
                      : 'border-white/5 bg-[#151513]/50 text-secondaryText hover:border-white/20 hover:text-primaryText'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    className="w-8 h-8 rounded-md object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] truncate font-medium">{preset.title}</p>
                    <p className="text-[9px] text-accent truncate">{preset.roomType}</p>
                  </div>
                  {isSelected && <Check className="w-3 h-3 text-accent shrink-0 mr-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Publication Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Room Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-secondaryText mb-1.5">
              Room Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Japandi Sunlit Atelier"
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm text-[#F5F0E8] placeholder:text-secondaryText/40 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Category & Room Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-secondaryText mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm text-[#F5F0E8] focus:outline-none focus:border-accent cursor-pointer transition-colors"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-secondaryText mb-1.5">
                Room Type / Style *
              </label>
              <input
                type="text"
                required
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="e.g., Master Suite, Loft Salon, Studio"
                className="w-full px-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm text-[#F5F0E8] placeholder:text-secondaryText/40 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-secondaryText mb-1.5">
              Image URL *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm text-[#F5F0E8] placeholder:text-secondaryText/40 focus:outline-none focus:border-accent transition-colors font-mono text-xs"
              />
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryText" />
            </div>

            {imageUrl && (
              <div className="mt-2.5 relative aspect-[16/9] w-full max-h-36 rounded-xl overflow-hidden border border-white/10 bg-black">
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-secondaryText mb-1.5">
              Editorial Notes & Architectural Nuances
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the materials, lighting philosophy, bespoke joinery, or decorative accents..."
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm text-[#F5F0E8] placeholder:text-secondaryText/40 focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* Submit Button or Connect Wallet Prompt */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-secondaryText hover:text-primaryText hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>

            {!isConnected ? (
              <button
                type="button"
                onClick={onConnectWallet}
                className="px-6 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase bg-accent text-[#151513] hover:bg-accent-hover transition-all shadow-gold"
              >
                Connect Wallet to Publish
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !title || !imageUrl || !roomType}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase bg-accent text-[#151513] hover:bg-accent-hover transition-all shadow-gold hover:shadow-goldGlow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming On-Chain...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish to Botchain</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

