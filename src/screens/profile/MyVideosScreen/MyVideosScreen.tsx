import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import * as api from '../../../services/api';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';
import { styles } from './MyVideosScreen.styles';

const ITEMS_PER_PAGE = 10;
const ITEM_HEIGHT = 106; // Height of video card (90) + margin (16)

const MyVideosScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch videos from API
  const fetchVideos = async () => {
    if (!user?.id) {
      console.log('[MyVideosScreen] No user ID, skipping fetch');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[MyVideosScreen] Fetching videos for user:', user.id);
      console.log('[MyVideosScreen] Fetching videos for user:', user.id);
      const fetchedVideos = await api.getWorkerVideos(user.id);
      console.log('[MyVideosScreen] Fetched videos:', fetchedVideos);
      setVideos(fetchedVideos);
      setDisplayedVideos(fetchedVideos.slice(0, ITEMS_PER_PAGE));
      setPage(1);
    } catch (error) {
      console.error('[MyVideosScreen] Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize videos
  useEffect(() => {
    fetchVideos();
  }, [user?.id]);

  const loadMoreVideos = () => {
    if (!videos || isLoadingMore) return;

    const totalVideos = videos.length;
    if (displayedVideos.length >= totalVideos) return;

    setIsLoadingMore(true);

    // Simulate network delay for smooth UX
    setTimeout(() => {
      const nextPage = page + 1;
      const newVideos = videos.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedVideos(newVideos);
      setPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  const handleVideoPress = (video: any) => {
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
          <Text style={styles.statsText}>{item.views || 0} views</Text>
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
        title={`My Videos (${videos.length})`}
        showBack
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading videos...</Text>
          </View>
        ) : (
          <FlatList
            data={displayedVideos}
            renderItem={renderVideoItem}
            keyExtractor={(item, index) => item._id || index.toString()}
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default MyVideosScreen;
