import { Stock } from '../store/stockStore';

// Helper function to generate random change percentage within a range
function getRandomChange(min: number, max: number): number {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function fetchNifty500Stocks(): Promise<Stock[]> {
  // Base stocks data
  const baseStocks = [
    { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd.', lastPrice: 2432.80 },
    { symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd.', lastPrice: 3521.15 },
    { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd.', lastPrice: 1678.90 },
    { symbol: 'INFY', companyName: 'Infosys Ltd.', lastPrice: 1432.60 },
    { symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd.', lastPrice: 945.30 },
    { symbol: 'HINDUNILVR', companyName: 'Hindustan Unilever Ltd.', lastPrice: 2567.45 },
    { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel Ltd.', lastPrice: 937.55 },
    { symbol: 'SBIN', companyName: 'State Bank of India', lastPrice: 624.70 },
    { symbol: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank Ltd.', lastPrice: 1789.30 },
    { symbol: 'ASIANPAINT', companyName: 'Asian Paints Ltd.', lastPrice: 3245.60 },
    { symbol: 'MARUTI', companyName: 'Maruti Suzuki India Ltd.', lastPrice: 10234.75 },
    { symbol: 'HCLTECH', companyName: 'HCL Technologies Ltd.', lastPrice: 1245.30 },
    { symbol: 'AXISBANK', companyName: 'Axis Bank Ltd.', lastPrice: 876.45 },
    { symbol: 'ITC', companyName: 'ITC Ltd.', lastPrice: 439.85 },
    { symbol: 'WIPRO', companyName: 'Wipro Ltd.', lastPrice: 432.15 },
    { symbol: 'BAJFINANCE', companyName: 'Bajaj Finance Ltd.', lastPrice: 6789.45 },
    { symbol: 'ADANIENT', companyName: 'Adani Enterprises Ltd.', lastPrice: 2456.30 },
    { symbol: 'TATASTEEL', companyName: 'Tata Steel Ltd.', lastPrice: 134.55 },
    { symbol: 'NTPC', companyName: 'NTPC Ltd.', lastPrice: 245.70 },
    { symbol: 'POWERGRID', companyName: 'Power Grid Corporation Ltd.', lastPrice: 267.85 }
  ];

  // Shuffle stocks
  const shuffledStocks = shuffleArray([...baseStocks]);
  
  // Split into 4 groups of 5 stocks each
  const stocks: Stock[] = shuffledStocks.map((stock, index) => {
    let changePercent: number;
    
    if (index < 5) {
      // Upper circuit (20% to 25%)
      changePercent = getRandomChange(20, 25);
    } else if (index < 10) {
      // Lower circuit (-25% to -20%)
      changePercent = getRandomChange(-25, -20);
    } else if (index < 15) {
      // Close positive (0% to 19.99%)
      changePercent = getRandomChange(0.01, 19.99);
    } else {
      // Close negative (-19.99% to -0.01%)
      changePercent = getRandomChange(-19.99, -0.01);
    }

    const change = +(stock.lastPrice * (changePercent / 100)).toFixed(2);

    return {
      ...stock,
      change,
      changePercent,
      selected: false,
      points: 0
    };
  });

  return stocks;
}