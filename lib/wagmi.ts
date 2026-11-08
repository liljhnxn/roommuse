import { http, createConfig } from 'wagmi';
import { injected } from '@wagmi/core';
import { botchainTestnet } from './chain';

export const config = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [botchainTestnet.id]: http('https://rpc.bohr.life'),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
