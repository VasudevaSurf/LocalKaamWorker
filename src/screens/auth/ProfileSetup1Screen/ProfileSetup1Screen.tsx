import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthNavigationProp } from '../../../navigation/types';
import { styles } from './ProfileSetup1Screen.styles';
import { COLORS } from '../../../utils';
import { useAuth } from '../../../context/AuthContext';

interface Skill {
  id: string;
  name: string;
  icon: string;
}

const SKILLS: Skill[] = [
  { id: '1', name: 'Electrician', icon: 'lightning-bolt' },
  { id: '2', name: 'Plumber', icon: 'pipe-wrench' },
  { id: '3', name: 'Carpenter', icon: 'hammer' },
  { id: '4', name: 'Painter', icon: 'format-paint' },
  { id: '5', name: 'Cook', icon: 'chef-hat' },
  { id: '6', name: 'Mechanic', icon: 'car-wrench' },
  { id: '7', name: 'Cleaner', icon: 'broom' },
  { id: '8', name: 'Gardener', icon: 'flower' },
  { id: '9', name: 'Driver', icon: 'car' },
  { id: '10', name: 'Other', icon: 'dots-horizontal' },
];

const ProfileSetup1Screen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const { updateUser, uploadUserImage } = useAuth(); // Add this line
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  const handleImagePicker = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => handleCamera(),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => handleGallery(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.8,
      },
      response => {
        if (response.assets && response.assets[0].uri) {
          setProfileImage(response.assets[0].uri);
        }
      },
    );
  };

  const handleGallery = () => {
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
  };

  const isFormValid = () => {
    return fullName.trim().length >= 3 && selectedSkill !== '';
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete', 'Please fill all required fields');
      return;
    }

    try {
      // Get the selected skill name
      const skillName = SKILLS.find(s => s.id === selectedSkill)?.name || '';

      // Navigate to next step with data
      navigation.navigate('ProfileSetup2', {
        name: fullName.trim(),
        skill: skillName,
        profileImageUri: profileImage,
      });
    } catch (error) {
      console.error('Error navigating:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderSkillItem = (skill: Skill) => {
    const isSelected = selectedSkill === skill.id;

    return (
      <TouchableOpacity
        key={skill.id}
        style={[styles.skillItem, isSelected && styles.skillItemSelected]}
        onPress={() => setSelectedSkill(skill.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.skillIconContainer,
            isSelected && styles.skillIconContainerSelected,
          ]}
        >
          <Icon
            name={skill.icon}
            size={24}
            color={isSelected ? COLORS.white : COLORS.primary}
          />
        </View>
        <Text
          style={[styles.skillName, isSelected && styles.skillNameSelected]}
        >
          {skill.name}
        </Text>
      </TouchableOpacity>
    );
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
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>Step 1 of 2</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>
              Let's set up your professional profile
            </Text>
          </View>

          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <Text style={styles.sectionLabel}>Profile Photo</Text>
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              {profileImage ? (
                <>
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                  <View style={styles.photoEditBadge}>
                    <Icon name="camera" size={16} color={COLORS.white} />
                  </View>
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Icon name="camera-plus" size={40} color={COLORS.primary} />
                  <Text style={styles.photoPlaceholderText}>
                    Tap to add photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.photoHint}>
              Add a clear photo of yourself (Optional)
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Icon name="account" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.gray400}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              {fullName.length > 0 && (
                <TouchableOpacity onPress={() => setFullName('')}>
                  <Icon name="close-circle" size={20} color={COLORS.gray400} />
                </TouchableOpacity>
              )}
            </View>
            {fullName.length > 0 && fullName.length < 3 && (
              <Text style={styles.errorText}>
                Name must be at least 3 characters
              </Text>
            )}
          </View>

          {/* Primary Skill */}
          <View style={styles.skillSection}>
            <Text style={styles.sectionLabel}>
              What is your primary skill? <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.skillHint}>
              Select the skill you're most experienced in
            </Text>
            <View style={styles.skillsGrid}>{SKILLS.map(renderSkillItem)}</View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid() && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isFormValid()}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileSetup1Screen;
