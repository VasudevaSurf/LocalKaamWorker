import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { AuthNavigationProp } from '../../../navigation/types';
import { useAuth } from '../../../context/AuthContext'; // ✅ Import at top
import { styles } from './ProfileSetup2Screen.styles';
import { COLORS } from '../../../utils';

interface City {
  id: string;
  name: string;
  state: string;
}

interface Experience {
  id: string;
  label: string;
  value: string;
}

const CITIES: City[] = [
  { id: '1', name: 'Ludhiana', state: 'Punjab' },
  { id: '2', name: 'Delhi', state: 'Delhi' },
  { id: '3', name: 'Mumbai', state: 'Maharashtra' },
  { id: '4', name: 'Bangalore', state: 'Karnataka' },
  { id: '5', name: 'Hyderabad', state: 'Telangana' },
  { id: '6', name: 'Chennai', state: 'Tamil Nadu' },
  { id: '7', name: 'Kolkata', state: 'West Bengal' },
  { id: '8', name: 'Pune', state: 'Maharashtra' },
  { id: '9', name: 'Ahmedabad', state: 'Gujarat' },
  { id: '10', name: 'Jaipur', state: 'Rajasthan' },
  { id: '11', name: 'Chandigarh', state: 'Chandigarh' },
  { id: '12', name: 'Amritsar', state: 'Punjab' },
];

const EXPERIENCE_OPTIONS: Experience[] = [
  { id: '1', label: 'Less than 1 year', value: '<1' },
  { id: '2', label: '1-3 years', value: '1-3' },
  { id: '3', label: '3-5 years', value: '3-5' },
  { id: '4', label: '5-10 years', value: '5-10' },
  { id: '5', label: '10-15 years', value: '10-15' },
  { id: '6', label: '15+ years', value: '15+' },
];

const ProfileSetup2Screen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute();
  const { name, skill, profileImageUri } = (route.params as any) || {}; // Cast to any to avoid type errors

  const { updateUser, uploadUserVideo, uploadUserImage } = useAuth(); // Add uploadUserImage
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const handleVideoPicker = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        quality: 0.8,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0].uri) {
          setVideoUri(response.assets[0].uri);
        }
      },
    );
  };

  const isFormValid = () => {
    return selectedCity !== null && selectedExperience !== null;
  };

  const handleComplete = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Profile Image (if exists)
      let profileImageUrl = '';
      if (profileImageUri) {
        profileImageUrl = await uploadUserImage(profileImageUri);
      }

      // 2. Upload Intro Video (if exists)
      let videoUrl = '';
      if (videoUri) {
        videoUrl = await uploadUserVideo(videoUri);
      }

      // 3. Save ALL Data to Backend
      await updateUser({
        name: name,
        skill: skill,
        city: selectedCity || undefined,
        experience: selectedExperience || undefined,
        profileImage: profileImageUrl,
        profileVideo: videoUrl,
        profileComplete: true,
        userType: 'worker', // ✅ Ensure worker role is set
      });

      // Success message
      Alert.alert('Success! 🎉', 'Your profile has been created successfully!');

      // Navigation will be handled automatically by RootNavigator
      // since profileComplete is now true
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderCityItem = (city: City) => (
    <TouchableOpacity
      key={city.id}
      style={styles.modalItem}
      onPress={() => {
        setSelectedCity(city);
        setShowCityModal(false);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.modalItemContent}>
        <Icon name="map-marker" size={20} color={COLORS.primary} />
        <View style={styles.modalItemText}>
          <Text style={styles.modalItemTitle}>{city.name}</Text>
          <Text style={styles.modalItemSubtitle}>{city.state}</Text>
        </View>
      </View>
      {selectedCity?.id === city.id && (
        <Icon name="check-circle" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  const renderExperienceItem = (exp: Experience) => (
    <TouchableOpacity
      key={exp.id}
      style={styles.modalItem}
      onPress={() => {
        setSelectedExperience(exp);
        setShowExperienceModal(false);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.modalItemContent}>
        <Icon name="briefcase" size={20} color={COLORS.primary} />
        <Text style={styles.modalItemTitle}>{exp.label}</Text>
      </View>
      {selectedExperience?.id === exp.id && (
        <Icon name="check-circle" size={20} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

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
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>Step 2 of 2</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Almost There!</Text>
            <Text style={styles.subtitle}>
              Just a few more details to complete your profile
            </Text>
          </View>

          {/* City Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>
              Select Your City <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              This helps customers find you in their area
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.selectContent}>
                <Icon
                  name="map-marker"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.selectText,
                    selectedCity && styles.selectTextSelected,
                  ]}
                >
                  {selectedCity
                    ? `${selectedCity.name}, ${selectedCity.state}`
                    : 'Choose your city'}
                </Text>
              </View>
              <Icon
                name="chevron-down"
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Experience Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>
              Years of Experience <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              How long have you been working in your field?
            </Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowExperienceModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.selectContent}>
                <Icon name="briefcase" size={20} color={COLORS.textSecondary} />
                <Text
                  style={[
                    styles.selectText,
                    selectedExperience && styles.selectTextSelected,
                  ]}
                >
                  {selectedExperience?.label || 'Select experience'}
                </Text>
              </View>
              <Icon
                name="chevron-down"
                size={24}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="information" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              You can update these details anytime from your profile settings
            </Text>
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              !isFormValid() && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!isFormValid() || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.completeButtonText}>Creating Profile...</Text>
            ) : (
              <>
                <Text style={styles.completeButtonText}>Complete Profile</Text>
                <Icon name="check-circle" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* City Selection Modal */}
      <Modal
        isVisible={showCityModal}
        onBackdropPress={() => setShowCityModal(false)}
        onBackButtonPress={() => setShowCityModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Your City</Text>
            <TouchableOpacity
              onPress={() => setShowCityModal(false)}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {CITIES.map(renderCityItem)}
          </ScrollView>
        </View>
      </Modal>

      {/* Experience Selection Modal */}
      <Modal
        isVisible={showExperienceModal}
        onBackdropPress={() => setShowExperienceModal(false)}
        onBackButtonPress={() => setShowExperienceModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Years of Experience</Text>
            <TouchableOpacity
              onPress={() => setShowExperienceModal(false)}
              activeOpacity={0.7}
            >
              <Icon name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalList}
            showsVerticalScrollIndicator={false}
          >
            {EXPERIENCE_OPTIONS.map(renderExperienceItem)}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileSetup2Screen;
