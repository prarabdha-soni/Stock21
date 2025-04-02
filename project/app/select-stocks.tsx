import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStockStore } from '../store/stockStore';
import { ArrowLeft, TrendingUp, TrendingDown, Check, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 2; // 2 columns per row with 16px padding on each side

export default function SelectStocksScreen() {
  const router = useRouter();
  const { stocks, selectedStocks, toggleStock } = useStockStore();
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [timeUntilMarket, setTimeUntilMarket] = useState('');

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date();
      const marketOpen = new Date(now);
      marketOpen.setHours(9, 15, 0);
      const marketClose = new Date(now);
      marketClose.setHours(15, 30, 0);

      setIsMarketOpen(now >= marketOpen && now <= marketClose);

      if (now < marketOpen) {
        const diff = marketOpen.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilMarket(`${hours}h ${minutes}m until market opens`);
      } else if (now > marketClose) {
        setTimeUntilMarket('Market closed for today');
      } else {
        const diff = marketClose.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilMarket(`${hours}h ${minutes}m until market closes`);
      }
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Categorize stocks
  const upperCircuitStocks = stocks.filter(stock => stock.changePercent >= 20);
  const lowerCircuitStocks = stocks.filter(stock => stock.changePercent <= -20);
  const closePositiveStocks = stocks.filter(stock => stock.changePercent > 0 && stock.changePercent < 20);
  const closeNegativeStocks = stocks.filter(stock => stock.changePercent < 0 && stock.changePercent > -20);

  const renderStockCard = (stock) => {
    const isSelected = selectedStocks.some(s => s.symbol === stock.symbol);
    const canSelect = selectedStocks.length < 11 || isSelected;

    return (
      <TouchableOpacity
        key={stock.symbol}
        style={[
          styles.stockCard,
          isSelected && styles.selectedCard,
          !canSelect && styles.disabledCard
        ]}
        onPress={() => canSelect && toggleStock(stock.symbol)}
        disabled={!canSelect}
      >
        <View style={styles.stockHeader}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          {isSelected && <Check size={16} color="#059669" />}
        </View>
        <Text style={styles.stockPrice}>₹{stock.lastPrice.toFixed(2)}</Text>
        <Text style={[
          styles.stockChange,
          stock.changePercent > 0 ? styles.positiveChange : styles.negativeChange
        ]}>
          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = (title, stocks, color) => (
    <View style={styles.categoryContainer}>
      <View style={[styles.categoryHeader, { backgroundColor: color }]}>
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.stockCount}>{stocks.length} Stocks</Text>
      </View>
      <View style={styles.stocksGrid}>
        {stocks.map(renderStockCard)}
      </View>
    </View>
  );

  const handleSubmit = () => {
    if (selectedStocks.length === 11) {
      router.push('/live-points');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Stocks</Text>
      </View>

      <View style={styles.marketStatus}>
        <View style={[styles.statusIndicator, isMarketOpen ? styles.statusOpen : styles.statusClosed]} />
        <Text style={styles.marketStatusText}>
          {isMarketOpen ? 'Market Open' : 'Market Closed'}
        </Text>
        <Text style={styles.timeText}>{timeUntilMarket}</Text>
      </View>

      <View style={styles.selectionInfo}>
        <Text style={styles.selectionCount}>
          Selected: {selectedStocks.length}/11 stocks
        </Text>
        <Text style={styles.pointsInfo}>
          • Upper/Lower Circuit: 25 points{'\n'}
          • Close Positive/Negative: 5 points
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {renderCategory('Upper Circuit (20%+)', upperCircuitStocks, '#dcfce7')}
        {renderCategory('Lower Circuit (-20%)', lowerCircuitStocks, '#fee2e2')}
        {renderCategory('Close Positive', closePositiveStocks, '#dbeafe')}
        {renderCategory('Close xxxx', closeNegativeStocks, '#fef3c7')}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedStocks.length !== 11 && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={selectedStocks.length !== 11}
      >
        <Text style={styles.submitButtonText}>
          {selectedStocks.length === 11 ? 'Submit Selection' : `Select ${11 - selectedStocks.length} More`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  marketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f1f5f9',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOpen: {
    backgroundColor: '#059669',
  },
  statusClosed: {
    backgroundColor: '#dc2626',
  },
  marketStatusText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectionInfo: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  selectionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointsInfo: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockCount: {
    fontSize: 14,
    color: '#64748b',
  },
  stocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  stockCard: {
    width: COLUMN_WIDTH - 16,
    margin: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#2563eb',
  },
  disabledCard: {
    opacity: 0.5,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockPrice: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  stockChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveChange: {
    color: '#059669',
  },
  negativeChange: {
    color: '#dc2626',
  },
  submitButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});