import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  href: string;
  children: React.ReactNode;
}

export function BackButton({ href, children }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="mb-2 flex cursor-pointer items-center space-x-2 text-gray-400 transition-colors hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}
