import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './OTPVerificationScreen.styles';
import { COLORS } from '../../../utils';

import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { useAuth } from '../../../context/AuthContext';

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useAuth();
  const { phoneNumber, confirmation } = route.params as {
    phoneNumber: string;
    confirmation: any;
  };

  const [confirmationResult, setConfirmationResult] = useState(confirmation);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    startAnimations();
    startTimer();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      await confirmationResult.confirm(otpString);
      // Update Auth Context to trigger navigation
      await login(phoneNumber, otpString);
      Alert.alert('Success', 'Phone number verified successfully!');
    } catch (error) {
      console.log('Invalid code.', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const auth = getAuth();
      const newConfirmation = await signInWithPhoneNumber(auth, phoneNumber);
      // Update the confirmation object in route params or local state if possible
      // Since route params are read-only, we might need a local state for confirmation
      // For now, we'll just use the new confirmation for verification if we could update it.
      // However, the best way is to update a local ref or state.
      // Let's add a state for confirmation.
      setConfirmationResult(newConfirmation);

      setTimer(30);
      startTimer();
      Alert.alert('Resend OTP', 'OTP resent successfully!');
    } catch (error) {
      console.log('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <LinearGradient
        colors={['#FFFFFF', '#F9FAFB', '#F3F4F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <View style={styles.content}>
              {/* Header Section */}
              <Animated.View
                style={[
                  styles.headerSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.iconContainer}>
                  <Icon name="message-lock" size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.title}>Verification Code</Text>
                <Text style={styles.subtitle}>
                  We have sent the verification code to
                  {'\n'}
                  <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                </Text>
              </Animated.View>

              {/* OTP Input Section */}
              <Animated.View
                style={[
                  styles.inputSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => {
                        inputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        digit ? styles.otpInputFilled : null,
                      ]}
                      value={digit}
                      onChangeText={value => handleOtpChange(value, index)}
                      onKeyPress={e => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive code? </Text>
                  <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                    <Text
                      style={[
                        styles.resendLink,
                        timer > 0 && styles.resendLinkDisabled,
                      ]}
                    >
                      {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <View style={styles.spacer} />

              {/* Verify Button */}
              <Animated.View
                style={[
                  styles.buttonSection,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    otp.join('').length !== 6 && styles.verifyButtonDisabled,
                  ]}
                  onPress={handleVerify}
                  disabled={otp.join('').length !== 6 || isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={
                      otp.join('').length === 6
                        ? ['#2563EB', '#1E40AF']
                        : ['#D1D5DB', '#9CA3AF']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.verifyButtonGradient}
                  >
                    {isLoading ? (
                      <Text style={styles.verifyButtonText}>Verifying...</Text>
                    ) : (
                      <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OTPVerificationScreen;
