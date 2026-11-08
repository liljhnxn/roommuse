'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useConnect } from 'wagmi';
import { ROOM_MUSE_ABI_CONST, ROOM_MUSE_CONTRACT_ADDRESS, RoomItem, CategoryType } from '@/lib/contract';
import { botchainTestnet } from '@/lib/chain';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { RoomCard } from '@/components/RoomCard';
import { RoomDetailsModal } from '@/components/RoomDetailsModal';
import { ShareDesignModal } from '@/components/ShareDesignModal';
import { NotificationToast, ToastMessage } from '@/components/NotificationToast';
import { Sparkles, Compass, Layers, ExternalLink, RefreshCw, AlertCircle, Heart } from 'lucide-react';

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);

  // Filters and views
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'my-designs'>('explore');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pending actions state
  const [pendingLikeId, setPendingLikeId] = useState<bigint | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<bigint | null>(null);

  // Explore section ref for smooth scroll
  const exploreRef = useRef<HTMLDivElement>(null);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    if (toast.type !== 'loading') {
      setTimeout(() => {
        dismissToast(id);
      }, 6000);
    }
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Wagmi Read Contracts
  const {
    data: allRoomsData,
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
    isRefetching: isRefetchingRooms,
  } = useReadContract({
    address: ROOM_MUSE_CONTRACT_ADDRESS,
    abi: ROOM_MUSE_ABI_CONST,
    functionName: 'getAllRooms',
    chainId: botchainTestnet.id,
  });

  const {
    data: platformStatsData,
    refetch: refetchStats,
  } = useReadContract({
    address: ROOM_MUSE_CONTRACT_ADDRESS,
    abi: ROOM_MUSE_ABI_CONST,
    functionName: 'getPlatformStats',
    chainId: botchainTestnet.id,
  });

  // Track liked status locally for fast UX feedback while verifying with contract
  const [likedRoomsMap, setLikedRoomsMap] = useState<Record<string, boolean>>({});

  // Wagmi Write Contract
  const { writeContractAsync } = useWriteContract();

  // Extract rooms list
  const rooms: RoomItem[] = useMemo(() => {
    if (!allRoomsData || !Array.isArray(allRoomsData)) return [];
    return (allRoomsData as RoomItem[]).filter((r) => r.exists);
  }, [allRoomsData]);

  // Extract Platform Stats
  const totalDesigns = useMemo(() => {
    if (platformStatsData && Array.isArray(platformStatsData)) {
      return Number(platformStatsData[0]);
    }
    return rooms.length;
  }, [platformStatsData, rooms]);

  const totalLikes = useMemo(() => {
    if (platformStatsData && Array.isArray(platformStatsData)) {
      return Number(platformStatsData[1]);
    }
    return rooms.reduce((acc, r) => acc + Number(r.likes), 0);
  }, [platformStatsData, rooms]);

  // Filter My Designs count
  const myDesignsCount = useMemo(() => {
    if (!address) return 0;
    return rooms.filter(
      (r) => r.author.toLowerCase() === address.toLowerCase()
    ).length;
  }, [rooms, address]);

  // Filtered & Sorted Rooms
  const displayedRooms = useMemo(() => {
    let list = [...rooms];

    // Filter by Tab
    if (activeTab === 'my-designs') {
      if (!address) return [];
      list = list.filter(
        (r) => r.author.toLowerCase() === address.toLowerCase()
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(
        (r) => r.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query (title, roomType, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.roomType.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'likes') {
      list.sort((a, b) => Number(b.likes - a.likes));
    } else {
      list.sort((a, b) => Number(b.timestamp - a.timestamp));
    }

    return list;
  }, [rooms, activeTab, selectedCategory, searchQuery, sortBy, address]);

  // Handle Publish Room
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishRoom = async (data: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    roomType: string;
  }) => {
    if (!isConnected) {
      handleConnectWallet();
      return;
    }

    setIsPublishing(true);
    const toastId = addToast({
      type: 'loading',
      title: 'Broadcasting Room Design',
      description: 'Please approve the transaction in your wallet to record this space onto Botchain...',
    });

    try {
      const hash = await writeContractAsync({
        address: ROOM_MUSE_CONTRACT_ADDRESS,
        abi: ROOM_MUSE_ABI_CONST,
        functionName: 'publishRoom',
        args: [data.title, data.description, data.imageUrl, data.category, data.roomType],
        chainId: botchainTestnet.id,
      });

      dismissToast(toastId);
      addToast({
        type: 'success',
        title: 'Room Published Successfully!',
        description: `"${data.title}" is now immortalized on Botchain Testnet.`,
        txHash: hash,
      });

      setShareModalOpen(false);
      await Promise.all([refetchRooms(), refetchStats()]);
    } catch (err: any) {
      console.error('Publish error:', err);
      dismissToast(toastId);
      addToast({
        type: 'error',
        title: 'Publication Failed',
        description: err?.shortMessage || err?.message || 'Transaction was rejected or failed.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Like / Unlike
  const handleLikeToggle = async (roomId: bigint, currentlyLiked: boolean) => {
    if (!isConnected) {
      addToast({
        type: 'error',
        title: 'Wallet Connection Required',
        description: 'Please connect your wallet to endorse spaces on Botchain.',
      });
      handleConnectWallet();
      return;
    }

    setPendingLikeId(roomId);
    const action = currentlyLiked ? 'Unliking' : 'Liking';
    const toastId = addToast({
      type: 'loading',
      title: `${action} Room Design`,
      description: 'Confirming endorsement on Botchain...',
    });

    try {
      const hash = await writeContractAsync({
        address: ROOM_MUSE_CONTRACT_ADDRESS,
        abi: ROOM_MUSE_ABI_CONST,
        functionName: currentlyLiked ? 'unlikeRoom' : 'likeRoom',
        args: [roomId],
        chainId: botchainTestnet.id,
      });

      // Update local like map
      setLikedRoomsMap((prev) => ({
        ...prev,
        [`${roomId.toString()}-${address?.toLowerCase()}`]: !currentlyLiked,
      }));

      dismissToast(toastId);
      addToast({
        type: 'success',
        title: currentlyLiked ? 'Like Removed' : 'Room Design Endorsed!',
        description: currentlyLiked
          ? 'Your endorsement was successfully withdrawn.'
          : 'Your inspiration like was recorded on-chain.',
        txHash: hash,
      });

      await Promise.all([refetchRooms(), refetchStats()]);

      // If viewing room details modal, update selected room state
      if (selectedRoom && selectedRoom.id === roomId) {
        setSelectedRoom((prev) =>
          prev
            ? {
                ...prev,
                likes: currentlyLiked ? prev.likes - BigInt(1) : prev.likes + BigInt(1),
              }
            : null
        );
      }
    } catch (err: any) {
      console.error('Like toggle error:', err);
      dismissToast(toastId);
      addToast({
        type: 'error',
        title: `${action} Failed`,
        description: err?.shortMessage || err?.message || 'Transaction failed or was rejected.',
      });
    } finally {
      setPendingLikeId(null);
    }
  };

  // Handle Remove Room (author only)
  const [isRemoving, setIsRemoving] = useState(false);
  const handleRemoveRoom = async (roomId: bigint) => {
    if (!isConnected) return;

    setIsRemoving(true);
    setPendingRemoveId(roomId);
    const toastId = addToast({
      type: 'loading',
      title: 'Removing Room Submission',
      description: 'Submitting removal request to Botchain...',
    });

    try {
      const hash = await writeContractAsync({
        address: ROOM_MUSE_CONTRACT_ADDRESS,
        abi: ROOM_MUSE_ABI_CONST,
        functionName: 'removeRoom',
        args: [roomId],
        chainId: botchainTestnet.id,
      });

      dismissToast(toastId);
      addToast({
        type: 'success',
        title: 'Room Removed',
        description: 'The submission has been removed from the gallery on-chain.',
        txHash: hash,
      });

      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null);
      }

      await Promise.all([refetchRooms(), refetchStats()]);
    } catch (err: any) {
      console.error('Remove error:', err);
      dismissToast(toastId);
      addToast({
        type: 'error',
        title: 'Removal Failed',
        description: err?.shortMessage || err?.message || 'Failed to remove room.',
      });
    } finally {
      setIsRemoving(false);
      setPendingRemoveId(null);
    }
  };

  const handleConnectWallet = () => {
    const injected = connectors.find((c) => c.id === 'injected' || c.name.toLowerCase().includes('metamask')) || connectors[0];
    if (injected) {
      connect({ connector: injected });
    }
  };

  const scrollToExplore = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-primaryText selection:bg-accent/30 selection:text-primaryText font-sans">
      {/* Navigation Header */}
      <Navbar
        onOpenShareModal={() => setShareModalOpen(true)}
        totalDesigns={totalDesigns}
      />

      {/* Hero Section */}
      <Hero
        totalDesigns={totalDesigns}
        totalLikes={totalLikes}
        onExploreClick={scrollToExplore}
        onShareClick={() => setShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main ref={exploreRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-accent mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Spaces Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#F5F0E8] tracking-tight">
              {activeTab === 'explore' ? 'Explore Spaces' : 'My Curated Submissions'}
            </h2>
          </div>

          <button
            onClick={() => {
              refetchRooms();
              refetchStats();
            }}
            disabled={isRefetchingRooms}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-secondaryText hover:text-accent border border-white/5 hover:border-white/20 bg-card/40 transition-colors"
            title="Refresh on-chain designs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetchingRooms ? 'animate-spin text-accent' : ''}`} />
            <span>Sync On-Chain</span>
          </button>
        </div>

        {/* Category Filters, Search, Tabs & Sorting */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortBy={sortBy}
          onSortChange={setSortBy}
          myDesignsCount={myDesignsCount}
        />

        {/* Loading State */}
        {isLoadingRooms && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4" />
            <p className="font-serif text-xl font-light text-[#F5F0E8]">
              Consulting the Blockchain Archives...
            </p>
            <p className="text-xs text-secondaryText mt-1">
              Fetching room submissions directly from Botchain Testnet (Chain ID 968)
            </p>
          </div>
        )}

        {/* Empty States */}
        {!isLoadingRooms && displayedRooms.length === 0 && (
          <div className="py-20 px-6 rounded-3xl bg-card/40 border border-white/5 text-center max-w-2xl mx-auto backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-5">
              {activeTab === 'my-designs' ? (
                <Layers className="w-7 h-7" />
              ) : (
                <Sparkles className="w-7 h-7" />
              )}
            </div>

            <h3 className="font-serif text-2xl font-light text-[#F5F0E8] mb-2">
              {activeTab === 'my-designs'
                ? !isConnected
                  ? 'Connect Wallet to View Your Designs'
                  : 'You Have Not Shared Any Spaces Yet'
                : searchQuery || selectedCategory !== 'All'
                ? 'No Spaces Found Matching Your Filter'
                : 'The Gallery Awaits Its First Masterpiece'}
            </h3>

            <p className="text-sm text-secondaryText font-light max-w-md mx-auto mb-8 leading-relaxed">
              {activeTab === 'my-designs'
                ? !isConnected
                  ? 'Connect your Web3 wallet to manage your room designs and track your community likes.'
                  : 'Publish your interior concepts, bespoke studios, or architectural retreats to build your decentralized design portfolio.'
                : searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search terms or select another category filter to explore more spaces.'
                : 'Be the inaugural curator to chronicle a room design onto the Botchain decentralized ledger.'}
            </p>

            {activeTab === 'my-designs' && !isConnected ? (
              <button
                onClick={handleConnectWallet}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider bg-accent text-[#151513] hover:bg-accent-hover transition-all shadow-gold"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-medium uppercase tracking-wider bg-accent text-[#151513] hover:bg-accent-hover transition-all shadow-gold hover:shadow-goldGlow"
              >
                <Sparkles className="w-4 h-4" />
                <span>Share a Room Design</span>
              </button>
            )}
          </div>
        )}

        {/* Room Photography Grid */}
        {!isLoadingRooms && displayedRooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedRooms.map((room) => {
              const hasLiked = Boolean(
                address && likedRoomsMap[`${room.id.toString()}-${address.toLowerCase()}`]
              );
              return (
                <RoomCard
                  key={room.id.toString()}
                  room={room}
                  hasLiked={hasLiked}
                  onLikeToggle={handleLikeToggle}
                  onSelect={(r) => setSelectedRoom(r)}
                  isLiking={pendingLikeId === room.id}
                  currentUserAddress={address}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-white/5 bg-[#121210] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#D6A86C]" />
                <span className="font-serif text-xl tracking-[0.18em] uppercase text-[#F5F0E8]">
                  ROOM<span className="text-accent">MUSE</span>
                </span>
              </div>
              <p className="text-xs text-secondaryText font-mono tracking-wider">
                "Spaces Worth Inspiring."
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-secondaryText">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Botchain Testnet (Chain ID 968)
              </span>
              <a
                href="https://scan.bohr.life"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-1"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://scan.bohr.life/address/${ROOM_MUSE_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors flex items-center gap-1"
              >
                <span>Contract</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondaryText/60">
            <p>© 2026 RoomMuse. Decentralized Interior Inspiration.</p>
            <p className="font-serif italic text-accent/80 text-sm">
              Architecture • Materials • Spaces • Light
            </p>
          </div>
        </div>
      </footer>

      {/* Room Details Modal */}
      <RoomDetailsModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        hasLiked={Boolean(
          selectedRoom &&
          address &&
          likedRoomsMap[`${selectedRoom.id.toString()}-${address.toLowerCase()}`]
        )}
        onLikeToggle={handleLikeToggle}
        onRemoveRoom={handleRemoveRoom}
        currentUserAddress={address}
        isLiking={Boolean(selectedRoom && pendingLikeId === selectedRoom.id)}
        isRemoving={isRemoving}
      />

      {/* Share a Design Modal */}
      <ShareDesignModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onSubmit={handlePublishRoom}
        isSubmitting={isPublishing}
        isConnected={isConnected}
        onConnectWallet={handleConnectWallet}
      />

      {/* Floating Notification Toasts */}
      <NotificationToast
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}

