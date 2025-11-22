// src/screens/jobs/JobsListScreen/JobsListScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/Header/Header';
import { styles } from './JobsListScreen.styles';
import { COLORS } from '../../../utils';

interface Job {
  id: string;
  customerName: string;
  customerImage: string;
  customerRating: number;
  title: string;
  description: string;
  budget: string;
  distance: string;
  timeAgo: string;
  status: 'new' | 'active' | 'completed';
  duration?: string;
  startDate?: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    customerName: 'Amit Singh',
    customerImage: 'https://via.placeholder.com/50',
    customerRating: 4.5,
    title: 'House Wiring Needed',
    description:
      'Need complete house wiring for 2BHK apartment. Include all rooms, MCB board...',
    budget: '₹800-1000/day',
    distance: '3.5 km',
    timeAgo: '5 mins ago',
    status: 'new',
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    customerImage: 'https://via.placeholder.com/50',
    customerRating: 4.8,
    title: 'Kitchen Electrical Work',
    description:
      'Install new lights and power outlets in kitchen. Need modular switches...',
    budget: '₹600-800',
    distance: '5.2 km',
    timeAgo: '1 hour ago',
    status: 'new',
  },
  {
    id: '3',
    customerName: 'Rahul Verma',
    customerImage: 'https://via.placeholder.com/50',
    customerRating: 4.7,
    title: 'House Wiring',
    description: 'Complete house wiring in progress...',
    budget: '₹900/day',
    distance: '2.1 km',
    timeAgo: 'Started 2 days ago',
    status: 'active',
    duration: '3 days',
    startDate: '10 Nov',
  },
  {
    id: '4',
    customerName: 'Sunita Patel',
    customerImage: 'https://via.placeholder.com/50',
    customerRating: 4.9,
    title: 'Fan Installation',
    description: 'Installed 4 ceiling fans',
    budget: '₹800',
    distance: '4.3 km',
    timeAgo: 'Completed',
    status: 'completed',
  },
];

const JobsListScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<
    'new' | 'active' | 'completed'
  >('new');

  const filteredJobs = MOCK_JOBS.filter(job => job.status === selectedTab);

  const handleJobPress = (job: Job) => {
    if (job.status === 'new') {
      navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
    } else if (job.status === 'active') {
      navigation.navigate('CompleteJob' as never, { jobId: job.id } as never);
    } else {
      navigation.navigate('JobDetails' as never, { jobId: job.id } as never);
    }
  };

  const handleFilter = () => {
    // Filter functionality
  };

  const renderJobCard = (job: Job) => {
    const isNew = job.status === 'new';
    const isActive = job.status === 'active';
    const isCompleted = job.status === 'completed';

    return (
      <TouchableOpacity
        key={job.id}
        style={[styles.jobCard, isNew && styles.newJobCard]}
        onPress={() => handleJobPress(job)}
        activeOpacity={0.7}
      >
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}

        <View style={styles.customerSection}>
          <Image
            source={{ uri: job.customerImage }}
            style={styles.customerImage}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{job.customerName}</Text>
            <View style={styles.customerRatingContainer}>
              <Icon name="star" size={14} color="#F59E0B" />
              <Text style={styles.customerRating}>{job.customerRating}</Text>
            </View>
          </View>
          <View style={styles.locationBadge}>
            <Icon name="map-marker" size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>{job.distance}</Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobDescription} numberOfLines={2}>
            {job.description}
          </Text>
        </View>

        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Icon name="cash" size={18} color={COLORS.success} />
            <Text style={styles.metaText}>{job.budget}</Text>
          </View>

          {isActive && (
            <View style={styles.metaItem}>
              <Icon name="calendar" size={18} color={COLORS.primary} />
              <Text style={styles.metaText}>{job.duration}</Text>
            </View>
          )}

          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{job.timeAgo}</Text>
          </View>
        </View>

        <View style={styles.jobActions}>
          {isNew && (
            <>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
                <Icon name="phone" size={18} color={COLORS.primary} />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.respondButton}
                onPress={() =>
                  navigation.navigate(
                    'SendResponse' as never,
                    { jobId: job.id } as never,
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.respondButtonText}>Send Response</Text>
                <Icon name="arrow-right" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </>
          )}

          {isActive && (
            <>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
                <Icon name="phone" size={18} color={COLORS.primary} />
                <Text style={styles.callButtonText}>Call Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() =>
                  navigation.navigate(
                    'CompleteJob' as never,
                    { jobId: job.id } as never,
                  )
                }
                activeOpacity={0.7}
              >
                <Icon name="check-circle" size={18} color={COLORS.white} />
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            </>
          )}

          {isCompleted && (
            <View style={styles.completedBadge}>
              <Icon name="check-circle" size={18} color={COLORS.success} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const newJobsCount = MOCK_JOBS.filter(j => j.status === 'new').length;
  const activeJobsCount = MOCK_JOBS.filter(j => j.status === 'active').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Filter */}
        <Header
          variant="simple"
          title="Jobs"
          showMore
          onMorePress={handleFilter}
        />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'new' && styles.activeTab]}
            onPress={() => setSelectedTab('new')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'new' && styles.activeTabText,
              ]}
            >
              New Inquiries
            </Text>
            {newJobsCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{newJobsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === 'active' && styles.activeTab]}
            onPress={() => setSelectedTab('active')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'active' && styles.activeTabText,
              ]}
            >
              Active
            </Text>
            {activeJobsCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{activeJobsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'completed' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('completed')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'completed' && styles.activeTabText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.jobsList}
          contentContainerStyle={styles.jobsListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map(renderJobCard)
          ) : (
            <View style={styles.emptyState}>
              <Icon
                name={
                  selectedTab === 'new'
                    ? 'briefcase-outline'
                    : selectedTab === 'active'
                    ? 'briefcase-clock'
                    : 'check-circle-outline'
                }
                size={80}
                color={COLORS.gray300}
              />
              <Text style={styles.emptyStateTitle}>
                {selectedTab === 'new' && 'No New Inquiries'}
                {selectedTab === 'active' && 'No Active Jobs'}
                {selectedTab === 'completed' && 'No Completed Jobs'}
              </Text>
              <Text style={styles.emptyStateText}>
                {selectedTab === 'new' && 'New job inquiries will appear here'}
                {selectedTab === 'active' &&
                  'Your ongoing jobs will appear here'}
                {selectedTab === 'completed' &&
                  'Your completed jobs will appear here'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JobsListScreen;
