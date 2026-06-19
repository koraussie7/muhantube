# MuHanTube 🎬

> Decentralized video platform — DTube UI + Loops P2P + Minima Blockchain

## Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vue 3 + Vite + Tailwind |
| **Video Player** | Clappr (@clappr/player) |
| **P2P CDN** | SwarmCloud (@swarmcloud/media) |
| **Blockchain** | Minima MDS |
| **Content API** | Avalon |
| **Token** | DTC (BNB Chain) + DADAPOINT (Minima) |
| **Wallet** | Minima MDS + MetaMask |

## Features

- ✅ **P2P Video Streaming** — SwarmCloud P2P CDN reduces bandwidth costs
- ✅ **Clappr Video Player** — Modern player with HLS/DASH support
- ✅ **DTube UI** — Classic DTube look & feel preserved
- ✅ **DADAPOINT Rewards** — Earn tokens by watching and engaging
- ✅ **DTC Farm** — Stake DTC tokens for APY rewards
- ✅ **Multi-Wallet** — Minima MDS + MetaMask
- ✅ **50+ Languages** — Internationalization support

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Architecture

```
src/
├── components/
│   ├── player/
│   │   └── VideoPlayer.vue    ← Clappr + SwarmCloud P2P
│   ├── layout/
│   │   └── AppHeader.vue
│   └── ...                    ← DTube UI components
├── composables/
│   └── useSwarmCloud.js       ← P2P composable
├── stores/                    ← Pinia stores
│   ├── auth.js
│   ├── video.js
│   └── rewards.js
├── lib/                       ← DTube core libs
│   ├── minima.js              ← Minima MDS client
│   ├── avalon.js              ← Avalon API client
│   ├── rewards.js             ← DADAPOINT system
│   └── providers.js           ← Video providers
├── views/                     ← Page components
│   ├── Home.vue
│   ├── VideoPage.vue
│   ├── FarmPage.vue
│   └── CoinPage.vue
└── assets/css/                ← DTube CSS
    ├── main.css
    └── ...
```

## Deployment

Domain: **muhantube.com**
