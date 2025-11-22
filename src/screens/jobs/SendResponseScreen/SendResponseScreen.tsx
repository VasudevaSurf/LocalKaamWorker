import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './SendResponseScreen.styles';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

const QUICK_REPLIES = [
  "Yes, I'm available!",
  'Can start immediately',
  '15+ years experience',
  'Quality work guaranteed',
  'Own tools available',
];

const AVAILABILITY_OPTIONS = [
  { id: '1', label: 'Today', value: 'today' },
  { id: '2', label: 'Tomorrow', value: 'tomorrow' },
  { id: '3', label: 'This Week', value: 'this_week' },
  { id: '4', label: 'Custom Date', value: 'custom' },
];

const SendResponseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [message, setMessage] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('today');
  const [hasTools, setHasTools] = useState(true);
  const [canGuarantee, setCanGuarantee] = useState(true);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleQuickReply = (reply: string) => {
    setMessage(prev => (prev ? `${prev} ${reply}` : reply));
  };

  const calculateTotal = () => {
    const rate = parseFloat(dailyRate) || 0;
    const days = parseFloat(estimatedDays) || 0;
    return rate * days;
  };

  const isFormValid = () => {
    return message.trim().length >= 20 && dailyRate.length > 0;
  };

  const handleSendResponse = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    // TODO: API call to send response
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Response Sent! ✅',
        'Your response has been sent to the customer. They will contact you if interested.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header
          variant="simple"
          showBack
          onBackPress={handleBack}
          title="Send Response"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Job Summary Card */}
          <View style={styles.jobSummaryCard}>
            <View style={styles.jobSummaryHeader}>
              <Icon name="briefcase" size={20} color={COLORS.primary} />
              <Text style={styles.jobSummaryTitle}>House Wiring Needed</Text>
            </View>
            <Text style={styles.jobSummaryCustomer}>
              Amit Singh • 3.5 km away
            </Text>
            <View style={styles.jobSummaryBudget}>
              <Icon name="cash" size={16} color={COLORS.success} />
              <Text style={styles.jobSummaryBudgetText}>
                Budget: ₹800-1000/day
              </Text>
            </View>
          </View>

          {/* Quick Replies */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Quick Replies (Optional)</Text>
            <Text style={styles.sectionHint}>Tap to add to your message</Text>
            <View style={styles.quickRepliesContainer}>
              {QUICK_REPLIES.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickReplyChip}
                  onPress={() => handleQuickReply(reply)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                  <Icon name="plus" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Your Message <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Introduce yourself and explain why you're the right fit
            </Text>
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Hello Amit ji, I have 15 years of experience in house wiring..."
                placeholderTextColor={COLORS.gray400}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.characterCount}>
              {message.length}/500 characters
            </Text>
          </View>

          {/* Quote Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Your Quote <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>Provide your pricing details</Text>

            <View style={styles.quoteInputs}>
              <View style={styles.quoteInputWrapper}>
                <Text style={styles.inputLabel}>Daily Rate</Text>
                <View style={styles.quoteInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.quoteInput}
                    placeholder="900"
                    placeholderTextColor={COLORS.gray400}
                    value={dailyRate}
                    onChangeText={setDailyRate}
                    keyboardType="numeric"
                  />
                  <Text style={styles.perDay}>/day</Text>
                </View>
              </View>

              <View style={styles.quoteInputWrapper}>
                <Text style={styles.inputLabel}>Days Needed</Text>
                <View style={styles.quoteInputContainer}>
                  <TextInput
                    style={styles.quoteInput}
                    placeholder="3"
                    placeholderTextColor={COLORS.gray400}
                    value={estimatedDays}
                    onChangeText={setEstimatedDays}
                    keyboardType="numeric"
                  />
                  <Text style={styles.perDay}>days</Text>
                </View>
              </View>
            </View>

            {dailyRate && estimatedDays && (
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Estimate:</Text>
                <Text style={styles.totalValue}>
                  ₹{calculateTotal().toLocaleString()}
                </Text>
              </View>
            )}

            {/* Negotiable Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsNegotiable(!isNegotiable)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {isNegotiable && (
                  <Icon name="check" size={16} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Price is negotiable</Text>
            </TouchableOpacity>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>When can you start?</Text>
            <View style={styles.availabilityOptions}>
              {AVAILABILITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.availabilityOption,
                    selectedAvailability === option.value &&
                      styles.availabilityOptionSelected,
                  ]}
                  onPress={() => setSelectedAvailability(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.availabilityText,
                      selectedAvailability === option.value &&
                        styles.availabilityTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Additional Information</Text>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setHasTools(!hasTools)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {hasTools && (
                  <Icon name="check" size={16} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I have my own tools/equipment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setCanGuarantee(!canGuarantee)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {canGuarantee && (
                  <Icon name="check" size={16} color={COLORS.primary} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I can complete with quality assurance
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="information" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              The customer will receive your response and contact details.
              They'll reach out if interested.
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !isFormValid() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendResponse}
            disabled={!isFormValid() || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.sendButtonText}>Sending...</Text>
            ) : (
              <>
                <Icon name="send" size={20} color={COLORS.white} />
                <Text style={styles.sendButtonText}>Send Response</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SendResponseScreen;
