import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStockStore } from '../store/stockStore';
import { ArrowLeft, TrendingUp, TrendingDown, Plus } from 'lucide-react-native';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 2; // 2 columns with 16px padding on sides

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
  const bullStocks = stocks.filter(stock => stock.changePercent > 0);
  const bearStocks = stocks.filter(stock => stock.changePercent <= 0);

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
          <Text style={styles.stockPrice}>₹{stock.lastPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.changeRow}>
          <Text style={[
            styles.stockChange,
            stock.changePercent > 0 ? styles.positiveChange : styles.negativeChange
          ]}>
            {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </Text>
          {isSelected ? (
            <Text style={styles.selectedText}>Added</Text>
          ) : (
            <Plus size={16} color="#2563eb" />
          )}
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.marketStatusText}>Market Closed</Text>
        <Text style={styles.timeText}>{timeUntilMarket}</Text>
      </View>

      <View style={styles.selectionInfo}>
        <Text style={styles.selectionCount}>
          Selected: {selectedStocks.length}/11 stocks
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            <View style={[styles.columnHeader, styles.bullHeader]}>
              <View style={styles.columnTitleContainer}>
                <TrendingUp size={16} color="#059669" />
                <Text style={styles.columnTitle}>Bull</Text>
              </View>
              <Text style={styles.stockCount}>{bullStocks.length} Stocks</Text>
            </View>
            {bullStocks.map(renderStockCard)}
          </View>

          <View style={styles.column}>
            <View style={[styles.columnHeader, styles.bearHeader]}>
              <View style={styles.columnTitleContainer}>
                <TrendingDown size={16} color="#dc2626" />
                <Text style={styles.columnTitle}>Bear</Text>
              </View>
              <Text style={styles.stockCount}>{bearStocks.length} Stocks</Text>
            </View>
            {bearStocks.map(renderStockCard)}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedStocks.length !== 11 && styles.submitButtonDisabled
        ]}
        onPress={() => router.push('/live-points')}
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
  },
  scrollView: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  columnHeader: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullHeader: {
    backgroundColor: '#dcfce7',
  },
  bearHeader: {
    backgroundColor: '#fee2e2',
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stockCount: {
    fontSize: 14,
    color: '#64748b',
  },
  stockCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  stockPrice: {
    fontSize: 14,
    color: '#64748b',
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  selectedText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
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