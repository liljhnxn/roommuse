'use client';

import React from 'react';
import { Compass, Sparkles, Heart, Layers, ArrowDown } from 'lucide-react';

interface HeroProps {
  totalDesigns: number;
  totalLikes: number;
  onExploreClick: () => void;
  onShareClick: () => void;
}

export function Hero({ totalDesigns, totalLikes, onExploreClick, onShareClick }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-white/5">
      {/* Subtle architectural ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 w-[300px] h-[300px] bg-[#2E281F]/40 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Issue / Edition Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-sm mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-accent">
            Curated Living • Botchain Issue No. 01
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#F5F0E8] leading-[1.08] max-w-4xl mx-auto">
          Create Spaces <br className="hidden sm:inline" />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F5F0E8] via-[#E4C294] to-accent">
            That Tell Stories.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-secondaryText max-w-2xl mx-auto font-sans font-light leading-relaxed">
          A decentralized sanctuary for architects, interior decorators, and visionaries. 
          Discover rare sanctuaries, chronicle timeless interior narratives, and inspire the next wave of living.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onShareClick}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-[0.15em] uppercase bg-accent text-[#151513] hover:bg-accent-hover transition-all duration-300 shadow-gold hover:shadow-goldGlow hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Room Design</span>
          </button>

          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-[0.15em] uppercase border border-white/15 text-[#F5F0E8] bg-white/[0.03] hover:bg-white/[0.08] hover:border-accent/40 transition-all duration-300"
          >
            <Compass className="w-4 h-4 text-accent" />
            <span>Explore Collection</span>
            <ArrowDown className="w-3.5 h-3.5 text-secondaryText" />
          </button>
        </div>

        {/* Live Counters */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 max-w-3xl mx-auto gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-card/70 border border-white/5 backdrop-blur-md hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-center gap-2 text-accent mb-2">
              <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-secondaryText">Total Spaces</span>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-light text-[#F5F0E8]">
              {totalDesigns}
            </div>
            <p className="mt-1 text-[11px] text-secondaryText/80">Active On-Chain Designs</p>
          </div>

          <div className="p-5 rounded-2xl bg-card/70 border border-white/5 backdrop-blur-md hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-center gap-2 text-accent mb-2">
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-secondaryText">Inspirations</span>
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-light text-[#F5F0E8]">
              {totalLikes}
            </div>
            <p className="mt-1 text-[11px] text-secondaryText/80">Community Endorsements</p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-card/70 border border-white/5 backdrop-blur-md hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-center gap-2 text-accent mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-secondaryText">Blockchain</span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-light text-[#F5F0E8]">
              Botchain 968
            </div>
            <p className="mt-1 text-[11px] text-secondaryText/80">Decentralized & Immutable</p>
          </div>
        </div>
      </div>
    </section>
  );
}

