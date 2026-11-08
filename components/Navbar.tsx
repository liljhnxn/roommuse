'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { Wallet, Plus, LogOut, ChevronDown, Sparkles, AlertTriangle } from 'lucide-react';
import { botchainTestnet } from '@/lib/chain';

interface NavbarProps {
  onOpenShareModal: () => void;
  totalDesigns: number;
}

export function Navbar({ onOpenShareModal, totalDesigns }: NavbarProps) {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: balanceData } = useBalance({
    address,
  });

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const shortenAddress = (addr?: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = () => {
    const injectedConnector = connectors.find((c) => c.id === 'injected' || c.name.toLowerCase().includes('metamask')) || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#151513]/85 border-b border-[#24241F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Editorial Tagline */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#D6A86C]" />
              <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.18em] uppercase text-[#F5F0E8]">
                ROOM<span className="font-normal text-accent">MUSE</span>
              </span>
            </div>
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-secondaryText font-sans pl-4.5">
              Spaces Worth Inspiring.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-white/10 text-xs text-secondaryText">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Botchain Testnet
            </span>
            <span className="text-secondaryText/60">•</span>
            <span>{totalDesigns} Curated Spaces</span>
          </div>
        </div>

        {/* Action Controls & Wallet Connection */}
        <div className="flex items-center gap-3">
          {/* Share a Design Button */}
          <button
            onClick={onOpenShareModal}
            className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 bg-accent text-[#151513] hover:bg-accent-hover shadow-gold hover:shadow-goldGlow hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline">Share a Design</span>
            <span className="sm:hidden">Share</span>
          </button>

          {/* Wallet State */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase border border-accent/40 text-accent bg-accent/5 hover:bg-accent/15 hover:border-accent transition-all duration-300"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : isWrongNetwork ? (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-rose-500/20 border border-rose-500/50 text-rose-300 hover:bg-rose-500/30 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Switch to Botchain</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-card border border-white/10 hover:border-accent/40 text-[#F5F0E8] transition-all text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 border border-accent/50 flex items-center justify-center text-[10px] font-mono text-accent">
                  {address?.slice(2, 4).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-xs">{shortenAddress(address)}</span>
                  {balanceData && (
                    <span className="text-[10px] text-secondaryText">
                      {parseFloat(balanceData.formatted).toFixed(3)} {balanceData.symbol}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-secondaryText" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#24241F] border border-white/10 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-white/5 mb-2">
                      <p className="text-[10px] uppercase tracking-wider text-secondaryText">Connected Account</p>
                      <p className="font-mono text-xs text-[#F5F0E8] break-all mt-0.5">{address}</p>
                      <a
                        href={`https://scan.bohr.life/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-accent hover:underline mt-1.5 inline-block"
                      >
                        View on Botchain Explorer ↗
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

