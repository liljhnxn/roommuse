import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'RoomMuse — Spaces Worth Inspiring',
  description: 'A decentralized interior-design inspiration platform where users share beautiful room designs, discover decoration ideas, and explore creative spaces on Botchain Testnet.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background text-primaryText antialiased min-h-screen flex flex-col selection:bg-accent/30 selection:text-primaryText">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
