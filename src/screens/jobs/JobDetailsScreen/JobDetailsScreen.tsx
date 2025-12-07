import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './JobDetailsScreen.styles';
import { COLORS } from '../../../utils';
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

  const handleBack = () => {
    navigation.goBack();
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

  const handleSendResponse = () => {
    // Navigate back to jobs list and open quote modal
    // Or implement direct quote submission here
    navigation.goBack();
  };

  const handleNotInterested = () => {
    navigation.goBack();
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
              navigation.goBack();
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
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
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
          rightComponent={
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveJob}
              activeOpacity={0.7}
            >
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={isSaved ? COLORS.primary : COLORS.textPrimary}
              />
            </TouchableOpacity>
          }
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
                  <Text style={styles.customerRating}>New Customer</Text>
                </View>
              </View>
              <View style={styles.verifiedBadge}>
                <Icon name="check-decagram" size={20} color={COLORS.primary} />
              </View>
            </View>

            {/* Contact Buttons */}
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
                <Text style={styles.metaText}>Active</Text>
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

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Icon name="alert-circle" size={20} color={COLORS.warning} />
            <Text style={styles.warningText}>
              Only respond if you can commit to the job. Cancellations affect
              your rating.
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Actions */}
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
                  navigation.navigate('JobCompletion', { requestId: job._id })
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
            <>
              <TouchableOpacity
                style={styles.notInterestedButton}
                onPress={handleNotInterested}
                activeOpacity={0.7}
              >
                <Icon name="close" size={20} color={COLORS.error} />
                <Text style={styles.notInterestedText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendResponseButton}
                onPress={handleSendResponse}
                activeOpacity={0.8}
              >
                <Text style={styles.sendResponseText}>Respond</Text>
                <Icon name="send" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
