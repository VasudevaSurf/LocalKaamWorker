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
import { useAuth } from '../../../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './EditProfileScreen.styles';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

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

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, uploadUserImage } = useAuth();

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || 'https://via.placeholder.com/150',
  );
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(''); // Email not in user model yet
  const [selectedSkill, setSelectedSkill] = useState(
    user?.skill || 'Electrician',
  );

  // Parse initial experience
  const initialExpLabel =
    user?.experience?.label ||
    (typeof user?.experience === 'string' ? user.experience : '') ||
    '';
  const initialYears = initialExpLabel.match(/(\d+)/)?.[0] || '';

  const [expYears, setExpYears] = useState(initialYears);
  const [expMonths, setExpMonths] = useState('');

  const [city, setCity] = useState(user?.city?.name || '');
  const [state, setState] = useState(user?.city?.state || '');
  const [pincode, setPincode] = useState('');
  const [about, setAbout] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    console.log('Navigating back');
    navigation.goBack();
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Choose an option', [
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
    console.log('Saving profile...');
    if (!name.trim() || !city.trim()) {
      Alert.alert('Incomplete', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload new image if changed (and not a remote URL)
      let newImageUrl = profileImage;
      if (
        profileImage &&
        profileImage !== user?.profileImage &&
        !profileImage.startsWith('http')
      ) {
        newImageUrl = await uploadUserImage(profileImage);
      }

      // Format experience string
      const years = parseInt(expYears || '0');
      const months = parseInt(expMonths || '0');
      const experienceString = `${years} Years ${
        months > 0 ? `${months} Months` : ''
      }`.trim();

      // 2. Update Profile Data
      await updateUser({
        name,
        skill: selectedSkill,
        city: { name: city, state: state },
        experience: { label: experienceString, value: `${years}.${months}` },
        profileImage: newImageUrl,
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
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
          title="Edit Profile"
        />

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
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    value={expYears}
                    onChangeText={setExpYears}
                    placeholder="0"
                    placeholderTextColor={COLORS.gray400}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.perHour}>Years</Text>
                </View>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    value={expMonths}
                    onChangeText={setExpMonths}
                    placeholder="0"
                    placeholderTextColor={COLORS.gray400}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.perHour}>Months</Text>
                </View>
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
