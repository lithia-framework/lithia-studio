'use client';

import {
  BarChart3,
  FileText,
  Home,
  LifeBuoy,
  LucideIcon,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import AnimatedList from './AnimatedList';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  isSection?: boolean;
  sectionTitle?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  navigation?: NavSection[];
}

const defaultNavigation: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      {
        name: 'Overview',
        href: '/',
        icon: Home,
        description: 'Server overview and stats',
      },
    ],
  },
  {
    title: 'Development',
    items: [
      {
        name: 'Routes',
        href: '/routes',
        icon: FileText,
        description: 'Manage and test API routes',
      },
      {
        name: 'Logs',
        href: '/logs',
        icon: BarChart3,
        description: 'View server logs',
      },
    ],
  },
];

const flattenNavigation = (navigation: NavSection[]): NavItem[] => {
  const items: NavItem[] = [];

  navigation.forEach((section) => {
    items.push({
      name: section.title,
      href: '',
      icon: LifeBuoy,
      isSection: true,
      sectionTitle: section.title,
    });

    section.items.forEach((item) => {
      items.push({
        ...item,
        isSection: false,
        sectionTitle: section.title,
      });
    });
  });

  return items;
};

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const SideBar: React.FC<DashboardSidebarProps> = ({
  navigation = defaultNavigation,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const flatItems = useMemo(() => flattenNavigation(navigation), [navigation]);

  const handleItemSelect = (item: NavItem) => {
    if (item && !item.isSection && item.href) {
      router.push(item.href);
      setIsOpen(false);
    }
  };

  const renderNavItem = (item: NavItem) => {
    if (item.isSection) {
      return (
        <div className="mt-4 px-3 py-2 first:mt-0">
          <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            {item.sectionTitle}
          </h3>
        </div>
      );
    }

    const isActive =
      pathname === item.href ||
      (item.href !== '/' && pathname.startsWith(item.href + '/'));
    const Icon = item.icon;

    return (
      <div className="mb-1">
        <div
          className={cn(
            'group flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-white/10 text-white'
              : 'text-gray-300 opacity-60 hover:opacity-100',
          )}
        >
          <Icon
            className={cn(
              'mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200',
              isActive ? 'text-primary' : 'text-gray-400',
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium">{item.name}</div>
            {item.description && (
              <div className="text-xs text-gray-400">{item.description}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        type="button"
        className="bg-primary hover:bg-primary/80 fixed top-4 right-4 z-50 rounded-lg p-2.5 text-white shadow-lg transition-all md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          'bg-background-secondary fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 md:sticky md:top-0 md:h-screen md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-white/10 p-6">
            <Link href="/" className="block">
              <Image
                src="/logo-green-white.svg"
                alt="Lithia"
                width={100}
                height={26.98}
                priority
                className="h-auto w-auto"
              />
            </Link>
          </div>

          <div className="flex-1 overflow-hidden px-4 py-4">
            <AnimatedList
              items={flatItems}
              onItemSelect={handleItemSelect}
              renderItem={renderNavItem}
              showGradients={false}
              displayScrollbar={true}
              className="h-full w-full"
            />
          </div>

          <div className="border-t border-white/10 p-4">
            <Link
              href="https://lithiajs.com/docs"
              target="_blank"
              className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 opacity-60 transition-all hover:opacity-100"
            >
              <LifeBuoy className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium">Documentation</div>
                <div className="text-xs text-gray-400">
                  Guide and references
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
