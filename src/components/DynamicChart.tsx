'use client';

import React, { Suspense } from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

// Import StockDataPoint type from StockChart
import type { StockDataPoint } from './StockChart';

// Import components directly to avoid dynamic import issues
import { Chart, ChartCanvas } from 'react-stockcharts';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates';
import { CrossHairCursor } from 'react-stockcharts/lib/interactive';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { fitWidth } from 'react-stockcharts/lib/helper';

interface StockChartProps {
  data: StockDataPoint[];
  width: number;
  height?: number;
  ratio?: number;
  type?: 'svg' | 'hybrid';
}

export const DynamicChart = fitWidth(({ 
  data,
  width,
  ratio = 1,
  type = 'hybrid',
  height = 500
}: StockChartProps) => {
  // Ensure data is an array and has at least one element
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid data format: Expected an array', data);
    return <div className="flex items-center justify-center h-full">No chart data available</div>;
  }

  // Process and validate data
  const processedData = data.map(item => ({
    date: item.date instanceof Date ? item.date : new Date(item.date),
    open: Number(item.open),
    high: Number(item.high),
    low: Number(item.low),
    close: Number(item.close),
    volume: Number(item.volume)
  }));

  // Ensure all required fields exist and are in the correct format
  const validData = processedData.every(d => 
    d && 
    d.date instanceof Date && 
    !isNaN(d.date.getTime()) &&
    !isNaN(d.open) &&
    !isNaN(d.high) &&
    !isNaN(d.low) &&
    !isNaN(d.close) &&
    !isNaN(d.volume)
  );

  if (!validData) {
    console.error('Invalid data format: Missing required fields', processedData);
    return <div className="flex items-center justify-center h-full">Invalid chart data format</div>;
  }

  try {
    const xAccessor = (d: StockDataPoint) => d.date;
    
    // Ensure we have valid dates for xExtents
    const sortedData = [...processedData].sort((a, b) => a.date.getTime() - b.date.getTime());
    const xExtents = [
      sortedData[0].date.getTime(),
      sortedData[sortedData.length - 1].date.getTime()
    ] as [number, number];
    
    const scaleProvider = discontinuousTimeScaleProvider({
      xAccessor,
      xExtents
    });

    const { data: chartData, xScale, xAccessor: xScaleAccessor, displayXAccessor } = scaleProvider(processedData);
    
    const yExtents = (d: StockDataPoint) => [d.high, d.low];

    return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={{ left: 70, right: 70, top: 20, bottom: 40 }}
        type={type}
        seriesName="Price"
        data={chartData}
        xAccessor={xScaleAccessor}
        xScale={xScale}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart id="price-chart" yExtents={yExtents}>
          <XAxis 
            axisAt="bottom" 
            orient="bottom" 
            ticks={10}
            tickFormat={timeFormat('%Y-%m-%d')}
          />
          <YAxis 
            axisAt="right" 
            orient="right" 
            ticks={5}
            tickFormat={format('.2f')}
          />
          
          <CandlestickSeries />
          
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%Y-%m-%d')}
          />
          
          <OHLCTooltip 
            origin={[-40, 0]}
            displayValuesFor={(_, props) => ({
              open: props.currentItem?.open,
              high: props.currentItem?.high,
              low: props.currentItem?.low,
              close: props.currentItem?.close,
              volume: props.currentItem?.volume
            })}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </div>
    );
  } catch (error) {
    console.error('Error rendering chart:', error);
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error rendering chart: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
});