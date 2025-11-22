import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AuthNavigationProp,
  AuthStackParamList,
} from '../../../navigation/types';
import { styles } from './OTPVerificationScreen.styles';

type OTPVerificationRouteProp = RouteProp<
  AuthStackParamList,
  'OTPVerification'
>;

const OTPVerificationScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

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
    // Only allow numbers
    const cleaned = value.replace(/[^0-9]/g, '');

    if (cleaned.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = cleaned;
      setOtp(newOtp);

      // Auto-focus next input
      if (cleaned && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // TODO: API call to verify OTP
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // On success, navigate to Profile Setup
      navigation.navigate('ProfileSetup1');
    }, 1500);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    // TODO: API call to resend OTP
    Alert.alert('OTP Resent', 'A new OTP has been sent to your mobile number');
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Icon name="message-text" size={60} color="#2563EB" />
              </View>
            </View>

            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              Code sent to{'\n'}
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>
            </Text>

            <TouchableOpacity
              style={styles.changeNumberButton}
              onPress={handleChangeNumber}
              activeOpacity={0.7}
            >
              <Text style={styles.changeNumberText}>Change Number</Text>
            </TouchableOpacity>
          </View>

          {/* OTP Input Section */}
          <View style={styles.otpSection}>
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

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              !isOtpComplete && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isOtpComplete || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            ) : (
              <>
                <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                <Icon name="check" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="shield-check" size={20} color="#10B981" />
            <Text style={styles.infoText}>
              Your number is safe with us. We won't share it with anyone.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Import COLORS for back button
import { COLORS } from '../../../utils';

export default OTPVerificationScreen;
