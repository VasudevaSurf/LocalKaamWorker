import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header/Header';
import { styles } from './DashboardHomeScreen.styles';
import { COLORS } from '../../../utils';

const DashboardHomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddVideo = () => {
    navigation.navigate('AddVideo' as never);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Reusable Header Component */}
      <Header
        variant="profile"
        showProfile={true}
        profileImage="https://via.placeholder.com/50"
        profileName="Rajesh Kumar"
        greeting="Welcome back,"
        showOnlineBadge={true}
        onProfilePress={handleProfilePress}
        showNotification={true}
        notificationCount={3}
        onNotificationPress={handleNotifications}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#2563EB', '#1E40AF']}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsIconContainer}>
              <Icon name="wallet" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.statsLabel}>This Month</Text>
            <Text style={styles.statsValue}>₹24,800</Text>
            <View style={styles.statsChange}>
              <Icon name="trending-up" size={16} color="#10B981" />
              <Text style={styles.statsChangeText}>+32% vs last month</Text>
            </View>
          </LinearGradient>

          <View style={styles.statsRow}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.smallStatsCard}
            >
              <Icon name="briefcase" size={24} color="#D97706" />
              <Text style={[styles.smallStatsValue, { color: '#92400E' }]}>
                23
              </Text>
              <Text style={[styles.smallStatsLabel, { color: '#78350F' }]}>
                Jobs Done
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={['#DBEAFE', '#BFDBFE']}
              style={styles.smallStatsCard}
            >
              <Icon name="star" size={24} color="#1E40AF" />
              <Text style={[styles.smallStatsValue, { color: '#1E3A8A' }]}>
                4.8
              </Text>
              <Text style={[styles.smallStatsLabel, { color: '#1E40AF' }]}>
                Rating
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleAddVideo}
              activeOpacity={0.7}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: '#EFF6FF' }]}
              >
                <Icon name="video-plus" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Add Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.7}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}
              >
                <Icon name="briefcase-outline" size={28} color="#D97706" />
              </View>
              <Text style={styles.quickActionText}>View Jobs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.7}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}
              >
                <Icon name="chart-line" size={28} color="#059669" />
              </View>
              <Text style={styles.quickActionText}>Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3' }]}
              >
                <Icon name="account-edit" size={28} color="#BE185D" />
              </View>
              <Text style={styles.quickActionText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Completion */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Strength</Text>
            <Text style={styles.sectionSubtitle}>85%</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: '85%' }]}
              />
            </View>

            <View style={styles.profileTips}>
              <View style={styles.profileTip}>
                <Icon name="check-circle" size={20} color={COLORS.success} />
                <Text style={styles.profileTipText}>Profile photo added</Text>
              </View>
              <View style={styles.profileTip}>
                <Icon name="check-circle" size={20} color={COLORS.success} />
                <Text style={styles.profileTipText}>Basic info completed</Text>
              </View>
              <View style={styles.profileTip}>
                <Icon name="alert-circle" size={20} color={COLORS.warning} />
                <Text style={styles.profileTipText}>Add more skill videos</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.improveButton} activeOpacity={0.7}>
              <Text style={styles.improveButtonText}>Improve Profile</Text>
              <Icon name="arrow-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Icon name="cash" size={24} color={COLORS.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Payment Received</Text>
              <Text style={styles.activityDescription}>
                From Amit Singh - House Wiring
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityAmount}>+₹2,400</Text>
          </View>

          <View style={styles.activityCard}>
            <View
              style={[
                styles.activityIconContainer,
                { backgroundColor: '#EFF6FF' },
              ]}
            >
              <Icon name="briefcase" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Job Inquiry</Text>
              <Text style={styles.activityDescription}>
                Kitchen Electrical Work
              </Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
          </View>

          <View style={styles.activityCard}>
            <View
              style={[
                styles.activityIconContainer,
                { backgroundColor: '#FEF3C7' },
              ]}
            >
              <Icon name="star" size={24} color="#D97706" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Review</Text>
              <Text style={styles.activityDescription}>
                5 stars from Priya Sharma
              </Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardHomeScreen;
