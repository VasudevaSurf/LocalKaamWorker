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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './AddVideoScreen.styles';
import { COLORS } from '../../../utils';
import * as api from '../../../services/api';
import Header from '../../../components/Header/Header';
import { useAuth } from '../../../context/AuthContext';

const VIDEO_CATEGORIES = [
  { id: '1', name: 'Electrical Work', icon: 'lightning-bolt' },
  { id: '2', name: 'Plumbing', icon: 'pipe-wrench' },
  { id: '3', name: 'Carpentry', icon: 'hammer' },
  { id: '4', name: 'Painting', icon: 'format-paint' },
  { id: '5', name: 'Cooking', icon: 'chef-hat' },
  { id: '6', name: 'Repair Work', icon: 'wrench' },
  { id: '7', name: 'Installation', icon: 'tools' },
  { id: '8', name: 'Other', icon: 'dots-horizontal' },
];

const AddVideoScreen = () => {
  const navigation = useNavigation();
  const { uploadUserVideo, user } = useAuth();

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleBack = () => {
    if (videoUri || title || description) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
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

  const handleVideoSelection = () => {
    Alert.alert('Add Video', 'Choose an option', [
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
      {
        mediaType: 'video',
        videoQuality: 'medium',
        durationLimit: 30,
      },
      response => {
        if (response.assets && response.assets[0].uri) {
          setVideoUri(response.assets[0].uri);
          // Generate thumbnail (in real app, extract from video)
          setThumbnailUri(response.assets[0].uri);
        }
      },
    );
  };

  const handleGalleryVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        videoQuality: 'medium',
      },
      response => {
        if (response.assets && response.assets[0].uri) {
          setVideoUri(response.assets[0].uri);
          setThumbnailUri(response.assets[0].uri);
        }
      },
    );
  };

  const handleAddTag = () => {
    if (currentTag.trim() && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return (
      videoUri !== null && title.trim().length >= 5 && selectedCategory !== ''
    );
  };

  const handlePublish = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete', 'Please fill all required fields');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    setIsUploading(true);

    try {
      if (videoUri) {
        // 1. Upload video to Firebase Storage
        const videoUrl = await uploadUserVideo(videoUri);

        // 2. Create work video document in database
        await api.uploadWorkVideo({
          workerId: user.id,
          workerName: user.name,
          serviceType: selectedCategory, // Mapping category ID to service type for now, or use name
          title,
          description,
          videoUrl,
          thumbnailUrl: thumbnailUri || '',
        });

        Alert.alert(
          'Success! 🎉',
          'Your video has been uploaded successfully!',
          [
            {
              text: 'Add Another',
              onPress: () => {
                setVideoUri(null);
                setThumbnailUri(null);
                setTitle('');
                setDescription('');
                setSelectedCategory('');
                setTags([]);
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', 'Please try again later.');
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
          title="Add Skill Video"
          showMore
          onMorePress={() =>
            Alert.alert(
              'Tips',
              'Record a 10-30 second video showing your work skills',
            )
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Video Upload Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Video <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Record or upload a 10-30 second video
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
                  <Icon name="play-circle" size={60} color={COLORS.white} />
                </View>
                <TouchableOpacity
                  style={styles.removeVideoButton}
                  onPress={() => {
                    setVideoUri(null);
                    setThumbnailUri(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.videoDuration}>
                  <Icon name="clock-outline" size={14} color={COLORS.white} />
                  <Text style={styles.videoDurationText}>0:15</Text>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={[styles.uploadButton, { flex: 1 }]}
                  onPress={handleRecordVideo}
                  activeOpacity={0.7}
                >
                  <Icon name="camera" size={32} color={COLORS.primary} />
                  <Text
                    style={[
                      styles.uploadButtonText,
                      { fontSize: 14, marginTop: 8 },
                    ]}
                  >
                    Record Video
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.uploadButton, { flex: 1 }]}
                  onPress={handleGalleryVideo}
                  activeOpacity={0.7}
                >
                  <Icon name="folder-image" size={32} color={COLORS.primary} />
                  <Text
                    style={[
                      styles.uploadButtonText,
                      { fontSize: 14, marginTop: 8 },
                    ]}
                  >
                    From Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Requirements */}
            <View style={styles.requirementsBox}>
              <View style={styles.requirementItem}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.requirementText}>
                  10-30 seconds duration
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.requirementText}>
                  Portrait mode preferred
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.requirementText}>
                  Maximum 50MB file size
                </Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Video Title <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Short, clear title describing your work
            </Text>
            <View style={styles.inputContainer}>
              <Icon name="text" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., House Wiring Installation"
                placeholderTextColor={COLORS.gray400}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>
            <Text style={styles.characterCount}>
              {title.length}/50 characters
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description (Optional)</Text>
            <Text style={styles.sectionHint}>
              Describe what's shown in the video
            </Text>
            <View style={styles.textareaContainer}>
              <TextInput
                style={styles.textarea}
                placeholder="Showing complete house wiring process including MCB board installation, power outlets, and light fixtures..."
                placeholderTextColor={COLORS.gray400}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.characterCount}>
              {description.length}/200 characters
            </Text>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.sectionHint}>
              Select the type of work shown
            </Text>
            <View style={styles.categoriesGrid}>
              {VIDEO_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id &&
                      styles.categoryItemSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={category.icon}
                    size={24}
                    color={
                      selectedCategory === category.id
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id &&
                        styles.categoryTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags (Optional)</Text>
            <Text style={styles.sectionHint}>
              Add up to 5 tags to help customers find your video
            </Text>

            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="e.g., wiring, installation"
                placeholderTextColor={COLORS.gray400}
                value={currentTag}
                onChangeText={setCurrentTag}
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity
                style={[
                  styles.addTagButton,
                  (!currentTag.trim() || tags.length >= 5) &&
                    styles.addTagButtonDisabled,
                ]}
                onPress={handleAddTag}
                disabled={!currentTag.trim() || tags.length >= 5}
                activeOpacity={0.7}
              >
                <Icon name="plus" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(index)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.tagCounter}>{tags.length}/5 tags</Text>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="lightbulb" size={20} color="#D97706" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Tips for Great Videos:</Text>
              <Text style={styles.infoText}>
                • Show your best work clearly{'\n'}• Use good lighting{'\n'}•
                Keep it steady{'\n'}• Add clear audio if possible
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.saveDraftButton}
            onPress={() => {
              Alert.alert('Draft Saved', 'You can continue editing later');
              navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <Icon
              name="content-save-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.publishButton,
              !isFormValid() && styles.publishButtonDisabled,
            ]}
            onPress={handlePublish}
            disabled={!isFormValid() || isUploading}
            activeOpacity={0.8}
          >
            {isUploading ? (
              <Text style={styles.publishButtonText}>Uploading...</Text>
            ) : (
              <>
                <Icon name="upload" size={20} color={COLORS.white} />
                <Text style={styles.publishButtonText}>Publish</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddVideoScreen;
