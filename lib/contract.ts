import { ROOM_MUSE_ABI } from '@/contracts/RoomMuseABI';

export const ROOM_MUSE_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  '0x3e2Ea6a26C7dCDb9996f04ea2BE21fc2b6bC12E3') as `0x${string}`;

export const ROOM_MUSE_ABI_CONST = ROOM_MUSE_ABI;

export interface RoomItem {
  id: bigint;
  author: `0x${string}`;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  roomType: string;
  likes: bigint;
  timestamp: bigint;
  exists: boolean;
}

export const CATEGORIES = [
  'All',
  'Bedroom',
  'Living Room',
  'Kitchen',
  'Workspace',
  'Minimalist',
] as const;

export type CategoryType = typeof CATEGORIES[number];

export const CURATED_INSPIRATION_PRESETS = [
  {
    title: 'The Solarium Penthouse',
    category: 'Living Room',
    roomType: 'Penthouse Salon',
    description: 'Double-height ceiling salon framed by blackened steel glass walls, bespoke travertine cocktail tables, and bouclé curved seating bathed in golden afternoon light.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Kyoto Wabi-Sabi Suite',
    category: 'Bedroom',
    roomType: 'Master Suite',
    description: 'Low-slung solid hinoki platform bed with raw linen bedding, shoji light screens, and micro-cement walls inspired by traditional Kyoto tea pavilions.',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Smoked Oak Culinary Atelier',
    category: 'Kitchen',
    roomType: 'Chef Atelier',
    description: 'Monolithic quartzite island with fluted smoked oak joinery, concealed brass induction elements, and museum-grade architectural spotlighting.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Architectural Library & Bureau',
    category: 'Workspace',
    roomType: 'Executive Study',
    description: 'Floor-to-ceiling book shelving in dark canaletto walnut, cantilevered leather desk, and iconic mid-century lounge overlooking private courtyards.',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Monochrome Monolith Retreat',
    category: 'Minimalist',
    roomType: 'Brutalist Loft',
    description: 'Formwork concrete walls paired with pure lime-wash plaster, floating stone hearth, and curated sculptural furniture reducing living to pure essence.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Sunken conversation Lounge',
    category: 'Living Room',
    roomType: 'Sunken Lounge',
    description: 'Bespoke velvet sunken conversation pit with central basalt fire feature, bordered by warm cedar panelling and panoramic floor-to-ceiling views.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
];

