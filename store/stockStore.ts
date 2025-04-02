import { create } from 'zustand';

export interface Stock {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  selected: boolean;
  points: number;
}

interface StockState {
  stocks: Stock[];
  selectedStocks: Stock[];
  isLoading: boolean;
  error: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  setStocks: (stocks: Stock[]) => void;
  toggleStock: (symbol: string) => void;
  setPoints: (symbol: string, points: number) => void;
  resetSelection: () => void;
  setError: (error: string | null) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
  retryConnection: () => Promise<void>;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: [],
  selectedStocks: [],
  isLoading: false,
  error: null,
  connectionStatus: 'connected',
  setStocks: (stocks) => set({ stocks }),
  toggleStock: (symbol) =>
    set((state) => {
      const stockIndex = state.stocks.findIndex((s) => s.symbol === symbol);
      if (stockIndex === -1) return state;

      const currentlySelected = state.stocks[stockIndex].selected;
      const selectedCount = state.stocks.filter(s => s.selected).length;

      // If trying to select and already have 11 stocks
      if (!currentlySelected && selectedCount >= 11) {
        return state;
      }

      const newStocks = [...state.stocks];
      newStocks[stockIndex] = {
        ...newStocks[stockIndex],
        selected: !currentlySelected,
        points: !currentlySelected ? 0 : newStocks[stockIndex].points, // Reset points when deselecting
      };

      const selectedStocks = newStocks.filter((stock) => stock.selected);

      return { stocks: newStocks, selectedStocks };
    }),
  setPoints: (symbol, points) =>
    set((state) => {
      const stockIndex = state.stocks.findIndex((s) => s.symbol === symbol);
      if (stockIndex === -1) return state;

      // Calculate total points excluding current stock
      const totalPointsExcludingCurrent = state.selectedStocks.reduce(
        (sum, stock) => sum + (stock.symbol !== symbol ? stock.points : 0),
        0
      );

      // Check if adding these points would exceed 55
      if (totalPointsExcludingCurrent + points > 55) {
        return state;
      }

      const newStocks = [...state.stocks];
      newStocks[stockIndex] = {
        ...newStocks[stockIndex],
        points,
      };

      const selectedStocks = newStocks.filter((stock) => stock.selected);

      return { stocks: newStocks, selectedStocks };
    }),
  resetSelection: () =>
    set((state) => ({
      stocks: state.stocks.map((stock) => ({ ...stock, selected: false, points: 0 })),
      selectedStocks: [],
    })),
  setError: (error) => set({ error }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  retryConnection: async () => {
    const { setConnectionStatus, setError } = get();
    try {
      setConnectionStatus('reconnecting');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectionStatus('connected');
      setError(null);
    } catch (error) {
      setConnectionStatus('disconnected');
      setError('Failed to reconnect. Please check your internet connection.');
    }
  },
}));