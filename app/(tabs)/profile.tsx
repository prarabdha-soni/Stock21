import { View, Text, StyleSheet, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Prarabdha Soni</Text>
        <Text style={styles.email}>prarabdha21@gmail.com</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Contests Played</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Contests Won</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹12,500</Text>
          <Text style={styles.statLabel}>Total Winnings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Performance</Text>
        <View style={styles.performanceCard}>
          <Text style={styles.contestName}>Daily Nifty Challenge</Text>
          <Text style={styles.contestDate}>March 15, 2024</Text>
          <Text style={styles.contestResult}>Rank: 42 / 1000</Text>
        </View>
        <View style={styles.performanceCard}>
          <Text style={styles.contestName}>Weekly Market Masters</Text>
          <Text style={styles.contestDate}>March 12, 2024</Text>
          <Text style={styles.contestResult}>Rank: 15 / 500</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 32,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginTop: -20,
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
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  performanceCard: {
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
  contestName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contestDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  contestResult: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
});