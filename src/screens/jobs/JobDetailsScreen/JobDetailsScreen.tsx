import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './JobDetailsScreen.styles';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

// Mock job data - in real app, fetch from API using jobId
const MOCK_JOB = {
  id: '1',
  customerName: 'Amit Singh',
  customerImage: 'https://via.placeholder.com/50',
  customerRating: 4.5,
  customerReviews: 12,
  customerPhone: '+919876543210',
  title: 'House Wiring Needed',
  description:
    'Need complete house wiring for my 2BHK apartment. The work includes:\n\n• All room wiring (bedroom, living room, kitchen)\n• MCB board installation\n• Light points installation\n• Power socket installation\n• Fan points\n• Quality materials required\n\nI need someone experienced who can complete the work professionally.',
  budget: '₹800-1000',
  budgetType: 'per day',
  duration: '3-4 days',
  startDate: 'ASAP',
  location: 'H-123, Model Town, Ludhiana, Punjab',
  distance: '3.5 km',
  timeAgo: '5 mins ago',
  images: [
    'https://via.placeholder.com/300x200',
    'https://via.placeholder.com/300x200',
  ],
  requirements: [
    'Experienced electrician',
    'Own tools required',
    'Quality work essential',
    'Complete in time',
  ],
  status: 'new',
  viewersCount: 3,
};

const JobDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isSaved, setIsSaved] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCall = () => {
    Linking.openURL(`tel:${MOCK_JOB.customerPhone}`);
  };

  const handleWhatsApp = () => {
    const phone = MOCK_JOB.customerPhone.replace('+', '');
    const message = `Hi ${MOCK_JOB.customerName}, I'm interested in your job: ${MOCK_JOB.title}`;
    Linking.openURL(
      `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`,
    );
  };

  const handleSendResponse = () => {
    navigation.navigate(
      'SendResponse' as never,
      { jobId: MOCK_JOB.id } as never,
    );
  };

  const handleNotInterested = () => {
    // TODO: Mark as not interested
    navigation.goBack();
  };

  const handleViewLocation = () => {
    // TODO: Open maps
    const encodedAddress = encodeURIComponent(MOCK_JOB.location);
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    );
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
  };

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
              <Image
                source={{ uri: MOCK_JOB.customerImage }}
                style={styles.customerImage}
              />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{MOCK_JOB.customerName}</Text>
                <View style={styles.customerRatingContainer}>
                  <Icon name="star" size={16} color="#F59E0B" />
                  <Text style={styles.customerRating}>
                    {MOCK_JOB.customerRating} ({MOCK_JOB.customerReviews}{' '}
                    reviews)
                  </Text>
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
            <Text style={styles.jobTitle}>{MOCK_JOB.title}</Text>

            {/* Time & Viewers */}
            <View style={styles.jobMetaRow}>
              <View style={styles.metaItem}>
                <Icon
                  name="clock-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}>{MOCK_JOB.timeAgo}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon
                  name="eye-outline"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.metaText}>
                  {MOCK_JOB.viewersCount} workers viewing
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.jobDescription}>{MOCK_JOB.description}</Text>
          </View>

          {/* Images */}
          {MOCK_JOB.images.length > 0 && (
            <View style={styles.imagesCard}>
              <Text style={styles.sectionTitle}>Job Photos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScroll}
              >
                {MOCK_JOB.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.jobImage}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Job Details Grid */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Job Details</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon name="cash" size={24} color={COLORS.success} />
                </View>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>{MOCK_JOB.budget}</Text>
                <Text style={styles.detailSubValue}>{MOCK_JOB.budgetType}</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon
                    name="calendar-clock"
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{MOCK_JOB.duration}</Text>
                <Text style={styles.detailSubValue}>estimated</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon
                    name="calendar-start"
                    size={24}
                    color={COLORS.warning}
                  />
                </View>
                <Text style={styles.detailLabel}>Start Date</Text>
                <Text style={styles.detailValue}>{MOCK_JOB.startDate}</Text>
                <Text style={styles.detailSubValue}>flexible</Text>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Icon name="map-marker" size={24} color={COLORS.error} />
                </View>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>{MOCK_JOB.distance}</Text>
                <Text style={styles.detailSubValue}>from you</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationCard}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContent}>
              <Icon name="map-marker" size={20} color={COLORS.error} />
              <Text style={styles.locationText}>{MOCK_JOB.location}</Text>
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

          {/* Requirements */}
          <View style={styles.requirementsCard}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {MOCK_JOB.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Icon name="check-circle" size={18} color={COLORS.success} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
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
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.notInterestedButton}
            onPress={handleNotInterested}
            activeOpacity={0.7}
          >
            <Icon name="close" size={20} color={COLORS.error} />
            <Text style={styles.notInterestedText}>Not Interested</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendResponseButton}
            onPress={handleSendResponse}
            activeOpacity={0.8}
          >
            <Text style={styles.sendResponseText}>Send Response</Text>
            <Icon name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
