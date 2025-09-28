import { BuildStatsProvider } from '@/components/contexts/BuildStatsContext';
import { LithiaProvider } from '@/components/contexts/LithiaContext';
import { LogsProvider } from '@/components/contexts/LogsContext';
import { RoutesProvider } from '@/components/contexts/RoutesContext';
import { ServerStatsProvider } from '@/components/contexts/ServerStatsContext';
import { DisconnectionOverlay } from '@/components/ui/DisconnectionOverlay';
import { SideBar } from '@/components/ui/SideBar';
import type { Metadata } from 'next';
import { Fira_Code, Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lithia Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LithiaProvider>
      <LogsProvider>
        <RoutesProvider>
          <ServerStatsProvider>
            <BuildStatsProvider>
              <html lang="en">
                <body
                  className={`${geistSans.variable} ${firaCode.variable} antialiased`}
                >
                  <div className="relative flex h-screen overflow-hidden">
                    <SideBar />
                    <main className="flex-1 overflow-y-auto">{children}</main>
                  </div>
                  <DisconnectionOverlay />
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      duration: 3000,
                      style: {
                        background: '#1f2937',
                        color: '#f9fafb',
                        border: '1px solid #374151',
                      },
                    }}
                  />
                </body>
              </html>
            </BuildStatsProvider>
          </ServerStatsProvider>
        </RoutesProvider>
      </LogsProvider>
    </LithiaProvider>
  );
}
