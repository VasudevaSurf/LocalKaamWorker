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
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './CompleteJobScreen.styles';
import { COLORS } from '../../../utils';

// Mock job data
const MOCK_JOB = {
  id: '3',
  customerName: 'Rahul Verma',
  customerImage: 'https://via.placeholder.com/50',
  customerPhone: '+919876543210',
  title: 'House Wiring',
  agreedAmount: '2700',
  duration: '3 days',
  startDate: '10 Nov',
};

interface PhotoItem {
  uri: string;
  id: string;
}

const CompleteJobScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [finalAmount, setFinalAmount] = useState(MOCK_JOB.agreedAmount);
  const [completionNotes, setCompletionNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [hasReceivedPayment, setHasReceivedPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5,
      },
      response => {
        if (response.assets) {
          const newPhotos = response.assets.map((asset, index) => ({
            uri: asset.uri || '',
            id: `${Date.now()}_${index}`,
          }));
          setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
        }
      },
    );
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const isFormValid = () => {
    return (
      finalAmount.trim().length > 0 &&
      completionNotes.trim().length >= 10 &&
      hasReceivedPayment
    );
  };

  const handleRequestOTP = async () => {
    if (!isFormValid()) {
      Alert.alert(
        'Incomplete',
        'Please fill all required fields and confirm payment received',
      );
      return;
    }

    setIsLoading(true);

    // TODO: API call to request OTP
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to Payment Confirmation screen
      navigation.navigate(
        'PaymentConfirmation' as never,
        {
          jobId: MOCK_JOB.id,
          amount: parseFloat(finalAmount),
        } as never,
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Job</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Job Summary Card */}
          <View style={styles.jobCard}>
            <View style={styles.customerSection}>
              <Image
                source={{ uri: MOCK_JOB.customerImage }}
                style={styles.customerImage}
              />
              <View style={styles.customerInfo}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.customerName}>{MOCK_JOB.customerName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoItem}>
                <Text style={styles.label}>Job</Text>
                <Text style={styles.value}>{MOCK_JOB.title}</Text>
              </View>
              <View style={styles.jobInfoItem}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>{MOCK_JOB.duration}</Text>
              </View>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoItem}>
                <Text style={styles.label}>Started On</Text>
                <Text style={styles.value}>{MOCK_JOB.startDate}</Text>
              </View>
              <View style={styles.jobInfoItem}>
                <Text style={styles.label}>Agreed Amount</Text>
                <Text style={[styles.value, { color: COLORS.success }]}>
                  ₹{MOCK_JOB.agreedAmount}
                </Text>
              </View>
            </View>
          </View>

          {/* Final Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Final Amount Received <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Enter the actual amount you received in cash
            </Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="2400"
                placeholderTextColor={COLORS.gray400}
                value={finalAmount}
                onChangeText={setFinalAmount}
                keyboardType="numeric"
              />
            </View>
            {finalAmount &&
              parseFloat(finalAmount) !== parseFloat(MOCK_JOB.agreedAmount) && (
                <View style={styles.warningBox}>
                  <Icon name="alert" size={16} color={COLORS.warning} />
                  <Text style={styles.warningText}>
                    Amount differs from agreed amount of ₹
                    {MOCK_JOB.agreedAmount}
                  </Text>
                </View>
              )}
          </View>

          {/* Completion Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Completion Notes <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Describe what work was completed
            </Text>
            <View style={styles.notesInputContainer}>
              <TextInput
                style={styles.notesInput}
                placeholder="Completed all house wiring, MCB board installation, lights and fans as requested..."
                placeholderTextColor={COLORS.gray400}
                value={completionNotes}
                onChangeText={setCompletionNotes}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.characterCount}>
              {completionNotes.length}/500 characters
            </Text>
          </View>

          {/* Upload Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Upload Final Photos</Text>
            <Text style={styles.sectionHint}>
              Add photos of completed work (up to 5 photos)
            </Text>

            <View style={styles.photosContainer}>
              {photos.map(photo => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photoImage}
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(photo.id)}
                    activeOpacity={0.7}
                  >
                    <Icon name="close" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              ))}

              {photos.length < 5 && (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                  activeOpacity={0.7}
                >
                  <Icon name="camera-plus" size={32} color={COLORS.primary} />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Payment Confirmation Checkbox */}
          <View style={styles.paymentConfirmSection}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setHasReceivedPayment(!hasReceivedPayment)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  hasReceivedPayment && styles.checkboxChecked,
                ]}
              >
                {hasReceivedPayment && (
                  <Icon name="check" size={20} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                I have received CASH payment from customer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Important Notice */}
          <View style={styles.importantBox}>
            <View style={styles.importantHeader}>
              <Icon name="alert-circle" size={24} color={COLORS.error} />
              <Text style={styles.importantTitle}>IMPORTANT</Text>
            </View>
            <View style={styles.importantContent}>
              <Text style={styles.importantText}>
                • Only mark complete after receiving full payment
              </Text>
              <Text style={styles.importantText}>
                • Customer will receive OTP on their phone
              </Text>
              <Text style={styles.importantText}>
                • Ask customer to tell you the OTP verbally
              </Text>
              <Text style={styles.importantText}>
                • OTP confirms customer gave you cash payment
              </Text>
              <Text style={styles.importantText}>
                • Don't share OTP with anyone else
              </Text>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="information" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              After OTP verification, ₹{finalAmount} will be added to your
              earnings dashboard
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={[
              styles.requestOTPButton,
              !isFormValid() && styles.requestOTPButtonDisabled,
            ]}
            onPress={handleRequestOTP}
            disabled={!isFormValid() || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.requestOTPButtonText}>Requesting OTP...</Text>
            ) : (
              <>
                <Icon name="message-text" size={20} color={COLORS.white} />
                <Text style={styles.requestOTPButtonText}>
                  Request Payment OTP
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CompleteJobScreen;
