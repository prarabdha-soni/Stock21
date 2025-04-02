import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Users, Timer } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface Contest {
  id: string;
  name: string;
  entryFee: number;
  prizePool: number;
  totalSpots: number;
  spotsLeft: number;
  startTime: string;
  startDate: Date;
  endDate: Date;
  guaranteed: boolean;
  maxTeams: number;
  firstPrize: number;
  winnerPercentage: number;
  status: 'upcoming' | 'live' | 'playing' | 'completed';
  isPlaying?: boolean;
}

// Helper function to generate random future date
const getRandomFutureDate = (startDay: number) => {
  const date = new Date();
  date.setDate(startDay);
  date.setHours(9, 15, 0, 0);
  return date;
};

// Helper function to get end date (same day 3:30 PM)
const getEndDate = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setHours(15, 30, 0, 0);
  return endDate;
};

const generateContests = (): Contest[] => {
  const contests: Contest[] = [];
  
  // Upcoming contests starting from April 16
  for (let i = 16; i <= 20; i++) {
    const startDate = getRandomFutureDate(i);
    contests.push({
      id: `upcoming-${i}`,
      name: `Market Masters ${i} April`,
      entryFee: Math.floor(Math.random() * 90) + 10,
      prizePool: Math.floor(Math.random() * 900000) + 100000,
      totalSpots: Math.floor(Math.random() * 50000) + 10000,
      spotsLeft: Math.floor(Math.random() * 5000) + 5000,
      startTime: startDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      startDate,
      endDate: getEndDate(startDate),
      guaranteed: Math.random() > 0.5,
      maxTeams: 20,
      firstPrize: Math.floor(Math.random() * 90000) + 10000,
      winnerPercentage: Math.floor(Math.random() * 30) + 30,
      status: 'upcoming'
    });
  }

  // Add one live contest
  const today = new Date();
  if (today.getHours() >= 9 && today.getHours() < 15) {
    contests.push({
      id: 'live-1',
      name: 'Daily Market Challenge',
      entryFee: 49,
      prizePool: 1000000,
      totalSpots: 50000,
      spotsLeft: 25000,
      startTime: 'Today, 9:15 AM',
      startDate: new Date(today.setHours(9, 15, 0, 0)),
      endDate: new Date(today.setHours(15, 30, 0, 0)),
      guaranteed: true,
      maxTeams: 20,
      firstPrize: 100000,
      winnerPercentage: 50,
      status: 'live'
    });
  }

  return contests;
};

export default function ContestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'live' | 'playing' | 'completed' | 'upcoming'>('live');
  const [contests, setContests] = useState<Contest[]>(generateContests());
  const [playingContests, setPlayingContests] = useState<Contest[]>([]);
  const [completedContests, setCompletedContests] = useState<Contest[]>([]);

  useEffect(() => {
    // Check contest status every minute
    const interval = setInterval(() => {
      const now = new Date();
      
      if (now.getHours() >= 15 && now.getMinutes() >= 30) {
        // Move all live and playing contests to completed
        setContests(prevContests => {
          const completed = prevContests
            .filter(contest => contest.status === 'live')
            .map(contest => ({ ...contest, status: 'completed' }));
          
          setCompletedContests(current => [...current, ...completed]);
          
          return prevContests.filter(contest => contest.status !== 'live');
        });

        setPlayingContests(prev => {
          const completed = prev.map(contest => ({ ...contest, status: 'completed' }));
          setCompletedContests(current => [...current, ...completed]);
          return [];
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleContestJoin = (contest: Contest) => {
    if (contest.status === 'live') {
      // Add to playing contests without changing the original contest status
      setPlayingContests(prev => [...prev, { ...contest, isPlaying: true }]);
      
      // Navigate to team creation
      router.push('/create-team');
    }
  };

  const renderContest = ({ item }: { item: Contest }) => (
    <TouchableOpacity 
      style={styles.contestCard}
      onPress={() => handleContestJoin(item)}
      disabled={item.status !== 'live' || item.isPlaying}
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
            (item.status !== 'live' || item.isPlaying) && styles.disabledButton
          ]}
          disabled={item.status !== 'live' || item.isPlaying}
          onPress={() => handleContestJoin(item)}
        >
          <Text style={styles.joinButtonText}>
            {item.isPlaying ? 'PLAYING' : item.status === 'live' ? `₹${item.entryFee}` : item.status.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filteredContests = (() => {
    switch (activeTab) {
      case 'live':
        return contests.filter(contest => contest.status === 'live');
      case 'playing':
        return playingContests;
      case 'completed':
        return completedContests;
      case 'upcoming':
        return contests.filter(contest => contest.status === 'upcoming');
      default:
        return [];
    }
  })();

  return (
    <View style={styles.container}>
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
        data={filteredContests}
        renderItem={renderContest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'live' ? 'No live contests available' :
               activeTab === 'playing' ? 'No contests being played' :
               activeTab === 'completed' ? 'No completed contests' :
               'No upcoming contests'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    marginLeft: 4,
    color: '#64748b',
    fontSize: 14,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  winnerLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});