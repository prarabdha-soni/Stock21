import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Users, Timer } from 'lucide-react-native';

interface Contest {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  totalSpots: number;
  spotsLeft: number;
  startTime: string;
  guaranteed: boolean;
  maxTeams: number;
  firstPrize: number;
  winnerPercentage: number;
}

const liveContests: Contest[] = [
  {
    id: '1',
    name: 'Mega Contest',
    entryFee: 49,
    prizePool: 1000000,
    totalSpots: 229951,
    spotsLeft: 106342,
    startTime: 'Ongoing',
    guaranteed: true,
    maxTeams: 20,
    firstPrize: 100000,
    winnerPercentage: 57,
  },
];

const upcomingContests: Contest[] = [
  {
    id: '2',
    name: 'Winner Takes All',
    entryFee: 99,
    prizePool: 500000,
    totalSpots: 35612,
    spotsLeft: 22356,
    startTime: 'Tomorrow, 8 AM',
    guaranteed: true,
    maxTeams: 10,
    firstPrize: 250000,
    winnerPercentage: 35,
  },
  {
    id: '3',
    name: 'Random Contest',
    entryFee: Math.floor(Math.random() * 100) + 10, // Random fee between 10-100
    prizePool: Math.floor(Math.random() * 500000) + 100000, // Random prize pool
    totalSpots: Math.floor(Math.random() * 10000) + 5000, // Random total spots
    spotsLeft: Math.floor(Math.random() * 5000) + 1000, // Random available spots
    startTime: 'Tomorrow, 10 AM',
    guaranteed: Math.random() > 0.5, // Randomly guaranteed or not
    maxTeams: Math.floor(Math.random() * 10) + 5, // Random max teams
    firstPrize: Math.floor(Math.random() * 50000) + 10000, // Random first prize
    winnerPercentage: Math.floor(Math.random() * 50) + 10, // Random winner %
  },
];

export default function ContestsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('Live');

  const getFilteredContests = () => {
    switch (selectedTab) {
      case 'Live':
        return liveContests;
      case 'Upcoming':
        return upcomingContests;
      default:
        return [];
    }
  };

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

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Users size={16} color="#64748b" />
          <Text style={styles.statLabel}>
            {item.spotsLeft} / {item.totalSpots}
          </Text>
        </View>
        <View style={styles.stat}>
          <Timer size={16} color="#64748b" />
          <Text style={styles.statLabel}>{item.startTime}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${((item.totalSpots - item.spotsLeft) / item.totalSpots) * 100}%` }
          ]} 
        />
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.winnerInfo}>
            ₹{(item.firstPrize / 1000).toFixed(1)}K
          </Text>
          <Text style={styles.winnerLabel}>First Prize</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.joinButton,
            item.entryFee === 0 && styles.freeButton
          ]}
        >
          <Text style={styles.joinButtonText}>
            {item.entryFee === 0 ? 'FREE' : `₹${item.entryFee}`}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Live' && styles.activeTab]}
          onPress={() => setSelectedTab('Live')}
        >
          <Text style={[styles.tabText, selectedTab === 'Live' && styles.activeTabText]}>Live</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Playing' && styles.activeTab]}
          onPress={() => setSelectedTab('Playing')}
        >
          <Text style={[styles.tabText, selectedTab === 'Playing' && styles.activeTabText]}>Playing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Completed' && styles.activeTab]}
          onPress={() => setSelectedTab('Completed')}
        >
          <Text style={[styles.tabText, selectedTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('Upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredContests()}
        renderItem={renderContest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F24',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(10, 15, 36, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2138',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#151B32',
  },
  activeTab: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-SemiBold',
  },
  activeTabText: {
    color: 'white',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  list: {
    padding: 16,
  },
  contestCard: {
    backgroundColor: '#151B32',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#252C47',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizePool: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#E2E8F0',
    fontFamily: 'Inter-ExtraBold',
    textShadowColor: 'rgba(255,255,255,0.1)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  guaranteedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  guaranteedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    marginLeft: 8,
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#252C47',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E2E8F0',
    fontFamily: 'Inter-Black',
    letterSpacing: 0.5,
  },
  winnerLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  joinButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  freeButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 0.5,
  },
  // Add these new styles
  glowContainer: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    opacity: 0.3,
    zIndex: -1,
  },
  cardPattern: {
    position: 'absolute',
    opacity: 0.05,
    transform: [{ rotate: '15deg' }],
  },
});