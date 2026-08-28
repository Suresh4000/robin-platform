import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Robin Jones',
  description: 'Single-admin business management platform for Robin Jones',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
