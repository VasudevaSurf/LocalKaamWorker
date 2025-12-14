// src/screens/jobs/JobsListScreen/JobsListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Header from '../../../components/Header/Header';
import { styles } from './JobsListScreen.styles';
import { COLORS } from '../../../utils';
import * as api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import SocketService from '../../../services/SocketService';

interface ServiceRequest {
  _id: string;
  customerId: string;
  customerPhone: string;
  customerName: string;
  serviceType: string;
  description: string;
  location: {
    address: string;
    city?: string;
    area?: string;
    pincode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  budget: number;
  urgency: string;
  scheduledDate?: string;
  status: string;
  quotesCount: number;
  createdAt: string;
  updatedAt: string;
  myQuote?: {
    quotedPrice: number;
    message: string;
    status: string;
  };
}

const JobsListScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<
    'new' | 'active' | 'completed'
  >('new');
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const route = useRoute();
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  // Worker Location State
  const [workerLocation, setWorkerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Quote modal state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [quotedPrice, setQuotedPrice] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkInitialTab();
    getCurrentLocation();
  }, []);

  // Handle Highlight Params
  useEffect(() => {
    // @ts-ignore
    const { highlightJobId } = route.params || {};
    if (highlightJobId) {
      console.log('[Jobs] Highlighting job:', highlightJobId);
      setSelectedTab('new');
      setHighlightedJobId(highlightJobId);
      const timer = setTimeout(() => {
        setHighlightedJobId(null);
        navigation.setParams({ highlightJobId: null } as never);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedTab === 'new') {
      fetchPendingRequests();
    } else if (selectedTab === 'active') {
      fetchActiveRequests();
    }
  }, [selectedTab]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setWorkerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log('Error getting location', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const calculateDistance = (
    lat1?: number,
    lon1?: number,
    lat2?: number,
    lon2?: number,
  ) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const checkInitialTab = async () => {
    if (!user?.id) return;
    try {
      const active = await api.getWorkerActiveRequests(user.id);
      if (active && active.length > 0) {
        setSelectedTab('active');
        setActiveRequests(active);
      } else {
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error checking initial tab:', error);
      fetchPendingRequests();
    }
  };

  useEffect(() => {
    SocketService.onNewRequest(data => {
      console.log('[Jobs] New request received:', data);
      if (selectedTab === 'new') {
        fetchPendingRequests();
      }
    });

    SocketService.onRequestAccepted(data => {
      console.log('[Jobs] Request accepted:', data);
      if (data.workerId === user?.id) {
        Alert.alert('Congratulations! 🎉', 'Your quote has been accepted!');
        setSelectedTab('active');
        fetchActiveRequests();
      } else {
        if (selectedTab === 'new') {
          fetchPendingRequests();
        }
      }
    });

    return () => {
      SocketService.offNewRequest();
      SocketService.offRequestAccepted();
    };
  }, [selectedTab, user]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const requests = await api.getPendingRequests(undefined, user?.id);
      setPendingRequests(requests || []);
    } catch (error) {
      console.error('[Jobs] Error fetching pending requests:', error);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveRequests = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const requests = await api.getWorkerActiveRequests(user.id);
      setActiveRequests(requests || []);
    } catch (error) {
      console.error('[Jobs] Error fetching active requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    getCurrentLocation(); // Refresh location too
    if (selectedTab === 'new') {
      await fetchPendingRequests();
    } else if (selectedTab === 'active') {
      await fetchActiveRequests();
    }
    setRefreshing(false);
  };

  const handleQuotePress = (request: ServiceRequest) => {
    setSelectedRequest(request);
    if (request.myQuote) {
      setQuotedPrice(request.myQuote.quotedPrice.toString());
      setQuoteMessage(request.myQuote.message || '');
    } else {
      setQuotedPrice('');
      setQuoteMessage('');
    }
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = async () => {
    if (!selectedRequest || !user) return;
    if (!quotedPrice) {
      Alert.alert('Error', 'Please enter quoted price');
      return;
    }
    try {
      setSubmitting(true);
      const quoteData = {
        serviceRequestId: selectedRequest._id,
        workerId: user.id,
        workerName: user.name,
        workerPhone: user.phoneNumber,
        quotedPrice: parseFloat(quotedPrice),
        message: quoteMessage,
      };
      await api.submitQuote(quoteData);
      Alert.alert('Success', 'Quote submitted successfully!');
      setShowQuoteModal(false);
      fetchPendingRequests();
    } catch (error: any) {
      console.error('[Jobs] Error submitting quote:', error);
      Alert.alert(
        'Error',
        error.response?.data?.msg || 'Failed to submit quote',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels: Record<string, string> = {
      asap: 'ASAP',
      today: 'Today',
      tomorrow: 'Tomorrow',
      scheduled: 'Scheduled',
    };
    return labels[urgency] || urgency;
  };

  const openMaps = (lat: number, lng: number, label: string) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  const renderNewEnquiryCard = (request: ServiceRequest) => {
    const isHighlighted = request._id === highlightedJobId;
    const distance = calculateDistance(
      workerLocation?.latitude,
      workerLocation?.longitude,
      request.location.coordinates?.lat,
      request.location.coordinates?.lng,
    );
    const hasCoords =
      request.location.coordinates?.lat && request.location.coordinates?.lng;

    return (
      <TouchableOpacity
        key={request._id}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate(
            'EnquiryDetails' as never,
            { jobId: request._id } as never,
          )
        }
        style={[
          styles.jobCard,
          styles.newJobCard,
          isHighlighted && {
            borderColor: COLORS.primary,
            borderWidth: 2,
            backgroundColor: COLORS.primary + '10',
          },
        ]}
      >
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>

        {/* Header: Customer & Basic Loc */}
        <View style={styles.customerSection}>
          <View style={styles.customerIconPlaceholder}>
            <Icon name="account" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{request.customerName}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 2,
              }}
            >
              <Icon name="map-marker" size={14} color={COLORS.textSecondary} />
              <Text
                style={[styles.locationText, { color: COLORS.textSecondary }]}
              >
                {request.location.area || request.location.city || 'Location'}
              </Text>
            </View>
          </View>
          {distance && (
            <View style={styles.distanceBadge}>
              <Icon name="map-marker-distance" size={14} color={COLORS.white} />
              <Text style={styles.distanceText}>{distance} km</Text>
            </View>
          )}
        </View>

        {/* Job Details */}
        <View style={styles.jobDetails}>
          <Text style={styles.jobTitle}>{request.serviceType}</Text>
          <Text style={styles.jobDescription} numberOfLines={2}>
            {request.description}
          </Text>
        </View>

        {/* Address Preview */}
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Location:</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {request.location.address}
          </Text>
        </View>

        {/* Map Preview */}
        {hasCoords && (
          <View
            style={{
              height: 100,
              borderRadius: 12,
              overflow: 'hidden',
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: request.location.coordinates!.lat,
                longitude: request.location.coordinates!.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            />
            {/* Overlay to prevent map interaction but allow card press */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'transparent',
              }}
            />
          </View>
        )}

        {request.scheduledDate && (
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledText}>
              📅 Scheduled: {new Date(request.scheduledDate).toLocaleString()}
            </Text>
          </View>
        )}

        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Icon name="cash" size={18} color={COLORS.success} />
            <Text style={styles.metaText}>
              ₹{request.budget.toLocaleString()}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Icon name="clock-fast" size={18} color={COLORS.warning} />
            <Text style={styles.metaText}>
              {getUrgencyLabel(request.urgency)}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Icon name="clock-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{getTimeAgo(request.createdAt)}</Text>
          </View>
        </View>

        {/* Tap to View CTA */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 10,
          }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
            Tap to View Details & Offer
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderActiveJobCard = (request: ServiceRequest) => (
    <View
      key={request._id}
      style={[
        styles.jobCard,
        { borderLeftColor: COLORS.success, borderLeftWidth: 4 },
      ]}
    >
      <View style={[styles.newBadge, { backgroundColor: COLORS.success }]}>
        <Text style={styles.newBadgeText}>ACTIVE</Text>
      </View>

      <View style={styles.customerSection}>
        <View style={styles.customerIconPlaceholder}>
          {/* @ts-ignore */}
          <Icon name="account" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{request.customerName}</Text>
          <Text style={styles.customerPhone}>{request.customerPhone}</Text>
        </View>
        <TouchableOpacity
          style={[styles.callButton, { paddingHorizontal: 12, height: 36 }]}
          onPress={() => Linking.openURL(`tel:${request.customerPhone}`)}
        >
          <Icon name="phone" size={18} color={COLORS.success} />
        </TouchableOpacity>
      </View>

      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{request.serviceType}</Text>
        <Text style={styles.jobDescription} numberOfLines={2}>
          {request.description}
        </Text>
      </View>

      {/* Active Job Address - Always Full */}
      <View
        style={[
          styles.addressContainer,
          { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
        ]}
      >
        <Text style={[styles.addressLabel, { color: '#166534' }]}>
          Location to Visit:
        </Text>
        <Text style={[styles.addressText, { color: '#15803D' }]}>
          {request.location.address}
        </Text>
        {request.location.coordinates && (
          <TouchableOpacity
            style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}
            onPress={() =>
              openMaps(
                request.location.coordinates!.lat,
                request.location.coordinates!.lng,
                request.customerName,
              )
            }
          >
            <Icon name="map-marker-radius" size={16} color="#15803D" />
            <Text
              style={{ color: '#15803D', fontWeight: 'bold', marginLeft: 4 }}
            >
              Navigate
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Icon name="cash" size={18} color={COLORS.success} />
          <Text style={styles.metaText}>
            ₹{request.budget.toLocaleString()} (Agreed)
          </Text>
        </View>
      </View>

      <View style={styles.jobActions}>
        <TouchableOpacity
          style={[
            styles.respondButton,
            { backgroundColor: COLORS.primary, flex: 1 },
          ]}
          onPress={() =>
            navigation.navigate(
              'EnquiryDetails' as never,
              { jobId: request._id } as never,
            )
          }
        >
          <Text style={styles.respondButtonText}>View Details / Start Job</Text>
          <Icon name="arrow-right" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuoteModal = () => (
    <Modal
      visible={showQuoteModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowQuoteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Submit Quote</Text>
            <TouchableOpacity onPress={() => setShowQuoteModal(false)}>
              <Icon name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {selectedRequest && (
            <View style={styles.requestSummary}>
              <Text style={styles.summaryTitle}>
                {selectedRequest.serviceType}
              </Text>
              <Text style={styles.summaryText}>
                {selectedRequest.description}
              </Text>
              <Text style={styles.summaryBudget}>
                Customer Budget: ₹{selectedRequest.budget.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Quoted Price *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={quotedPrice}
                onChangeText={setQuotedPrice}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any details or notes..."
              multiline
              numberOfLines={3}
              value={quoteMessage}
              onChangeText={setQuoteMessage}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitQuote}
            disabled={submitting}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit Quote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header variant="simple" title="Jobs" />

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
              New Enquiries
            </Text>
            {pendingRequests.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>
                  {pendingRequests.length}
                </Text>
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
            {activeRequests.length > 0 && (
              <View
                style={[styles.tabBadge, { backgroundColor: COLORS.success }]}
              >
                <Text style={styles.tabBadgeText}>{activeRequests.length}</Text>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View>
            {selectedTab === 'new' && (
              <>
                {loading ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      Loading requests...
                    </Text>
                  </View>
                ) : pendingRequests.length > 0 ? (
                  pendingRequests.map(renderNewEnquiryCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Icon
                      name="briefcase-outline"
                      size={80}
                      color={COLORS.gray300}
                    />
                    <Text style={styles.emptyStateTitle}>No New Enquiries</Text>
                    <Text style={styles.emptyStateText}>
                      New service requests will appear here
                    </Text>
                  </View>
                )}
              </>
            )}

            {selectedTab === 'active' && (
              <>
                {loading ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      Loading active jobs...
                    </Text>
                  </View>
                ) : activeRequests.length > 0 ? (
                  activeRequests.map(renderActiveJobCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Icon
                      name="briefcase-clock"
                      size={80}
                      color={COLORS.gray300}
                    />
                    <Text style={styles.emptyStateTitle}>No Active Jobs</Text>
                    <Text style={styles.emptyStateText}>
                      Your ongoing jobs will appear here
                    </Text>
                  </View>
                )}
              </>
            )}

            {selectedTab === 'completed' && (
              <View style={styles.emptyState}>
                <Icon
                  name="check-circle-outline"
                  size={80}
                  color={COLORS.gray300}
                />
                <Text style={styles.emptyStateTitle}>No Completed Jobs</Text>
                <Text style={styles.emptyStateText}>
                  Your completed jobs will appear here
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {renderQuoteModal()}
      </View>
    </SafeAreaView>
  );
};

export default JobsListScreen;
