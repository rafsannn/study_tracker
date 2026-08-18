import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  title: "Rafsan's Study Deck | YouTube Playlist Progress Tracker",
  description: "Personal YouTube Playlist progress tracker and study deck for Rafsan with course checklists, notes, streak tracking, and instant stream navigation.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Rafsan's Study Deck",
  },
  openGraph: {
    title: "Rafsan's Study Deck",
    description: "Personal YouTube Playlist progress tracker and study deck for Rafsan.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rafsan's Study Deck",
    description: "Personal YouTube Playlist progress tracker and study deck for Rafsan.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
