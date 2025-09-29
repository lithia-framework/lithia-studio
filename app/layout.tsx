import type { Metadata } from 'next';
import { Fira_Code, Geist } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { BuildStatsProvider } from '@/components/contexts/BuildStatsContext';
import { LithiaProvider } from '@/components/contexts/LithiaContext';
import { LogsProvider } from '@/components/contexts/LogsContext';
import { RoutesProvider } from '@/components/contexts/RoutesContext';
import { ServerStatsProvider } from '@/components/contexts/ServerStatsContext';
import { DisconnectionOverlay } from '@/components/ui/DisconnectionOverlay';
import { SideBar } from '@/components/ui/SideBar';
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
                      duration: 4000,
                      style: {
                        background: 'var(--background-secondary)',
                        color: 'var(--foreground)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      },
                      className: 'toast-custom',
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
