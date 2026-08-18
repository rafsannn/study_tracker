import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: "Rafsan's Study Deck | YouTube Playlist Progress Tracker",
  description: "Personal YouTube Playlist progress tracker and study deck for Rafsan with course checklists, notes, streak tracking, and instant stream navigation.",
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
