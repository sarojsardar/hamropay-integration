import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HamroPay',
  description: 'HamroPay Payment Gateway Integration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
