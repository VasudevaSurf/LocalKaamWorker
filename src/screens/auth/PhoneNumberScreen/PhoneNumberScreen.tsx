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
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './PhoneNumberScreen.styles';
import { COLORS } from '../../../utils';

const PhoneNumberScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const phoneIconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Phone icon rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(phoneIconAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(phoneIconAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handleContinue = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number',
      );
      return;
    }

    setIsLoading(true);

    try {
      const auth = getAuth();
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phoneNumber}`,
      );
      setIsLoading(false);
      navigation.navigate(
        'OTPVerification' as never,
        {
          phoneNumber: `+91${phoneNumber}`,
          confirmation,
        } as never,
      );
    } catch (error) {
      setIsLoading(false);
      console.log('Error sending OTP:', error);
      Alert.alert(
        'Error',
        'Failed to send verification code. Please try again later.',
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned.slice(0, 10));
  };

  const phoneRotate = phoneIconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

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
              {/* Phone Icon Section */}
              <Animated.View
                style={[
                  styles.iconSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {/* Background Circles */}
                <View style={styles.circleOuter} />
                <View style={styles.circleMiddle} />

                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.iconCircle}
                >
                  <Animated.View
                    style={{
                      transform: [{ rotate: phoneRotate }],
                    }}
                  >
                    <Icon name="cellphone" size={70} color={COLORS.white} />
                  </Animated.View>
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
                <Text style={styles.title}>Enter Your Phone Number</Text>
                <Text style={styles.subtitle}>
                  We'll send you a verification code to confirm your number
                </Text>
              </Animated.View>

              {/* Phone Input Section */}
              <Animated.View
                style={[
                  styles.inputSection,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                {/* Input Card */}
                <View style={styles.inputCard}>
                  {/* Country Code */}
                  <View style={styles.countryCodeContainer}>
                    <LinearGradient
                      colors={['#F3F4F6', '#E5E7EB']}
                      style={styles.countryCodeBox}
                    >
                      <Icon name="flag" size={20} color={COLORS.primary} />
                      <Text style={styles.countryCodeText}>+91</Text>
                    </LinearGradient>
                  </View>

                  {/* Phone Input */}
                  <View style={styles.phoneInputContainer}>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Enter 10-digit number"
                      placeholderTextColor={COLORS.gray400}
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={formatPhoneNumber}
                      autoFocus
                    />
                    {phoneNumber.length === 10 && (
                      <View style={styles.checkmarkContainer}>
                        <LinearGradient
                          colors={['#10B981', '#059669']}
                          style={styles.checkmark}
                        >
                          <Icon name="check" size={16} color={COLORS.white} />
                        </LinearGradient>
                      </View>
                    )}
                  </View>
                </View>

                {/* Character Counter */}
                <Text style={styles.characterCounter}>
                  {phoneNumber.length}/10 digits
                </Text>
              </Animated.View>

              {/* Features Section */}
              <Animated.View
                style={[
                  styles.featuresSection,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Icon
                      name="shield-check"
                      size={20}
                      color={COLORS.success}
                    />
                  </View>
                  <Text style={styles.featureText}>
                    Your phone number is safe and secure
                  </Text>
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Icon
                      name="message-processing"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text style={styles.featureText}>
                    You'll receive a 6-digit OTP via SMS
                  </Text>
                </View>
              </Animated.View>

              {/* Spacer */}
              <View style={styles.spacer} />

              {/* Continue Button */}
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
                    styles.continueButton,
                    phoneNumber.length !== 10 && styles.continueButtonDisabled,
                  ]}
                  onPress={handleContinue}
                  disabled={phoneNumber.length !== 10 || isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={
                      phoneNumber.length === 10
                        ? ['#2563EB', '#1E40AF']
                        : ['#D1D5DB', '#9CA3AF']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.continueButtonGradient}
                  >
                    {isLoading ? (
                      <Text style={styles.continueButtonText}>
                        Sending OTP...
                      </Text>
                    ) : (
                      <>
                        <Text style={styles.continueButtonText}>Continue</Text>
                        <Icon
                          name="arrow-right"
                          size={24}
                          color={COLORS.white}
                        />
                      </>
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

export default PhoneNumberScreen;
