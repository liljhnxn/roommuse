# RoomMuse

> **"Spaces Worth Inspiring."**

A decentralized interior-design inspiration platform where users share beautiful room designs, discover decoration ideas, and explore creative spaces.

Built for architects, interior decorators, and design visionaries on **Botchain Testnet**.

---

## 🏛️ Architectural Overview

- **Single Webpage Architecture**: The entire dApp operates within a single responsive view in Next.js App Router (`app/page.tsx`). No additional pages, routes, or server backends.
- **Single Solidity Smart Contract**: Exactly one verified smart contract (`contracts/RoomMuse.sol`) manages all room publications, metadata, endorsements (likes/unlikes), author controls, and platform metrics on-chain.
- **Zero Centralized Backend / Database**: All state resides directly on the Botchain blockchain.
- **No Tokens / No NFTs**: Pure decentralized social curation without speculative financialization.

---

## 🎨 Luxury Editorial Aesthetic

RoomMuse is styled as a luxury dark interior-design magazine:
- **Background**: `#151513` (Deep charcoal obsidian)
- **Cards & Surfaces**: `#24241F` (Dark warm stone)
- **Primary Accent**: `#D6A86C` (Warm burnished gold)
- **Typography**: `#F5F0E8` (Linen white) & `#A9A49A` (Muted travertine)
- **Typography Philosophy**: High-contrast editorial serif headers (*Cormorant Garamond*) paired with geometric precision sans-serif (*Inter*).
- **Visuals**: Large architectural room photography, rounded geometry, subtle gold hover lighting, and refined editorial spacing.

---

## ⚡ Network Details (Botchain Testnet)

- **Network Name**: Botchain Testnet
- **Chain ID**: `968`
- **Currency**: `BOHR`
- **RPC URL**: `https://rpc.bohr.life`
- **Block Explorer**: `https://scan.bohr.life`

---

## 📜 Smart Contract Capabilities (`RoomMuse.sol`)

The `RoomMuse.sol` contract implements:
1. **Publish Room Design**: Stores `title`, `description`, `imageUrl`, `category`, and `roomType` along with the author's address and block timestamp.
2. **Room Type Specification**: Custom room classification (e.g. *Master Suite*, *Penthouse Salon*, *Atelier*, *Brutalist Study*).
3. **Like & Unlike Mechanism**: Prevents duplicate likes from the same wallet address while allowing users to withdraw their like if desired.
4. **Author Removal Control**: Only original authors can delete their room submissions from the platform.
5. **Real-time Platform Statistics**: Tracks active room count, lifetime published rooms, and community endorsements.
6. **Decentralized Events**: Emits `RoomPublished`, `RoomLiked`, `RoomUnliked`, and `RoomRemoved` for instant client synchronization.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Connectivity**: `wagmi` v2, `viem` v2, and MetaMask / injected connectors
- **Contract Tooling**: Solidity `^0.8.20`, Hardhat, Ethers.js v6, Chai

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your environment variables:
```ini
BOTCHAIN_RPC_URL="https://rpc.bohr.life"
PRIVATE_KEY="your_wallet_private_key"
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_CHAIN_ID="968"
NEXT_PUBLIC_RPC_URL="https://rpc.bohr.life"
NEXT_PUBLIC_EXPLORER_URL="https://scan.bohr.life"
```

### 3. Compile the Smart Contract
```bash
npm run compile
```

### 4. Run Smart Contract Test Suite
```bash
npm run test
```

### 5. Deploy to Botchain Testnet
```bash
npm run deploy
```

### 6. Run the Frontend Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Smart Contract Test Coverage

The Hardhat test suite (`test/RoomMuse.test.js`) validates:
- Initialization with 0 active rooms and 0 likes
- Publishing room designs with all metadata
- Input validation (preventing empty titles, images, categories, or room types)
- Liking designs and preventing duplicate likes from the same wallet
- Unliking designs and counter decrements
- Removing designs (restricted to author only)
- Platform statistics tracking
- Event emission for all state transitions

---

## 📄 License
MIT

