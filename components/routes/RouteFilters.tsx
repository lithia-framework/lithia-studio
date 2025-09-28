'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface RouteFiltersProps {
  searchTerm: string;
  methodFilter: string;
  availableMethods: FilterOption[];
  onSearchChange: (value: string) => void;
  onMethodChange: (value: string) => void;
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  searchTerm,
  methodFilter,
  availableMethods,
  onSearchChange,
  onMethodChange,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search routes..."
          leftIcon={<Search className="h-4 w-4" />}
          variant="default"
          size="md"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select
          value={methodFilter}
          onChange={onMethodChange}
          options={availableMethods}
          leftIcon={<Filter className="h-4 w-4" />}
          variant="default"
          size="md"
          className="min-w-[180px]"
        />
      </div>
    </div>
  );
};
