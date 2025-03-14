import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Page Replacement Algorithm Visualizer',
  description: 'Visualize FIFO and LRU page replacement algorithms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

