declare module 'react-stockcharts' {
  import * as React from 'react';
  
  export interface ChartCanvasProps {
    width: number;
    height: number;
    margin: { top: number; right: number; bottom: number; left: number };
    seriesName: string;
    data: any[];
    xAccessor: (d: any) => any;
    xScaleProvider?: (data: any) => any;
    xScale?: any;
    xExtents: [any, any];
    children: React.ReactNode;
    type?: 'svg' | 'hybrid';
    ratio?: number;
    displayXAccessor?: any;
  }
  
  export class ChartCanvas extends React.Component<ChartCanvasProps> {}
  
  // Main chart components
  export class Chart extends React.Component<any> {}
  
  export interface ChartProps {
    id: number | string;
    yExtents: (d: any) => number[];
    children: React.ReactNode;
  }
  
  export class Chart extends React.Component<ChartProps> {}
  
  export interface AxisProps {
    axisAt: 'bottom' | 'top' | 'left' | 'right';
    orient: 'top' | 'bottom' | 'left' | 'right';
    ticks: number;
  }
  
  export class XAxis extends React.Component<AxisProps> {}
  export class YAxis extends React.Component<AxisProps> {}
  
  export class CandlestickSeries extends React.Component<{ width?: number }> {}
  
  export interface MouseCoordinateProps {
    at: 'bottom' | 'top' | 'left' | 'right';
    orient: 'top' | 'bottom' | 'left' | 'right';
    displayFormat: (value: any) => string;
  }
  
  export class MouseCoordinateX extends React.Component<MouseCoordinateProps> {}
  export class MouseCoordinateY extends React.Component<MouseCoordinateProps> {}
  
  export class CrossHairCursor extends React.Component {}
  
  export interface OHLCTooltipProps {
    origin: [number, number];
  }
  
  export class OHLCTooltip extends React.Component<OHLCTooltipProps> {}
  
  export class ZoomButtons extends React.Component {}
  
  export function discontinuousTimeScaleProvider(input: any): any;
}

// Axes module
declare module 'react-stockcharts/lib/axes' {
  import * as React from 'react';
  
  export interface AxisProps {
    axisAt: 'bottom' | 'top' | 'left' | 'right';
    orient: 'top' | 'bottom' | 'left' | 'right';
    ticks?: number;
    tickFormat?: (value: any) => string;
    stroke?: string;
    tickStroke?: string;
    tickStrokeOpacity?: number;
    tickStrokeWidth?: number;
    strokeOpacity?: number;
    strokeWidth?: number;
  }
  
  export class XAxis extends React.Component<AxisProps> {}
  export class YAxis extends React.Component<AxisProps> {}
}

// Series module
declare module 'react-stockcharts/lib/series' {
  import * as React from 'react';
  
  export interface CandlestickSeriesProps {
    width?: number;
  }
  
  export class CandlestickSeries extends React.Component<CandlestickSeriesProps> {}
}

// Coordinates module
declare module 'react-stockcharts/lib/coordinates' {
  import * as React from 'react';
  
  export interface MouseCoordinateProps {
    at: 'bottom' | 'top' | 'left' | 'right';
    orient: 'top' | 'bottom' | 'left' | 'right';
    displayFormat: (value: any) => string;
    type?: 'vertical' | 'horizontal';
  }
  
  export class MouseCoordinateX extends React.Component<MouseCoordinateProps> {}
  export class MouseCoordinateY extends React.Component<MouseCoordinateProps> {}
}

// Interactive module
declare module 'react-stockcharts/lib/interactive' {
  import * as React from 'react';
  
  export interface CrossHairCursorProps {
    stroke?: string;
    strokeWidth?: number;
  }
  
  export class CrossHairCursor extends React.Component<CrossHairCursorProps> {}
}

// Tooltip module
declare module 'react-stockcharts/lib/tooltip' {
  import * as React from 'react';
  
  export interface OHLCTooltipProps {
    origin: [number, number];
    displayFormat?: (value: any) => any;
    displayValuesFor: (props: any, moreProps: any) => any;
    xDisplayFormat?: (value: any) => string;
    textFill?: string;
    labelFill?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number | string;
    className?: string;
    itemToltipClassName?: string;
    ohlcFormat?: (value: any) => string;
    percentFormat?: (value: any) => string;
    volumeFormat?: (value: any) => string;
    dateFormat?: (value: any) => string;
    textFontFamily?: string;
    textFontSize?: number;
    labelFontFamily?: string;
    labelFontSize?: number;
    itemWidth?: number;
    onClick?: (event: React.MouseEvent) => void;
    onUnmount?: () => void;
    options?: {
      open: (d: any) => any;
      high: (d: any) => any;
      low: (d: any) => any;
      close: (d: any) => any;
      volume: (d: any) => any;
    };
  }
  
  export class OHLCTooltip extends React.Component<OHLCTooltipProps> {}
}

// Controls module
declare module 'react-stockcharts/lib/controls' {
  import * as React from 'react';
  
  export interface ZoomButtonsProps {
    onReset: () => void;
    onZoom: (zoom: number) => void;
    position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  }
  
  export class ZoomButtons extends React.Component<ZoomButtonsProps> {}
}

// Scale module
declare module 'react-stockcharts/lib/scale' {
  export function discontinuousTimeScaleProvider(input: any): any;
}

// Helper module
declare module 'react-stockcharts/lib/helper' {
  import { ComponentType } from 'react';
  
  export function fitWidth<T>(component: ComponentType<T>): ComponentType<T & { width: number }>;
}

// Utils module
declare module 'react-stockcharts/lib/utils' {
  export function last<T>(array: T[]): T | undefined;
}
