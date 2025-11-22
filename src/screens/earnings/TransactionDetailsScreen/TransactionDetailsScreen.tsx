import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EarningsStackParamList } from '../../../navigation/types';
import { styles } from './TransactionDetailsScreen.styles';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

type TransactionDetailsRouteProp = RouteProp<
  EarningsStackParamList,
  'TransactionDetails'
>;

// Mock transaction data
const MOCK_TRANSACTION = {
  id: 'TXN123456789',
  customerName: 'Amit Singh',
  customerImage: 'https://via.placeholder.com/50',
  customerPhone: '+91-98765-43210',
  jobTitle: 'House Wiring Installation',
  jobDescription:
    'Complete house wiring including MCB board installation, power outlets, and light fixtures',
  amount: 2400,
  date: '12 Nov 2024',
  time: '4:35 PM',
  status: 'completed',
  paymentMethod: 'Cash',
  location: 'Model Town, Ludhiana',
  duration: '3 days',
  agreedAmount: 2700,
  discount: 300,
  otpVerified: true,
  completionDate: '12 Nov 2024, 4:30 PM',
  startDate: '10 Nov 2024, 9:00 AM',
  receiptNumber: 'RCP-2024-1234',
};

const TransactionDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TransactionDetailsRouteProp>();
  const { transactionId } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Transaction Receipt\n\nReceipt #: ${MOCK_TRANSACTION.receiptNumber}\nJob: ${MOCK_TRANSACTION.jobTitle}\nAmount: ₹${MOCK_TRANSACTION.amount}\nDate: ${MOCK_TRANSACTION.date}\n\nSkillProof - Connect with skilled workers`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadReceipt = () => {
    // TODO: Implement download receipt
    alert('Receipt downloaded successfully!');
  };

  const handleContactCustomer = () => {
    alert(`Calling ${MOCK_TRANSACTION.customerPhone}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          variant="simple"
          showBack
          onBackPress={handleBack}
          title="Transaction Details"
          showMore
          onMorePress={handleShare}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <Icon name="check-circle" size={64} color={COLORS.success} />
            </View>
            <Text style={styles.statusTitle}>Payment Received</Text>
            <Text style={styles.amountValue}>
              ₹{MOCK_TRANSACTION.amount.toLocaleString()}
            </Text>
            <View style={styles.statusBadge}>
              <Icon name="shield-check" size={16} color={COLORS.success} />
              <Text style={styles.statusBadgeText}>OTP Verified</Text>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>

            <View style={styles.customerCard}>
              <Image
                source={{ uri: MOCK_TRANSACTION.customerImage }}
                style={styles.customerImage}
              />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>
                  {MOCK_TRANSACTION.customerName}
                </Text>
                <Text style={styles.customerPhone}>
                  {MOCK_TRANSACTION.customerPhone}
                </Text>
                <View style={styles.customerLocation}>
                  <Icon
                    name="map-marker"
                    size={14}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.customerLocationText}>
                    {MOCK_TRANSACTION.location}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleContactCustomer}
                activeOpacity={0.7}
              >
                <Icon name="phone" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Job Title</Text>
                <Text style={styles.detailValue}>
                  {MOCK_TRANSACTION.jobTitle}
                </Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
              </View>
              <Text style={styles.detailDescription}>
                {MOCK_TRANSACTION.jobDescription}
              </Text>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>
                  {MOCK_TRANSACTION.duration}
                </Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Started On</Text>
                <Text style={styles.detailValue}>
                  {MOCK_TRANSACTION.startDate}
                </Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Completed On</Text>
                <Text style={styles.detailValue}>
                  {MOCK_TRANSACTION.completionDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Breakdown</Text>

            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Agreed Amount</Text>
                <Text style={styles.breakdownValue}>
                  ₹{MOCK_TRANSACTION.agreedAmount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Discount Given</Text>
                <Text style={[styles.breakdownValue, { color: COLORS.error }]}>
                  -₹{MOCK_TRANSACTION.discount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.breakdownDivider} />

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownTotalLabel}>Total Received</Text>
                <Text style={styles.breakdownTotalValue}>
                  ₹{MOCK_TRANSACTION.amount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.paymentMethodRow}>
                <Icon name="cash" size={20} color={COLORS.success} />
                <Text style={styles.paymentMethodText}>
                  Paid via {MOCK_TRANSACTION.paymentMethod}
                </Text>
              </View>
            </View>
          </View>

          {/* Transaction Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transaction Information</Text>

            <View style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <Icon
                    name="identifier"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.transactionLabel}>Transaction ID</Text>
                </View>
                <Text style={styles.transactionValue}>
                  {MOCK_TRANSACTION.id}
                </Text>
              </View>

              <View style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <Icon name="receipt" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.transactionLabel}>Receipt Number</Text>
                </View>
                <Text style={styles.transactionValue}>
                  {MOCK_TRANSACTION.receiptNumber}
                </Text>
              </View>

              <View style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <Icon
                    name="calendar"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.transactionLabel}>Date & Time</Text>
                </View>
                <Text style={styles.transactionValue}>
                  {MOCK_TRANSACTION.date}, {MOCK_TRANSACTION.time}
                </Text>
              </View>

              <View style={styles.transactionRow}>
                <View style={styles.transactionLeft}>
                  <Icon name="shield-check" size={20} color={COLORS.success} />
                  <Text style={styles.transactionLabel}>OTP Verification</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Icon name="check" size={14} color={COLORS.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Download Receipt Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadReceipt}
              activeOpacity={0.7}
            >
              <Icon name="download" size={20} color={COLORS.primary} />
              <Text style={styles.downloadButtonText}>Download Receipt</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="information" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              This transaction is securely recorded and cannot be modified. Keep
              your receipt for future reference.
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetailsScreen;
