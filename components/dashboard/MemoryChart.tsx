'use client';

import { MemoryDataPoint } from '@/components/contexts/ServerStatsContext';
import {
  Area,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MemoryChartProps {
  data: MemoryDataPoint[];
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function MemoryChart({ data }: MemoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-400">
        <p className="text-sm">Coletando dados de memória...</p>
      </div>
    );
  }

  return (
    <div className="h-48 w-full [&_*]:focus:outline-none [&_*]:focus-visible:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          style={{ outline: 'none' }}
        >
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis
            tickFormatter={(value) => formatBytes(value)}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background-secondary rounded-lg border border-white/10 p-3 shadow-lg">
                    <p className="mb-2 text-xs text-gray-400">
                      {formatTime(label as number)}
                    </p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-white">
                          {entry.dataKey === 'rss' && 'RSS'}
                          {entry.dataKey === 'heapUsed' && 'Heap Used'}
                          {entry.dataKey === 'heapTotal' && 'Heap Total'}:{' '}
                          {formatBytes(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="rss"
            stroke="#22C55E"
            fill="#22C55E"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#22C55E' }}
          />
          <Area
            type="monotone"
            dataKey="heapUsed"
            stroke="#16A34A"
            fill="#16A34A"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#16A34A' }}
          />
          <Area
            type="monotone"
            dataKey="heapTotal"
            stroke="#15803D"
            fill="#15803D"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#15803D' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
