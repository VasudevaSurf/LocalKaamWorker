import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './JobCompletionScreen.styles';
import { COLORS } from '../../../utils';
import * as api from '../../../services/api';
import Header from '../../../components/Header/Header';
import { useAuth } from '../../../context/AuthContext';

const JobCompletionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId } = route.params as { requestId: string };
  const { uploadUserVideo, user } = useAuth(); // Use same upload logic

  const [otp, setOtp] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleVideoSelection = () => {
    Alert.alert('Upload Proof of Work', 'Choose an option', [
      {
        text: 'Record Video',
        onPress: () => handleRecordVideo(),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => handleGalleryVideo(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleRecordVideo = () => {
    launchCamera(
      { mediaType: 'video', videoQuality: 'medium', durationLimit: 60 },
      response => {
        if (response.assets && response.assets[0].uri) {
          setVideoUri(response.assets[0].uri);
          setThumbnailUri(response.assets[0].uri); // In real app, generate thumb
        }
      },
    );
  };

  const handleGalleryVideo = () => {
    launchImageLibrary(
      { mediaType: 'video', videoQuality: 'medium' },
      response => {
        if (response.assets && response.assets[0].uri) {
          setVideoUri(response.assets[0].uri);
          setThumbnailUri(response.assets[0].uri);
        }
      },
    );
  };

  const handleCompleteJob = async () => {
    if (otp.length !== 4) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 4-digit code provided by the customer.',
      );
      return;
    }

    if (!videoUri) {
      Alert.alert(
        'Video Required',
        'Please upload a video showing the completed work.',
      );
      return;
    }

    if (!user?.id) return;

    setIsUploading(true);

    try {
      // 1. Upload Video
      const videoUrl = await uploadUserVideo(videoUri);

      // 2. Call API to complete job
      await api.completeJob(requestId, otp, videoUrl, user.id);

      Alert.alert(
        'Success! 🎉',
        'Job marked as completed. Payment will be processed shortly.',
        [
          {
            text: 'Great',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'JobsList' as never }],
              });
            },
          },
        ],
      );
    } catch (error: any) {
      console.error('Job completion failed:', error);
      const msg =
        error.response?.data?.msg ||
        'Failed to complete job. Please check the OTP and try again.';
      Alert.alert('Error', msg);
    } finally {
      setIsUploading(false);
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
          title="Complete Job"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* OTP Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Enter Verification Code</Text>
            <Text style={styles.sectionSubtitle}>
              Ask the customer for the 4-digit OTP shown on their screen.
            </Text>
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={4}
                placeholder="0 0 0 0"
                placeholderTextColor={COLORS.gray300}
              />
            </View>
          </View>

          {/* Video Upload Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Upload Proof of Work</Text>
            <Text style={styles.sectionSubtitle}>
              Upload a short video showing the completed service.
            </Text>

            {videoUri ? (
              <View style={styles.videoPreview}>
                <Image
                  source={{
                    uri: thumbnailUri || 'https://via.placeholder.com/300x200',
                  }}
                  style={styles.videoThumbnail}
                />
                <View style={styles.videoOverlay}>
                  <Icon name="check-circle" size={48} color={COLORS.success} />
                </View>
                <TouchableOpacity
                  style={styles.removeVideoButton}
                  onPress={() => {
                    setVideoUri(null);
                    setThumbnailUri(null);
                  }}
                >
                  <Icon name="close" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadContainer}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleRecordVideo}
                >
                  <Icon name="camera" size={32} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Record</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleGalleryVideo}
                >
                  <Icon name="folder-image" size={32} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              (otp.length !== 4 || !videoUri || isUploading) &&
                styles.completeButtonDisabled,
            ]}
            onPress={handleCompleteJob}
            disabled={otp.length !== 4 || !videoUri || isUploading}
          >
            {isUploading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator
                  size="small"
                  color={COLORS.white}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.completeButtonText}>
                  Verifying & Uploading...
                </Text>
              </View>
            ) : (
              <Text style={styles.completeButtonText}>
                Verify & Complete Job
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JobCompletionScreen;
