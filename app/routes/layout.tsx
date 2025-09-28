import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Routes | Lithia Studio',
};

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
