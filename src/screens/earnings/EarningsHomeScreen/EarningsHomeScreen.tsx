import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './EarningsHomeScreen.styles';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

interface Transaction {
  id: string;
  customerName: string;
  jobTitle: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending';
  paymentMethod: 'cash';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    customerName: 'Amit Singh',
    jobTitle: 'House Wiring',
    amount: 2400,
    date: '12 Nov',
    time: '4:35 PM',
    status: 'completed',
    paymentMethod: 'cash',
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    jobTitle: 'Fan Installation',
    amount: 800,
    date: '10 Nov',
    time: '2:15 PM',
    status: 'completed',
    paymentMethod: 'cash',
  },
  {
    id: '3',
    customerName: 'Rahul Verma',
    jobTitle: 'Kitchen Wiring',
    amount: 1200,
    date: '8 Nov',
    time: '11:30 AM',
    status: 'pending',
    paymentMethod: 'cash',
  },
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/AuthContext';
import * as api from '../../../services/api';

const CACHE_KEY_EARNINGS = 'worker_earnings_stats';

const EarningsHomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('Nov');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    walletBalance: 0,
    jobsCompleted: 0,
  });

  // Load cache on mount
  React.useEffect(() => {
    loadCache();
  }, []);

  const loadCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY_EARNINGS);
      if (cached) {
        const data = JSON.parse(cached);
        setStats({
          totalEarnings: data.totalEarnings || 0,
          walletBalance: data.walletBalance || 0,
          jobsCompleted: data.jobsCompleted || 0,
        });
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.log('Error loading cache', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEarnings();
    }, []),
  );

  const fetchEarnings = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      // Fetch full stats from new endpoint
      const data = await api.getWorkerStats(user.id);

      if (data) {
        setStats({
          totalEarnings: data.totalEarnings || 0,
          walletBalance: data.totalEarnings || 0,
          jobsCompleted: data.jobsCompleted || 0,
        });
        setTransactions(data.transactions || []);
        // Cache the new data
        await AsyncStorage.setItem(CACHE_KEY_EARNINGS, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSkeleton = () => (
    <View style={{ padding: 16 }}>
      {/* Main Card Skeleton */}
      <View
        style={{
          height: 200,
          backgroundColor: '#E1E9EE',
          borderRadius: 16,
          marginBottom: 24,
          padding: 20,
        }}
      >
        <View
          style={{
            width: 100,
            height: 20,
            backgroundColor: '#CED4DA',
            marginBottom: 10,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            width: 150,
            height: 40,
            backgroundColor: '#CED4DA',
            marginBottom: 20,
            borderRadius: 4,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              width: 80,
              height: 40,
              backgroundColor: '#CED4DA',
              borderRadius: 4,
            }}
          />
          <View
            style={{
              width: 80,
              height: 40,
              backgroundColor: '#CED4DA',
              borderRadius: 4,
            }}
          />
        </View>
      </View>
      {/* Quick Stats Skeleton */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <View
          style={{
            flex: 1,
            height: 80,
            backgroundColor: '#E1E9EE',
            borderRadius: 12,
          }}
        />
        <View
          style={{
            flex: 1,
            height: 80,
            backgroundColor: '#E1E9EE',
            borderRadius: 12,
          }}
        />
      </View>
      {/* List Skeleton */}
      <View
        style={{
          height: 20,
          width: 150,
          backgroundColor: '#E1E9EE',
          marginBottom: 10,
          borderRadius: 4,
        }}
      />
      <View
        style={{
          height: 80,
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          marginBottom: 10,
        }}
      />
      <View
        style={{
          height: 80,
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          marginBottom: 10,
        }}
      />
    </View>
  );

  if (loading && stats.totalEarnings === 0 && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header variant="simple" title="Earnings" />
          {renderSkeleton()}
        </View>
      </SafeAreaView>
    );
  }

  const completedTransactions = transactions.filter(
    t => t.status === 'completed',
  );
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const totalEarnings = stats.totalEarnings;
  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);
  const jobsCompleted = stats.jobsCompleted;
  const averageEarning =
    jobsCompleted > 0 ? Math.round(totalEarnings / jobsCompleted) : 0;

  const handleTransactionPress = (transactionId: string) => {
    navigation.navigate(
      'TransactionDetails' as never,
      { transactionId } as never,
    );
  };

  const handleViewAll = () => {
    navigation.navigate('TransactionHistory' as never);
  };

  const renderTransaction = (transaction: Transaction) => {
    const isPending = transaction.status === 'pending';

    return (
      <TouchableOpacity
        key={transaction.id}
        style={[
          styles.transactionCard,
          isPending && styles.pendingTransactionCard,
        ]}
        onPress={() => handleTransactionPress(transaction.id)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              isPending
                ? { backgroundColor: '#FEF3C7' }
                : { backgroundColor: '#D1FAE5' },
            ]}
          >
            <Icon
              name={isPending ? 'clock-outline' : 'cash'}
              size={24}
              color={isPending ? COLORS.warning : COLORS.success}
            />
          </View>

          <View style={styles.transactionInfo}>
            <Text style={styles.transactionCustomer}>
              {transaction.customerName}
            </Text>
            <Text style={styles.transactionJob}>{transaction.jobTitle}</Text>
            <View style={styles.transactionMeta}>
              <Icon name="calendar" size={12} color={COLORS.textLight} />
              <Text style={styles.transactionDate}>{transaction.date}</Text>
              <Icon
                name="clock-outline"
                size={12}
                color={COLORS.textLight}
                style={{ marginLeft: 8 }}
              />
              <Text style={styles.transactionTime}>{transaction.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              isPending && styles.pendingAmount,
            ]}
          >
            {isPending ? '' : '+'}₹{transaction.amount.toLocaleString()}
          </Text>
          {isPending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending OTP</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          variant="simple"
          title="Earnings"
          rightComponent={
            <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
              <Icon name="download" size={20} color={COLORS.primary} />
              <Text style={styles.downloadText}>Report</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Earnings Card */}
          <LinearGradient
            colors={['#2563EB', '#1E40AF']}
            style={styles.earningsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.earningsHeader}>
              <View>
                <Text style={styles.earningsLabel}>Total Earnings</Text>
                <Text style={styles.earningsMonth}>{selectedMonth} 2025</Text>
              </View>
              <TouchableOpacity
                style={styles.monthSelector}
                activeOpacity={0.7}
              >
                <Icon name="calendar-month" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.earningsValue}>
              ₹{totalEarnings.toLocaleString()}
            </Text>

            <View style={styles.earningsChange}>
              <Icon name="trending-up" size={16} color="#10B981" />
              <Text style={styles.earningsChangeText}>+32% vs last month</Text>
            </View>

            <View style={styles.earningsStats}>
              <View style={styles.earningsStatItem}>
                <Text style={styles.earningsStatValue}>{jobsCompleted}</Text>
                <Text style={styles.earningsStatLabel}>Jobs Done</Text>
              </View>
              <View style={styles.earningsStatDivider} />
              <View style={styles.earningsStatItem}>
                <Text style={styles.earningsStatValue}>₹{averageEarning}</Text>
                <Text style={styles.earningsStatLabel}>Avg/Job</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.quickStatsContainer}>
            <View
              style={[styles.quickStatCard, { backgroundColor: '#FEF3C7' }]}
            >
              <Icon name="clock-outline" size={24} color="#D97706" />
              <Text style={[styles.quickStatValue, { color: '#92400E' }]}>
                ₹{pendingAmount.toLocaleString()}
              </Text>
              <Text style={[styles.quickStatLabel, { color: '#78350F' }]}>
                Pending
              </Text>
            </View>

            <View
              style={[styles.quickStatCard, { backgroundColor: '#DBEAFE' }]}
            >
              <Icon name="wallet-outline" size={24} color="#1E40AF" />
              <Text style={[styles.quickStatValue, { color: '#1E3A8A' }]}>
                ₹{totalEarnings.toLocaleString()}
              </Text>
              <Text style={[styles.quickStatLabel, { color: '#1E40AF' }]}>
                Received
              </Text>
            </View>
          </View>

          {/* Pending Confirmations */}
          {pendingTransactions.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Pending Confirmations ({pendingTransactions.length})
                </Text>
              </View>

              <View style={styles.pendingInfo}>
                <Icon name="alert-circle" size={18} color={COLORS.warning} />
                <Text style={styles.pendingInfoText}>
                  Waiting for customer OTP confirmation
                </Text>
              </View>

              {pendingTransactions.map(renderTransaction)}
            </View>
          )}

          {/* Recent Payments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Payments</Text>
              <TouchableOpacity onPress={handleViewAll} activeOpacity={0.7}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {completedTransactions.map(renderTransaction)}
          </View>

          {/* Earnings Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earnings Breakdown</Text>

            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <View
                    style={[
                      styles.breakdownDot,
                      { backgroundColor: COLORS.success },
                    ]}
                  />
                  <Text style={styles.breakdownLabel}>Completed Jobs</Text>
                </View>
                <Text style={styles.breakdownValue}>
                  ₹{totalEarnings.toLocaleString()}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <View
                    style={[
                      styles.breakdownDot,
                      { backgroundColor: COLORS.warning },
                    ]}
                  />
                  <Text style={styles.breakdownLabel}>
                    Pending Confirmation
                  </Text>
                </View>
                <Text
                  style={[styles.breakdownValue, { color: COLORS.warning }]}
                >
                  ₹{pendingAmount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownTotalLabel}>Total This Month</Text>
                <Text style={styles.breakdownTotalValue}>
                  ₹{(totalEarnings + pendingAmount).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="shield-check" size={20} color={COLORS.success} />
            <Text style={styles.infoText}>
              All transactions are securely tracked. You keep 100% of your
              earnings.
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EarningsHomeScreen;
