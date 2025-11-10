// Update the StockChart component to be client-side only
'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

export interface StockDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const DynamicChart = dynamic(
  () => import('./DynamicChart').then((mod) => mod.DynamicChart),
  { 
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
);

interface StockChartProps {
  data: StockDataPoint[];
  width?: number;
  height?: number;
  ratio?: number;
  type?: 'svg' | 'hybrid';
  showLoadingState?: boolean;
  loadingMessage?: string;
}

const DEFAULT_HEIGHT = 500;

export const StockChart: React.FC<StockChartProps> = ({
  data,
  width = 800,
  ratio = 1,
  type = 'hybrid',
  height = DEFAULT_HEIGHT,
  showLoadingState = true,
  loadingMessage = 'Loading chart data...',
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (showLoadingState && (!data || data.length === 0)) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="text-gray-500">{loadingMessage}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <DynamicChart 
        data={data} 
        width={width}
        height={height}
        ratio={ratio}
        type={type}
      />
    </div>
  );
};

StockChart.displayName = 'StockChart';