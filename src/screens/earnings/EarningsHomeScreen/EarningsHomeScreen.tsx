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

const EarningsHomeScreen = () => {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState('Nov');

  const completedTransactions = MOCK_TRANSACTIONS.filter(
    t => t.status === 'completed',
  );
  const pendingTransactions = MOCK_TRANSACTIONS.filter(
    t => t.status === 'pending',
  );

  const totalEarnings = completedTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const pendingAmount = pendingTransactions.reduce(
    (sum, t) => sum + t.amount,
    0,
  );
  const jobsCompleted = completedTransactions.length;
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
