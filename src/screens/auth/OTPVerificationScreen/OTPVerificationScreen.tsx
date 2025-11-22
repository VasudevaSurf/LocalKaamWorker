import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../context/AuthContext';
import { AuthStackParamList } from '../../../navigation/types';
import { styles } from './OTPVerificationScreen.styles';
import { COLORS } from '../../../utils';

type OTPVerificationRouteProp = RouteProp<
  AuthStackParamList,
  'OTPVerification'
>;

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<OTPVerificationRouteProp>();
  const { phoneNumber } = route.params;
  const { login } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimations();
    startTimer();
  }, []);

  useEffect(() => {
    // Auto-verify when all 6 digits are entered
    if (otp.every(digit => digit !== '')) {
      handleVerify();
    }
  }, [otp]);

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOtpChange = (value: string, index: number) => {
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
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      return;
    }

    setIsVerifying(true);

    try {
      const success = await login(phoneNumber, otpCode);

      if (success) {
        setTimeout(() => {
          setIsVerifying(false);
          navigation.navigate('ProfileSetup1' as never);
        }, 1000);
      } else {
        setIsVerifying(false);
        shakeInputs();
        Alert.alert('Invalid OTP', 'Please check the code and try again');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setIsVerifying(false);
      shakeInputs();
      Alert.alert('Error', 'Something went wrong. Please try again');
    }
  };

  const handleResend = () => {
    if (!canResend) return;

    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    startTimer();

    Alert.alert(
      'OTP Sent',
      'A new verification code has been sent to your phone',
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditNumber = () => {
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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              {/* Icon Section */}
              <Animated.View
                style={[
                  styles.iconSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                {/* Background Effects */}
                <View style={styles.circleOuter} />
                <View style={styles.circleMiddle} />

                <LinearGradient
                  colors={['#8B5CF6', '#6D28D9']}
                  style={styles.iconCircle}
                >
                  <Icon
                    name="message-text-lock"
                    size={70}
                    color={COLORS.white}
                  />
                </LinearGradient>

                {/* Floating Elements */}
                <View style={[styles.floatingDot, styles.dot1]} />
                <View style={[styles.floatingDot, styles.dot2]} />
                <View style={[styles.floatingDot, styles.dot3]} />
              </Animated.View>

              {/* Text Section */}
              <Animated.View
                style={[
                  styles.textSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Text style={styles.title}>Verify Your Number</Text>
                <Text style={styles.subtitle}>
                  Enter the 6-digit code sent to
                </Text>

                {/* Phone Number with Edit */}
                <View style={styles.phoneContainer}>
                  <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditNumber}
                    activeOpacity={0.7}
                  >
                    <Icon name="pencil" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* OTP Input Section */}
              <Animated.View
                style={[
                  styles.otpSection,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { translateX: shakeAnim },
                    ],
                  },
                ]}
              >
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <View
                      key={index}
                      style={[
                        styles.otpInputWrapper,
                        digit !== '' && styles.otpInputWrapperFilled,
                      ]}
                    >
                      <LinearGradient
                        colors={
                          digit !== ''
                            ? ['#8B5CF6', '#6D28D9']
                            : ['#FFFFFF', '#F9FAFB']
                        }
                        style={styles.otpInputGradient}
                      >
                        <TextInput
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
                      </LinearGradient>
                    </View>
                  ))}
                </View>

                {/* Timer / Resend */}
                <View style={styles.resendContainer}>
                  {canResend ? (
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleResend}
                      activeOpacity={0.7}
                    >
                      <Icon name="refresh" size={18} color={COLORS.primary} />
                      <Text style={styles.resendText}>Resend Code</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.timerContainer}>
                      <Icon
                        name="clock-outline"
                        size={18}
                        color={COLORS.textSecondary}
                      />
                      <Text style={styles.timerText}>
                        Resend code in{' '}
                        <Text style={styles.timerHighlight}>{timer}s</Text>
                      </Text>
                    </View>
                  )}
                </View>
              </Animated.View>

              {/* Info Card */}
              <Animated.View
                style={[
                  styles.infoCard,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <View style={styles.infoRow}>
                  <Icon name="shield-check" size={20} color={COLORS.success} />
                  <Text style={styles.infoText}>
                    Your phone number is encrypted and secure
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="message-alert" size={20} color={COLORS.warning} />
                  <Text style={styles.infoText}>
                    Didn't receive code? Check your SMS inbox
                  </Text>
                </View>
              </Animated.View>

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Verify Button */}
              {isVerifying && (
                <Animated.View
                  style={[
                    styles.verifyingContainer,
                    {
                      opacity: fadeAnim,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#8B5CF6', '#6D28D9']}
                    style={styles.verifyingCard}
                  >
                    <View style={styles.verifyingContent}>
                      <Icon
                        name="shield-check"
                        size={32}
                        color={COLORS.white}
                      />
                      <Text style={styles.verifyingText}>Verifying...</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OTPVerificationScreen;
