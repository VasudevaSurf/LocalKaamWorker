import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

const { width } = Dimensions.get('window');

const VideoDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { video } = route.params as { video: any };
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="simple"
        title="Video Details"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: video.videoUrl }}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
            paused={paused}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{video.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="calendar" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {new Date(video.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="eye" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>0 views</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {video.description || 'No description provided.'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipContainer}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{video.category}</Text>
            </View>
          </View>

          {video.tags && video.tags.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.chipContainer}>
                {video.tags.map((tag: string, index: number) => (
                  <View key={index} style={[styles.chip, styles.tagChip]}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.backgroundGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChip: {
    backgroundColor: '#EFF6FF',
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default VideoDetailScreen;
