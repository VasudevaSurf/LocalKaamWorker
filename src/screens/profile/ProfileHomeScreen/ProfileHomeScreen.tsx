import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './ProfileHomeScreen.styles';
import { COLORS } from '../../../utils';
import * as api from '../../../services/api';

const ProfileHomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout, refreshUserProfile } = useAuth(); // Get user from context
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.phoneNumber) {
        refreshUserProfile(true); // Force refresh from server
      }
    }, []), // Dependencies empty to run on focus
  );

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      console.log('[ProfileHomeScreen] User ID:', user?.id);
      if (!user?.id) {
        console.log('[ProfileHomeScreen] No user ID, skipping video fetch');
        setIsLoadingVideos(false);
        return;
      }

      try {
        console.log('[ProfileHomeScreen] Fetching videos for user:', user.id);
        const fetchedVideos = await api.getWorkerVideos(user.id);
        console.log('[ProfileHomeScreen] Fetched videos:', fetchedVideos);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('[ProfileHomeScreen] Error fetching videos:', error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [user?.id]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const handleHelp = () => {
    navigation.navigate('Help' as never);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Profile link copied to clipboard!');
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Cover */}
          <LinearGradient
            colors={['#2563EB', '#1E40AF']}
            style={styles.coverSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShareProfile}
                activeOpacity={0.7}
              >
                <Icon name="share-variant" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleSettings}
                activeOpacity={0.7}
              >
                <Icon name="cog" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: user.profileImage || 'https://via.placeholder.com/150',
                }}
                style={styles.profileImage}
              />
              {user.profileComplete && (
                <View style={styles.verifiedBadge}>
                  <Icon
                    name="check-decagram"
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
              )}
            </View>

            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileSkill}>{user.skill}</Text>

            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Icon name="star" size={20} color="#FCD34D" />
                <Text style={styles.statValue}>
                  {user.rating ? user.rating.toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="briefcase" size={20} color={COLORS.white} />
                <Text style={styles.statValue}>{user.jobsCount || 0}</Text>
                <Text style={styles.statLabel}>Jobs Done</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="account-group" size={20} color={COLORS.white} />
                <Text style={styles.statValue}>{user.ratingCount || 0}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Edit Profile Button */}
          <View style={styles.editButtonContainer}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <Icon name="pencil" size={18} color={COLORS.white} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Icon name="map-marker" size={20} color={COLORS.primary} />
              <Text style={styles.infoCardText}>
                {user.city ? `${user.city.name}, ${user.city.state}` : 'N/A'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Icon name="briefcase" size={20} color={COLORS.success} />
              <Text style={styles.infoCardText}>
                {user.experience?.label || 'N/A'} experience
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Icon name="phone" size={20} color={COLORS.warning} />
              <Text style={styles.infoCardText}>{user.phoneNumber}</Text>
            </View>
          </View>

          {/* Performance Metrics - Static for now */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>

            <View style={styles.metricsCard}>
              <View style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Icon name="eye" size={20} color={COLORS.info} />
                  <Text style={styles.metricLabel}>Profile Views</Text>
                </View>
                <Text style={styles.metricValue}>0</Text>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Icon name="reply" size={20} color={COLORS.success} />
                  <Text style={styles.metricLabel}>Response Rate</Text>
                </View>
                <Text style={[styles.metricValue, { color: COLORS.success }]}>
                  100%
                </Text>
              </View>

              <View style={styles.metricRow}>
                <View style={styles.metricLeft}>
                  <Icon name="star" size={20} color="#F59E0B" />
                  <Text style={styles.metricLabel}>Average Rating</Text>
                </View>
                <Text style={[styles.metricValue, { color: '#F59E0B' }]}>
                  {user.rating ? `${user.rating.toFixed(1)}/5.0` : '0.0/5.0'}
                </Text>
              </View>
            </View>
          </View>

          {/* My Videos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                My Videos ({videos.length})
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MyVideos' as never)}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.videosScroll}
            >
              {videos.slice(0, 5).map((video, index) => (
                <TouchableOpacity
                  key={video._id || index}
                  style={styles.videoCard}
                  onPress={() =>
                    navigation.navigate('VideoDetail', { video } as never)
                  }
                  activeOpacity={0.7}
                >
                  {video.thumbnailUrl ? (
                    <Image
                      source={{ uri: video.thumbnailUrl }}
                      style={styles.videoThumbnail}
                    />
                  ) : (
                    <Video
                      source={{ uri: video.videoUrl }}
                      style={styles.videoThumbnail}
                      paused={true}
                      muted={true}
                      resizeMode="cover"
                      controls={false}
                    />
                  )}
                  <View style={styles.videoOverlay}>
                    <Icon name="play-circle" size={40} color={COLORS.white} />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={1}>
                      {video.title}
                    </Text>
                    <View style={styles.videoMeta}>
                      <Icon name="eye" size={12} color={COLORS.white} />
                      <Text style={styles.videoViews}>
                        {video.views || 0} views
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.addVideoCard}
                onPress={() => navigation.navigate('AddVideo' as never)}
                activeOpacity={0.7}
              >
                <Icon name="plus-circle" size={48} color={COLORS.primary} />
                <Text style={styles.addVideoText}>Add New Video</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Menu Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Icon name="account-edit" size={22} color={COLORS.primary} />
                  <Text style={styles.menuText}>Edit Profile</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('MyVideos' as never)}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Icon name="video" size={22} color={COLORS.success} />
                  <Text style={styles.menuText}>My Videos</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Reviews' as never)}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Icon name="star" size={22} color="#F59E0B" />
                  <Text style={styles.menuText}>Reviews & Ratings</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleSettings}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Icon name="cog" size={22} color={COLORS.textSecondary} />
                  <Text style={styles.menuText}>Settings</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleHelp}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Icon name="help-circle" size={22} color={COLORS.info} />
                  <Text style={styles.menuText}>Help & Support</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Icon name="logout" size={20} color={COLORS.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>SkillProof Worker v1.0.0</Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileHomeScreen;
