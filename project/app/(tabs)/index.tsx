import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl, Keyboard } from 'react-native';
import { useStockStore, Stock } from '../../store/stockStore';
import { WifiOff, Search, X } from 'lucide-react-native';
import { fetchNifty500Stocks } from '../../services/stockService';
import { debounce } from 'lodash';

export default function MarketScreen() {
  const { 
    stocks, 
    setStocks, 
    toggleStock, 
    setPoints, 
    selectedStocks,
    error,
    connectionStatus,
    retryConnection
  } = useStockStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const stocks = await fetchNifty500Stocks();
      setStocks(stocks);
    } catch (err) {
      useStockStore.getState().setError('Failed to fetch stocks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStocks();
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 300),
    []
  );

  const clearSearch = () => {
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPoints = selectedStocks.reduce((sum, stock) => sum + stock.points, 0);

  const renderStock = ({ item }: { item: Stock }) => {
    const isSelected = item.selected;
    const canSelect = selectedStocks.length < 11 || isSelected;

    return (
      <TouchableOpacity
        style={[
          styles.stockCard,
          isSelected && styles.selectedCard,
          !canSelect && styles.disabledCard,
        ]}
        onPress={() => {
          canSelect && toggleStock(item.symbol);
          Keyboard.dismiss();
        }}
        disabled={!canSelect}>
        <View style={styles.stockInfo}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.companyName}>{item.companyName}</Text>
          <Text style={styles.price}>₹{item.lastPrice.toFixed(2)}</Text>
          <Text
            style={[
              styles.change,
              item.changePercent > 0 ? styles.positive : styles.negative,
            ]}>
            {item.changePercent > 0 ? '+' : ''}
            {item.changePercent.toFixed(2)}%
          </Text>
        </View>
        {isSelected && (
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Points (0-5)</Text>
            <TextInput
              style={styles.pointsInput}
              keyboardType="numeric"
              value={item.points.toString()}
              onChangeText={(text) => {
                const points = parseInt(text) || 0;
                if (points >= 0 && points <= 5) {
                  setPoints(item.symbol, points);
                }
              }}
              maxLength={1}
              placeholder="0-5"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stocks..."
          value={searchQuery}
          onChangeText={debouncedSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Selected</Text>
          <Text style={[
            styles.statValue,
            selectedStocks.length === 11 ? styles.statComplete : styles.statIncomplete
          ]}>
            {selectedStocks.length}/11
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Total Points</Text>
          <Text style={[
            styles.statValue,
            totalPoints === 55 ? styles.statComplete : styles.statIncomplete
          ]}>
            {totalPoints}/55
          </Text>
        </View>
      </View>
    </View>
  );

  if (connectionStatus === 'disconnected') {
    return (
      <View style={styles.centerContainer}>
        <WifiOff size={48} color="#64748b" />
        <Text style={styles.errorText}>Connection lost</Text>
        <Text style={styles.errorSubtext}>Please check your internet connection</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading stocks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchStocks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredStocks}
        renderItem={renderStock}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainerFocused: {
    borderColor: '#2563eb',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statComplete: {
    color: '#16a34a',
  },
  statIncomplete: {
    color: '#2563eb',
  },
  list: {
    padding: 16,
  },
  stockCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#e0f2fe',
    borderColor: '#2563eb',
    borderWidth: 1,
  },
  disabledCard: {
    opacity: 0.5,
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#16a34a',
  },
  negative: {
    color: '#dc2626',
  },
  pointsContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  pointsInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    width: 50,
    textAlign: 'center',
  },
  errorText: {
    color: '#64748b',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});