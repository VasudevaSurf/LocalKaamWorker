import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './EditProfileScreen.styles';
import { COLORS } from '../../../utils';

const SKILLS = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Mason',
  'AC Technician',
  'Cook',
  'Gardener',
];

const EXPERIENCE_LEVELS = [
  '0-2 years',
  '2-5 years',
  '5-10 years',
  '10-15 years',
  '15+ years',
];

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(
    'https://via.placeholder.com/150',
  );
  const [name, setName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('+91-98765-43210');
  const [email, setEmail] = useState('rajesh.kumar@email.com');
  const [selectedSkill, setSelectedSkill] = useState('Electrician');
  const [experience, setExperience] = useState('15+ years');
  const [city, setCity] = useState('Ludhiana');
  const [state, setState] = useState('Punjab');
  const [pincode, setPincode] = useState('141001');
  const [about, setAbout] = useState(
    'Professional electrician with 15+ years of experience in residential and commercial wiring.',
  );
  const [hourlyRate, setHourlyRate] = useState('500');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (hasChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const hasChanges = () => {
    // Check if any field has changed
    return true; // Simplified for demo
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => {
          // Launch camera
          Alert.alert('Camera', 'Camera functionality will open here');
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.8,
            },
            response => {
              if (response.assets && response.assets[0].uri) {
                setProfileImage(response.assets[0].uri);
              }
            },
          );
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !city.trim()) {
      Alert.alert('Incomplete', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    // TODO: API call to save profile
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profilePhoto}
              />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={handleChangePhoto}
                activeOpacity={0.7}
              >
                <Icon name="camera" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoHint}>Tap to change photo</Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="account" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: COLORS.backgroundGray },
                ]}
              >
                <Icon name="phone" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={[styles.input, { color: COLORS.textSecondary }]}
                  value={phone}
                  editable={false}
                  placeholder="Phone number"
                  placeholderTextColor={COLORS.gray400}
                />
                <Icon name="lock" size={16} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.inputHint}>
                Phone number cannot be changed
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <View style={styles.inputContainer}>
                <Icon name="email" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor={COLORS.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Primary Skill <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.skillsScroll}
              >
                {SKILLS.map(skill => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.skillChip,
                      selectedSkill === skill && styles.skillChipSelected,
                    ]}
                    onPress={() => setSelectedSkill(skill)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        selectedSkill === skill && styles.skillChipTextSelected,
                      ]}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Experience <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.experienceContainer}>
                {EXPERIENCE_LEVELS.map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.experienceChip,
                      experience === level && styles.experienceChipSelected,
                    ]}
                    onPress={() => setExperience(level)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.experienceText,
                        experience === level && styles.experienceTextSelected,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hourly Rate (₹)</Text>
              <View style={styles.inputContainer}>
                <Icon name="cash" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  placeholder="500"
                  placeholderTextColor={COLORS.gray400}
                  keyboardType="numeric"
                />
                <Text style={styles.perHour}>/hour</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>About You</Text>
              <View style={styles.textareaContainer}>
                <TextInput
                  style={styles.textarea}
                  value={about}
                  onChangeText={setAbout}
                  placeholder="Tell customers about your experience and skills..."
                  placeholderTextColor={COLORS.gray400}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  textAlignVertical="top"
                />
              </View>
              <Text style={styles.characterCount}>
                {about.length}/300 characters
              </Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="city" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                State <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="map" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={state}
                  onChangeText={setState}
                  placeholder="Enter your state"
                  placeholderTextColor={COLORS.gray400}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pincode</Text>
              <View style={styles.inputContainer}>
                <Icon
                  name="map-marker"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="141001"
                  placeholderTextColor={COLORS.gray400}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <>
                <Icon name="check" size={20} color={COLORS.white} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
