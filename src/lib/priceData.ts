import { subDays, format } from 'date-fns';

export interface CandleData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function generatePriceHistory(basePrice: number, days: number = 90): CandleData[] {
  const result: CandleData[] = [];
  let currentDate = new Date();
  let currentPrice = basePrice;
  let currentVolume = 1000;

  for (let i = days; i >= 0; i--) {
    const date = subDays(currentDate, i);
    
    // Generate some random price movement
    const open = currentPrice;
    const volatility = 0.02; // 2% daily volatility
    const changePercent = (Math.random() * 2 - 1) * volatility;
    const close = open * (1 + changePercent);
    
    // Generate high and low with some reasonable range
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    // Update current price for next iteration
    currentPrice = close;
    
    // Add some volume variation
    currentVolume = Math.max(500, currentVolume * (0.9 + Math.random() * 0.2));
    
    result.push({
      date,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.round(currentVolume)
    });
  }
  
  return result;
}

export function getLatestPrice(data: CandleData[]): number {
  return data[data.length - 1]?.close || 0;
}

export function getPriceChangePercent(data: CandleData[], days: number = 1): number {
  if (data.length <= days) return 0;
  const currentClose = data[data.length - 1].close;
  const pastClose = data[data.length - 1 - days].close;
  return ((currentClose - pastClose) / pastClose) * 100;
}
