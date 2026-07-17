import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import { Topbar } from '../components/topbar/topbar';
import { UrqlClientProvider } from '../services/urql-provider';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Real-time Kanban',
  description: 'Kanban em tempo real com Next.js, GraphQL e WebSocket',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UrqlClientProvider>
          <Topbar />
          {children}
        </UrqlClientProvider>
      </body>
    </html>
  );
}
