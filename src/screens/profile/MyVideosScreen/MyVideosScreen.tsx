import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import { useAuth } from '../../../context/AuthContext';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

const ITEMS_PER_PAGE = 10;
const ITEM_HEIGHT = 106; // Height of video card (90) + margin (16)

const MyVideosScreen = () => {
  const navigation = useNavigation();
  const { user, refreshUserProfile } = useAuth();
  const [displayedVideos, setDisplayedVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize videos
  useEffect(() => {
    if (user?.workVideos) {
      setDisplayedVideos(user.workVideos.slice(0, ITEMS_PER_PAGE));
    }
  }, [user?.workVideos]);

  const loadMoreVideos = () => {
    if (!user?.workVideos || isLoadingMore) return;

    const totalVideos = user.workVideos.length;
    if (displayedVideos.length >= totalVideos) return;

    setIsLoadingMore(true);

    // Simulate network delay for smooth UX
    setTimeout(() => {
      const nextPage = page + 1;
      const newVideos = user.workVideos!.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedVideos(newVideos);
      setPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUserProfile(true); // Force refresh from API
    setRefreshing(false);
    setPage(1); // Reset pagination
  };

  const handleVideoPress = (video: any) => {
    // Fix: Use 'as never' to bypass type check for now
    navigation.navigate('VideoDetail' as never, { video } as never);
  };

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => handleVideoPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <Video
            source={{ uri: item.videoUrl }}
            style={styles.thumbnail}
            paused={true}
            muted={true}
            resizeMode="cover"
          />
        )}

        <View style={styles.playOverlay}>
          <Icon name="play-circle" size={40} color={COLORS.white} />
        </View>

        {item.duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        ) : (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>05:30</Text>
          </View>
        )}
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.statsRow}>
          <Icon name="eye" size={14} color={COLORS.textSecondary} />
          <Text style={styles.statsText}>0 views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        variant="simple"
        title={`My Videos (${user?.workVideos?.length || 0})`}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <FlatList
          data={displayedVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Performance Props
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          // Pagination & Refresh
          onEndReached={loadMoreVideos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="video-off" size={64} color={COLORS.gray200} />
              <Text style={styles.emptyText}>No videos uploaded yet</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => navigation.navigate('AddVideo' as never)}
              >
                <Text style={styles.uploadButtonText}>Upload New Video</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
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
    backgroundColor: COLORS.backgroundGray,
  },
  listContent: {
    padding: 16,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 90, // Fixed height for getItemLayout
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
    backgroundColor: COLORS.black,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  videoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  videoDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default MyVideosScreen;
