'use client';

import * as LightweightCharts from 'lightweight-charts';
import type {
  ChartOptions,
  UTCTimestamp,
  DeepPartial,
  IChartApi,
  GridLineOptions,
  TimeScaleOptions,
  PriceScaleOptions,
} from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

interface ChartProps {
  data: {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  width?: number;
  height?: number;
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const LightweightChart = ({
  data,
  width = 800,
  height = 500,
  colors = {
    backgroundColor: 'white',
    lineColor: '#2962FF',
    textColor: 'black',
    areaTopColor: '#2962FF',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)',
  },
}: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      width,
      height,
      layout: {
        background: { 
          color: colors.backgroundColor || 'white'
        },
        textColor: colors.textColor || 'black',
      },
      grid: {
        vertLines: { 
          color: 'rgba(197, 203, 206, 0.5)',
          style: 1,
          visible: true,
        },
        horzLines: { 
          color: 'rgba(197, 203, 206, 0.5)',
          style: 1,
          visible: true,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        autoScale: true,
        mode: 0,
        invertScale: false,
        alignLabels: true,
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
        rightOffset: 12,
        barSpacing: 6,
        minBarSpacing: 0.5,
      },
    };
    
    const chart = LightweightCharts.createChart(
      chartContainerRef.current,
      chartOptions
    );

    // Type assertion to access the candlestick series method.
    // Use a runtime guard because ESM/CJS interop can sometimes change imports.
    if (typeof (chart as any)?.addCandlestickSeries !== 'function') {
      // If the method is missing, log a helpful warning and bail out gracefully.
      // This avoids the runtime TypeError and surfaces the shape of the chart object.
      // eslint-disable-next-line no-console
      console.warn('LightweightChart: addCandlestickSeries is not available on chart object', chart);
      return;
    }

    const candleSeries = (chart as any).addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const formattedData = data.map((d) => ({
      time: (d.date.getTime() / 1000) as UTCTimestamp,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(formattedData);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, width, height]);

  return (
    <div 
      ref={chartContainerRef} 
      style={{
        width: '100%',
        height: `${height}px`,
      }}
    />
  );
};