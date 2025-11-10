declare module 'react-stockcharts/lib/Chart' {
  import * as React from 'react';
  
  interface ChartProps {
    id: string | number;
    yExtents: (data: any) => number[] | [number, number];
    children?: React.ReactNode;
  }
  
  const Chart: React.FC<ChartProps>;
  export default Chart;
}

declare module 'react-stockcharts/lib/ChartCanvas' {
  import * as React from 'react';
  
  interface ChartCanvasProps {
    width: number;
    height: number;
    ratio: number;
    margin: { top: number; right: number; bottom: number; left: number };
    type?: 'svg' | 'hybrid';
    seriesName: string;
    data: any[];
    xAccessor: (data: any) => any;
    xScale: any;
    displayXAccessor: any;
    xExtents: [any, any];
    children: React.ReactNode;
  }
  
  const ChartCanvas: React.FC<ChartCanvasProps>;
  export default ChartCanvas;
}

declare module 'react-stockcharts/lib/axes/XAxis' {
  import * as React from 'react';
  
  interface XAxisProps {
    axisAt: 'bottom' | 'top' | 'left' | 'right' | number;
    orient: 'top' | 'bottom' | 'left' | 'right';
    ticks?: number;
    tickFormat?: (value: any) => string;
    stroke?: string;
    tickStroke?: string;
    tickLabelFill?: string;
  }
  
  const XAxis: React.FC<XAxisProps>;
  export default XAxis;
}

declare module 'react-stockcharts/lib/axes/YAxis' {
  import * as React from 'react';
  
  interface YAxisProps {
    axisAt: 'bottom' | 'top' | 'left' | 'right' | number;
    orient: 'top' | 'bottom' | 'left' | 'right';
    ticks?: number;
    tickFormat?: (value: any) => string;
    stroke?: string;
    tickStroke?: string;
    tickLabelFill?: string;
  }
  
  const YAxis: React.FC<YAxisProps>;
  export default YAxis;
}

declare module 'react-stockcharts/lib/plot/CandlestickSeries' {
  import * as React from 'react';
  
  interface CandlestickSeriesProps {
    width?: number | ((props: { widthRatio: number }) => number);
    widthRatio?: number;
    classNames?: {
      [key: string]: string;
    };
    fill?: string | ((data: any) => string);
    wickStroke?: string | ((data: any) => string);
    stroke?: string | ((data: any) => string);
  }
  
  const CandlestickSeries: React.FC<CandlestickSeriesProps>;
  export default CandlestickSeries;
}

declare module 'react-stockcharts/lib/coordinates/MouseCoordinateX' {
  import * as React from 'react';
  
  interface MouseCoordinateXProps {
    at: 'bottom' | 'top' | 'left' | 'right' | number;
    orient: 'top' | 'bottom' | 'left' | 'right';
    displayFormat: (value: any) => string;
  }
  
  const MouseCoordinateX: React.FC<MouseCoordinateXProps>;
  export default MouseCoordinateX;
}

declare module 'react-stockcharts/lib/coordinates/MouseCoordinateY' {
  import * as React from 'react';
  
  interface MouseCoordinateYProps {
    at: 'bottom' | 'top' | 'left' | 'right' | number;
    orient: 'top' | 'bottom' | 'left' | 'right';
    displayFormat: (value: any) => string;
  }
  
  const MouseCoordinateY: React.FC<MouseCoordinateYProps>;
  export default MouseCoordinateY;
}

declare module 'react-stockcharts/lib/interactive/CrossHairCursor' {
  import * as React from 'react';
  
  interface CrossHairCursorProps {
    stroke?: string;
    strokeDasharray?: string;
  }
  
  const CrossHairCursor: React.FC<CrossHairCursorProps>;
  export default CrossHairCursor;
}

declare module 'react-stockcharts/lib/tooltip/OHLCTooltip' {
  import * as React from 'react';
  
  interface OHLCTooltipProps {
    origin: [number, number];
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
  
  const OHLCTooltip: React.FC<OHLCTooltipProps>;
  export default OHLCTooltip;
}

declare module 'react-stockcharts/lib/scale' {
  interface ScaleProviderResult {
    data: any[];
    xScale: any;
    xAccessor: (data: any) => any;
    displayXAccessor: (data: any) => any;
  }

  interface ScaleProviderFunction {
    (data: any[]): ScaleProviderResult;
    inputDateAccessor: (fn: (d: any) => any) => ScaleProviderFunction;
  }

  const discontinuousTimeScaleProvider: (options?: any) => ScaleProviderFunction;
  export { discontinuousTimeScaleProvider };
}

declare module 'react-stockcharts/lib/helper' {
  const fitWidth: <P>(
    component: React.ComponentType<P>,
    options?: {
      minWidth?: number;
      maxWidth?: number;
    }
  ) => React.ComponentType<P>;
  
  export { fitWidth };
}
