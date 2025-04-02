import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Users, Clock } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface Contest {
  id: string;
  prizePool: number;
  entryFee: number;
  totalSpots: number;
  spotsLeft: number;
  startTime: string;
  firstPrize: number;
  guaranteed: boolean;
}

const generateUpcomingContests = (): Contest[] => {
  const contests: Contest[] = [];
  
  // Generate contests for April 16-19
  for (let i = 16; i <= 19; i++) {
    contests.push({
      id: `contest-${i}`,
      prizePool: Math.floor(Math.random() * 900000) + 100000, // Random prize pool between 1-9.5L
      entryFee: Math.floor(Math.random() * 90) + 10, // Random entry fee between 10-100
      totalSpots: Math.floor(Math.random() * 50000) + 10000, // Random total spots
      spotsLeft: Math.floor(Math.random() * 5000) + 5000, // Random spots left
      startTime: `Apr ${i}, 9:15 AM`,
      firstPrize: Math.floor(Math.random() * 90000) + 10000, // Random first prize
      guaranteed: Math.random() > 0.7, // 30% chance of being guaranteed
    });
  }

  return contests;
};

export default function HomeScreen() {
  const router = useRouter();
  const [contests] = useState<Contest[]>(generateUpcomingContests());
  const [activeTab, setActiveTab] = useState<'live' | 'playing' | 'completed' | 'upcoming'>('upcoming');

  const renderContest = ({ item }: { item: Contest }) => (
    <TouchableOpacity 
      style={styles.contestCard}
      onPress={() => router.push('/create-team')}
    >
      <View style={styles.contestHeader}>
        <View style={styles.prizeContainer}>
          <Trophy size={24} color="#2563eb" />
          <Text style={styles.prizePool}>₹{(item.prizePool / 100000).toFixed(1)} Lakhs</Text>
        </View>
        {item.guaranteed && (
          <View style={styles.guaranteedBadge}>
            <Text style={styles.guaranteedText}>Guaranteed</Text>
          </View>
        )}
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Users size={16} color="#64748b" />
          <Text style={styles.statText}>{item.spotsLeft} / {item.totalSpots}</Text>
        </View>
        <View style={styles.stat}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.statText}>{item.startTime}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.firstPrize}>₹{(item.firstPrize / 1000).toFixed(1)}K</Text>
          <Text style={styles.prizeLabel}>First Prize</Text>
        </View>
        <View style={styles.upcomingBadge}>
          <Text style={styles.upcomingText}>UPCOMING</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stock Trader Pro</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'live' && styles.activeTab]}
          onPress={() => setActiveTab('live')}
        >
          <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>Live</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'playing' && styles.activeTab]}
          onPress={() => setActiveTab('playing')}
        >
          <Text style={[styles.tabText, activeTab === 'playing' && styles.activeTabText]}>Playing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contests}
        renderItem={renderContest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  contestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizePool: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  guaranteedBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guaranteedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    color: '#64748b',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firstPrize: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  prizeLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  upcomingBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  upcomingText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
});