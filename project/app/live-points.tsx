import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useStockStore } from '../store/stockStore';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

export default function LivePointsScreen() {
  const { selectedStocks } = useStockStore();
  const [refreshing, setRefreshing] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const calculatePoints = (stock) => {
    if (stock.changePercent >= 20) return 25; // Upper circuit
    if (stock.changePercent <= -20) return 25; // Lower circuit
    if (stock.changePercent > 0) return 5; // Close positive
    if (stock.changePercent < 0) return 5; // Close negative
    return 0;
  };

  const updatePoints = useCallback(() => {
    const points = selectedStocks.reduce((total, stock) => {
      return total + calculatePoints(stock);
    }, 0);
    setTotalPoints(points);
    setLastUpdate(new Date());
  }, [selectedStocks]);

  useEffect(() => {
    updatePoints();
    const interval = setInterval(updatePoints, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updatePoints]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    updatePoints();
    setRefreshing(false);
  }, [updatePoints]);

  const renderStockCard = (stock) => {
    const points = calculatePoints(stock);
    return (
      <View key={stock.symbol} style={styles.stockCard}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockPrice}>₹{stock.lastPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.changeContainer}>
          <View style={[
            styles.changeBadge,
            stock.changePercent > 0 ? styles.positiveBadge : styles.negativeBadge
          ]}>
            {stock.changePercent > 0 ? (
              <TrendingUp size={16} color="#059669" />
            ) : (
              <TrendingDown size={16} color="#dc2626" />
            )}
            <Text style={[
              styles.changeText,
              stock.changePercent > 0 ? styles.positiveText : styles.negativeText
            ]}>
              {stock.changePercent.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{points} pts</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Points</Text>
        <Text style={styles.updateTime}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.totalPoints}>{totalPoints}</Text>
        <Text style={styles.pointsLabel}>Total Points</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.stocksContainer}>
          {selectedStocks.map(renderStockCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 14,
    color: '#64748b',
  },
  scoreCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  totalPoints: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  scrollView: {
    flex: 1,
  },
  stocksContainer: {
    padding: 16,
  },
  stockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockPrice: {
    fontSize: 16,
    color: '#64748b',
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  positiveBadge: {
    backgroundColor: '#dcfce7',
  },
  negativeBadge: {
    backgroundColor: '#fee2e2',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  positiveText: {
    color: '#059669',
  },
  negativeText: {
    color: '#dc2626',
  },
  pointsBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
});