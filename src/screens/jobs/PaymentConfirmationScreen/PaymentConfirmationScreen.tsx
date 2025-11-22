import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { JobsStackParamList } from '../../../navigation/types';
import { styles } from './PaymentConfirmationScreen.styles';
import { COLORS } from '../../../utils';

type PaymentConfirmationRouteProp = RouteProp<
  JobsStackParamList,
  'PaymentConfirmation'
>;

// Mock data
const MOCK_CUSTOMER = {
  name: 'Rahul Verma',
  image: 'https://via.placeholder.com/50',
  phone: '+91-98XXX-XX789',
};

const PaymentConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<PaymentConfirmationRouteProp>();
  const { jobId, amount } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const cleaned = value.replace(/[^0-9]/g, '');

    if (cleaned.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = cleaned;
      setOtp(newOtp);

      if (cleaned && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPayment = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);

    // TODO: API call to verify OTP
    setTimeout(() => {
      setIsVerifying(false);
      // Show success state
      setShowSuccess(true);

      // Navigate to earnings after 2 seconds
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'JobsList' as never }],
        });
      }, 2500);
    }, 1500);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    Alert.alert('OTP Resent', "A new OTP has been sent to customer's phone");
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Icon name="check-circle" size={100} color={COLORS.success} />
          </View>

          <Text style={styles.successTitle}>Payment Confirmed!</Text>
          <Text style={styles.successMessage}>
            ₹{amount.toLocaleString()} has been added to your earnings
          </Text>

          <View style={styles.successDetails}>
            <View style={styles.successDetailRow}>
              <Icon
                name="check-circle-outline"
                size={20}
                color={COLORS.success}
              />
              <Text style={styles.successDetailText}>
                Job marked as complete
              </Text>
            </View>
            <View style={styles.successDetailRow}>
              <Icon
                name="check-circle-outline"
                size={20}
                color={COLORS.success}
              />
              <Text style={styles.successDetailText}>Earnings updated</Text>
            </View>
            <View style={styles.successDetailRow}>
              <Icon
                name="check-circle-outline"
                size={20}
                color={COLORS.success}
              />
              <Text style={styles.successDetailText}>Receipt generated</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.successButton}
            onPress={() => {
              navigation.reset({
                index: 1,
                routes: [
                  { name: 'Dashboard' as never },
                  { name: 'Earnings' as never },
                ],
              });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.successButtonText}>View Earnings</Text>
            <Icon name="arrow-right" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.successSecondaryButton}
            onPress={() => navigation.navigate('JobsList' as never)}
            activeOpacity={0.7}
          >
            <Text style={styles.successSecondaryText}>Back to Jobs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Confirmation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="shield-check" size={60} color="#10B981" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Enter Payment OTP</Text>
          <Text style={styles.subtitle}>
            OTP has been sent to customer's phone{'\n'}
            <Text style={styles.phoneNumber}>{MOCK_CUSTOMER.phone}</Text>
          </Text>

          {/* Customer Card */}
          <View style={styles.customerCard}>
            <Image
              source={{ uri: MOCK_CUSTOMER.image }}
              style={styles.customerImage}
            />
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{MOCK_CUSTOMER.name}</Text>
              <Text style={styles.customerLabel}>Customer</Text>
            </View>
          </View>

          {/* Amount Card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Payment Amount</Text>
            <Text style={styles.amountValue}>₹{amount.toLocaleString()}</Text>
            <Text style={styles.amountSubtext}>Cash payment received</Text>
          </View>

          {/* Instruction Box */}
          <View style={styles.instructionBox}>
            <Icon name="information" size={20} color={COLORS.info} />
            <Text style={styles.instructionText}>
              Ask the customer to tell you the 6-digit OTP they received on
              their phone
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpSection}>
            <Text style={styles.otpLabel}>Customer's OTP</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit !== '' && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleResendOTP} activeOpacity={0.7}>
                  <Text style={styles.resendText}>
                    Didn't receive code?{' '}
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend OTP in{' '}
                  <Text style={styles.timerHighlight}>{timer}s</Text>
                </Text>
              )}
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Icon name="alert-circle" size={20} color={COLORS.warning} />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Important Notes:</Text>
              <Text style={styles.warningText}>
                • OTP confirms customer paid you in cash{'\n'}• Customer should
                tell you OTP verbally{'\n'}• Don't share this OTP with anyone
                {'\n'}• This is legally valid proof of payment
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              !isOtpComplete && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyPayment}
            disabled={!isOtpComplete || isVerifying}
            activeOpacity={0.8}
          >
            {isVerifying ? (
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            ) : (
              <>
                <Icon name="check-decagram" size={20} color={COLORS.white} />
                <Text style={styles.verifyButtonText}>Verify Payment</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentConfirmationScreen;
