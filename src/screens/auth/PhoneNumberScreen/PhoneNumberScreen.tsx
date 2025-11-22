import React, { useState, useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthNavigationProp } from '../../../navigation/types';
import { styles } from './PhoneNumberScreen.styles';

const PhoneNumberScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const phoneInputRef = useRef<TextInput>(null);

  const handlePhoneChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };

  const isValidPhone = () => {
    return phoneNumber.length === 10 && phoneNumber[0] !== '0';
  };

  const handleSendOTP = async () => {
    if (!isValidPhone()) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number',
      );
      return;
    }

    setIsLoading(true);

    // TODO: API call to send OTP
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('OTPVerification', {
        phoneNumber: `+91${phoneNumber}`,
      });
    }, 1500);
  };

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Icon name="cellphone" size={60} color="#2563EB" />
              </View>
            </View>

            <Text style={styles.title}>Enter Your Mobile Number</Text>
            <Text style={styles.subtitle}>
              We'll send you a one-time verification code
            </Text>
          </View>

          {/* Phone Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Mobile Number</Text>

            <View style={styles.inputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳</Text>
                <Text style={styles.countryCodeNumber}>+91</Text>
              </View>

              <TextInput
                ref={phoneInputRef}
                style={styles.input}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus={true}
              />

              {phoneNumber.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setPhoneNumber('')}
                  activeOpacity={0.7}
                >
                  <Icon name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Character Counter */}
            <Text style={styles.counter}>{phoneNumber.length}/10 digits</Text>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Icon name="information" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>
                We'll send an OTP to verify your number
              </Text>
            </View>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              !isValidPhone() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={!isValidPhone() || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.sendButtonText}>Sending OTP...</Text>
            ) : (
              <>
                <Text style={styles.sendButtonText}>Send OTP</Text>
                <Icon name="arrow-right" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneNumberScreen;
