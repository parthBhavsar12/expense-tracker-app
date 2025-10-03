import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout/index';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Expense Tracker App',
  description: 'An application for tracking expenses',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--l-bg)]`}>
        <ToastContainer
          position='top-center'
          theme='dark'
          autoClose={2000}
          limit={3}
          pauseOnFocusLoss={true}
          pauseOnHover={false}
        />
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
