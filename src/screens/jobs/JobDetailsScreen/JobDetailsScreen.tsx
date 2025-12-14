import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../../utils';
import Header from '../../../components/Header/Header';
import * as api from '../../../services/api';

import { useAuth } from '../../../context/AuthContext';

const JobDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getServiceRequestById(jobId);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      Alert.alert('Error', 'Failed to load job details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (job?.customerPhone) {
      Linking.openURL(`tel:${job.customerPhone}`);
    }
  };

  const handleWhatsApp = () => {
    if (job?.customerPhone) {
      const phone = job.customerPhone.replace('+', '');
      const message = `Hi ${job.customerName}, I'm interested in your job: ${job.serviceType}`;
      Linking.openURL(
        `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`,
      );
    }
  };

  const handleViewLocation = () => {
    if (job?.location?.address) {
      const encodedAddress = encodeURIComponent(job.location.address);
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      );
    }
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
  };

  const handleCancelJob = () => {
    Alert.alert(
      'Cancel Job',
      'Are you sure you want to cancel this job? This may affect your rating.',
      [
        { text: 'Keep Job', style: 'cancel' },
        {
          text: 'Cancel Job',
          style: 'destructive',
          onPress: async () => {
            if (!user?.id) return;
            try {
              setLoading(true);
              await api.cancelJob(jobId, user.id);
              Alert.alert(
                'Job Cancelled',
                'You have successfully cancelled this job.',
              );
              navigation.navigate('JobsList' as never);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel job. Please try again.');
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!job) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Header
          variant="simple"
          showBack
          title="Job Details"
          showMore
          onMorePress={handleSaveJob}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Section */}
          <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <View
                style={[
                  styles.customerImage,
                  {
                    backgroundColor: COLORS.gray100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <Icon name="account" size={30} color={COLORS.gray400} />
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{job.customerName}</Text>
                <View style={styles.customerRatingContainer}>
                  <Icon name="star" size={16} color="#F59E0B" />
                  <Text style={styles.customerRating}>Verified Customer</Text>
                </View>
              </View>
              <View style={styles.verifiedBadge}>
                <Icon name="check-decagram" size={20} color={COLORS.primary} />
              </View>
            </View>

            {/* Contact Buttons - Only for Accepted Jobs */}
            {job.status === 'accepted' || job.status === 'quoted' ? (
              <View style={styles.contactButtons}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleCall}
                  activeOpacity={0.7}
                >
                  <Icon name="phone" size={20} color={COLORS.white} />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.contactButton, { backgroundColor: '#25D366' }]}
                  onPress={handleWhatsApp}
                  activeOpacity={0.7}
                >
                  <Icon name="whatsapp" size={20} color={COLORS.white} />
                  <Text style={styles.contactButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* Job Title & Description */}
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.serviceType}</Text>

            {/* Time & Viewers */}
            <View style={styles.jobMetaRow}>
              <View style={styles.metaItem}>
                <Icon
                  name="clock-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}>
                  {new Date(job.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Icon
                  name="eye-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}>{job.status.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.jobDescription}>{job.description}</Text>
          </View>

          {/* Job Details Grid */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Job Details</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon name="cash" size={24} color={COLORS.success} />
                </View>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>₹{job.budget}</Text>
                <Text style={styles.detailSubValue}>Fixed</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon
                    name="calendar-clock"
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.detailLabel}>Urgency</Text>
                <Text style={styles.detailValue}>{job.urgency}</Text>
                <Text style={styles.detailSubValue}>Priority</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon name="map-marker" size={24} color={COLORS.error} />
                </View>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {job.location?.city || 'Unknown'}
                </Text>
                <Text style={styles.detailSubValue}>City</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContent}>
              <Icon name="map-marker" size={20} color={COLORS.error} />
              <Text style={styles.locationText}>{job.location?.address}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewMapButton}
              onPress={handleViewLocation}
              activeOpacity={0.7}
            >
              <Icon name="map-outline" size={18} color={COLORS.primary} />
              <Text style={styles.viewMapText}>View on Map</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {job.status === 'accepted' ? (
            <React.Fragment>
              <TouchableOpacity
                style={[
                  styles.notInterestedButton,
                  { borderColor: COLORS.error, borderWidth: 1 },
                ]}
                onPress={handleCancelJob}
                activeOpacity={0.7}
              >
                <Icon name="close-circle" size={20} color={COLORS.error} />
                <Text
                  style={[styles.notInterestedText, { color: COLORS.error }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sendResponseButton,
                  { backgroundColor: COLORS.success },
                ]}
                onPress={() =>
                  navigation.navigate(
                    'JobCompletion' as never,
                    { requestId: job._id } as never,
                  )
                }
                activeOpacity={0.8}
              >
                <Text style={styles.sendResponseText}>Complete Job</Text>
                <Icon name="check-circle" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </React.Fragment>
          ) : job.status === 'completed' ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: COLORS.success,
                }}
              >
                Job Completed
              </Text>
            </View>
          ) : (
            // Fallback for pending view if somehow reached (should depend on EnqDetails now)
            <View style={{ alignItems: 'center' }}>
              <Text>Status: {job.status}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  customerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  customerRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  customerRating: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    marginLeft: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  jobMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontFamily: FONTS.regular,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    width: '30%',
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    marginTop: 4,
    textAlign: 'center',
  },
  detailSubValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    gap: 6,
  },
  viewMapText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    gap: 12,
    elevation: 10,
  },
  notInterestedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: 8,
  },
  notInterestedText: {
    color: COLORS.error,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  sendResponseButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    gap: 8,
  },
  sendResponseText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
});

export default JobDetailsScreen;
