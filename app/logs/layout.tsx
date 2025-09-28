import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Logs | Lithia Studio',
};

export default function LogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
