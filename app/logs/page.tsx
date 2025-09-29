'use client';

import { AlertCircle, Clock, Download, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useLogs } from '@/components/contexts/LogsContext';
import { LogsList } from '@/components/logs';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/dialogs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function LogsPage() {
  const { filteredLogs, filters, setFilters, exportLogs, clearLogs } =
    useLogs();

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'debug', label: 'Debug' },
    { value: 'success', label: 'Success' },
    { value: 'ready', label: 'Ready' },
    { value: 'wait', label: 'Wait' },
    { value: 'event', label: 'Event' },
    { value: 'trace', label: 'Trace' },
  ];

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '15m', label: 'Last 15 Minutes' },
    { value: '30m', label: 'Last 30 Minutes' },
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'user', label: 'User Code' },
    { value: 'lithia', label: 'Lithia' },
  ];

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-white/10 p-8 backdrop-blur-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Server Logs
            </h1>
            <p className="text-gray-400">
              Monitor and analyze your server logs in real-time
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={exportLogs}
              disabled={filteredLogs.length === 0}
              variant="secondary"
              size="sm"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              onClick={() => setIsClearDialogOpen(true)}
              disabled={filteredLogs.length === 0}
              variant="danger"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              placeholder="Search logs..."
              leftIcon={<Search className="h-4 w-4" />}
              variant="default"
              size="md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={filters.levelFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  levelFilter: value as
                    | 'all'
                    | 'info'
                    | 'warn'
                    | 'error'
                    | 'debug'
                    | 'success'
                    | 'ready'
                    | 'wait',
                })
              }
              options={levelOptions}
              leftIcon={<AlertCircle className="h-4 w-4" />}
              variant="default"
              size="md"
              className="min-w-[180px]"
            />
            <Select
              value={filters.timeFilter}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  timeFilter: value as
                    | 'all'
                    | '15m'
                    | '30m'
                    | '1h'
                    | '6h'
                    | '24h'
                    | '7d',
                })
              }
              options={timeOptions}
              leftIcon={<Clock className="h-4 w-4" />}
              variant="default"
              size="md"
              className="min-w-[180px]"
            />
            <Select
              value={filters.sourceFilter || 'all'}
              onChange={(value) =>
                setFilters({
                  ...filters,
                  sourceFilter: value as 'all' | 'user' | 'lithia',
                })
              }
              options={sourceOptions}
              leftIcon={<Search className="h-4 w-4" />}
              variant="default"
              size="md"
              className="min-w-[180px]"
            />
          </div>
        </div>
      </div>
      <LogsList logs={filteredLogs} />

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={() => {
          clearLogs();
          setIsClearDialogOpen(false);
        }}
        title="Clear All Logs"
        description="Are you sure you want to clear all logs? This action cannot be undone."
        confirmText="Got it, thanks!"
        cancelText="Cancel"
        icon={<Trash2 className="h-8 w-8 text-red-400" />}
        variant="danger"
      />
    </>
  );
}
