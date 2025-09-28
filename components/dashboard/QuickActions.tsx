'use client';

import { Activity, Route, Settings, Terminal } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      title: 'Server Logs',
      description: 'View real-time server logs',
      icon: <Terminal className="h-6 w-6" />,
      href: '/logs',
      color: 'text-blue-400',
    },
    {
      title: 'API Routes',
      description: 'Manage and test your routes',
      icon: <Route className="h-6 w-6" />,
      href: '/routes',
      color: 'text-green-400',
    },
    {
      title: 'Monitor',
      description: 'Server performance metrics',
      icon: <Activity className="h-6 w-6" />,
      href: '/monitor',
      color: 'text-purple-400',
    },
    {
      title: 'Settings',
      description: 'Configure your server',
      icon: <Settings className="h-6 w-6" />,
      href: '/settings',
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="bg-background-secondary rounded-lg border border-white/10 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className="group flex items-center space-x-3 rounded-lg border border-white/10 p-4 transition-all hover:border-white/20 hover:bg-white/5">
              <div
                className={`${action.color} group-hover:text-primary transition-colors`}
              >
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="group-hover:text-primary text-sm font-medium text-white transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-400">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
