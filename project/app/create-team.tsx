import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useStockStore } from '../store/stockStore';
import { ArrowLeft } from 'lucide-react-native';

export default function CreateTeamScreen() {
  const router = useRouter();
  const { selectedStocks, totalPoints } = useStockStore();

  const isTeamComplete = selectedStocks.length === 11 && totalPoints === 55;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Rules</Text>
      </View>

      <View style={styles.rulesContainer}>
        <Text style={styles.rulesTitle}>Contest Rules</Text>
        <Text style={styles.rule}>• Select exactly 11 stocks</Text>
        <Text style={styles.rule}>• Allocate 55 points across selected stocks</Text>
        <Text style={styles.rule}>• Each stock can have 0-5 points</Text>
        <Text style={styles.rule}>• Points are multiplied by stock's daily % change</Text>
        <Text style={styles.rule}>• Highest total score wins the contest</Text>
      </View>

      <TouchableOpacity 
        style={[styles.selectStocksButton]}
        onPress={() => router.push('/select-stocks')}
      >
        <Text style={styles.selectStocksButtonText}>Join Contest</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity 
        style={[styles.joinButton, !isTeamComplete && styles.joinButtonDisabled]}
        disabled={!isTeamComplete}
      >
        <Text style={styles.joinButtonText}>Join Contest</Text>
      </TouchableOpacity> */}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  complete: {
    color: '#059669',
  },
  incomplete: {
    color: '#2563eb',
  },
  rulesContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rule: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  selectStocksButton: {
    backgroundColor: '#eff6ff',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  selectStocksButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#2563eb',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});