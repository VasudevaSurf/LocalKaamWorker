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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  };
  budget: number;
  urgency: string;
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
    checkInitialTab();
  }, []);

  // Handle Highlight Params
  useEffect(() => {
    // @ts-ignore
    const { highlightJobId } = route.params || {};
    if (highlightJobId) {
      console.log('[Jobs] Highlighting job:', highlightJobId);
      // Ensure we are on the tab containing the job (usually 'new' for notifications)
      setSelectedTab('new');
      setHighlightedJobId(highlightJobId);

      // Clear highlight after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedJobId(null);
        // Clear param so it doesn't re-trigger on simple re-renders?
        // Note: Param persistence is handled by navigation, we depend on manual clear in state
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
    // Listen for new requests
    SocketService.onNewRequest(data => {
      console.log('[Jobs] New request received:', data);
      if (selectedTab === 'new') {
        fetchPendingRequests();
      }
    });

    // Listen for accepted requests
    SocketService.onRequestAccepted(data => {
      console.log('[Jobs] Request accepted:', data);
      if (data.workerId === user?.id) {
        Alert.alert('Congratulations! 🎉', 'Your quote has been accepted!');
        setSelectedTab('active');
        fetchActiveRequests();
      } else {
        // Refresh list if another worker was accepted
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
      // Pass workerId to check for existing quotes
      console.log('[Jobs] Fetching requests for worker:', user?.id);
      const requests = await api.getPendingRequests(undefined, user?.id);
      console.log(
        '[Jobs] Received requests:',
        JSON.stringify(requests, null, 2),
      );
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
    if (selectedTab === 'new') {
      await fetchPendingRequests();
    } else if (selectedTab === 'active') {
      await fetchActiveRequests();
    }
    setRefreshing(false);
  };

  // ... (socket listeners remain same) ...

  const handleQuotePress = (request: ServiceRequest) => {
    setSelectedRequest(request);
    // Pre-fill if editing
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
      fetchPendingRequests(); // Refresh list
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

  const renderNewEnquiryCard = (request: ServiceRequest) => {
    const isHighlighted = request._id === highlightedJobId;
    return (
      <View
        key={request._id}
        style={[
          styles.jobCard,
          styles.newJobCard,
          isHighlighted && {
            borderColor: COLORS.primary,
            borderWidth: 2,
            backgroundColor: COLORS.primary + '10', // Slight tint
          },
        ]}
      >
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>

        <View style={styles.customerSection}>
          <View style={styles.customerIconPlaceholder}>
            <Icon name="account" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{request.customerName}</Text>
            <Text style={styles.customerPhone}>{request.customerPhone}</Text>
          </View>
          <View style={styles.locationBadge}>
            <Icon name="map-marker" size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>
              {request.location.city || 'Nearby'}
            </Text>
          </View>
        </View>

        <View style={styles.jobDetails}>
          <Text style={styles.jobTitle}>{request.serviceType}</Text>
          <Text style={styles.jobDescription} numberOfLines={2}>
            {request.description}
          </Text>
        </View>

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

        <View style={styles.jobActions}>
          {request.myQuote ? (
            <View style={{ flex: 1, flexDirection: 'row', gap: 12 }}>
              {request.myQuote.quotedPrice === request.budget &&
              request.myQuote.status === 'accepted' ? (
                <View
                  style={[
                    styles.callButton,
                    {
                      backgroundColor: COLORS.success,
                      borderColor: COLORS.success,
                    },
                  ]}
                >
                  <Text
                    style={[styles.callButtonText, { color: COLORS.white }]}
                  >
                    Accepted ₹{request.myQuote.quotedPrice}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.callButton,
                    {
                      backgroundColor: COLORS.success + '10',
                      borderColor: COLORS.success,
                    },
                  ]}
                  onPress={() => {
                    // Quick accept at budget price
                    Alert.alert(
                      'Accept Request',
                      `Do you want to accept this job for ₹${request.budget}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Accept',
                          onPress: async () => {
                            if (!user) return;
                            try {
                              setSubmitting(true);
                              await api.submitQuote({
                                serviceRequestId: request._id,
                                workerId: user.id,
                                workerName: user.name,
                                workerPhone: user.phoneNumber,
                                quotedPrice: request.budget,
                                message: 'I accept your budget.',
                              });
                              Alert.alert('Success', 'Quote submitted!');
                              fetchPendingRequests();
                            } catch (err) {
                              Alert.alert('Error', 'Failed to submit quote');
                            } finally {
                              setSubmitting(false);
                            }
                          },
                        },
                      ],
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.callButtonText, { color: COLORS.success }]}
                  >
                    Accept ₹{request.budget}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.respondButton,
                  { backgroundColor: COLORS.warning },
                ]}
                onPress={() => handleQuotePress(request)}
                activeOpacity={0.7}
              >
                <Text style={styles.respondButtonText}>
                  Change Offer
                  {request.myQuote.quotedPrice !== request.budget
                    ? ` (₹${request.myQuote.quotedPrice})`
                    : ''}
                </Text>
                <Icon name="pencil" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[
                  styles.callButton,
                  {
                    backgroundColor: COLORS.success + '10',
                    borderColor: COLORS.success,
                  },
                ]}
                onPress={() => {
                  // Quick accept at budget price
                  Alert.alert(
                    'Accept Request',
                    `Do you want to accept this job for ₹${request.budget}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Accept',
                        onPress: async () => {
                          if (!user) return;
                          try {
                            setSubmitting(true);
                            await api.submitQuote({
                              serviceRequestId: request._id,
                              workerId: user.id,
                              workerName: user.name,
                              workerPhone: user.phoneNumber,
                              quotedPrice: request.budget,
                              message: 'I accept your budget.',
                            });
                            Alert.alert('Success', 'Quote submitted!');
                            fetchPendingRequests();
                          } catch (err) {
                            Alert.alert('Error', 'Failed to submit quote');
                          } finally {
                            setSubmitting(false);
                          }
                        },
                      },
                    ],
                  );
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.callButtonText, { color: COLORS.success }]}
                >
                  Accept ₹{request.budget}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.respondButton}
                onPress={() => handleQuotePress(request)}
                activeOpacity={0.7}
              >
                <Text style={styles.respondButtonText}>Offer</Text>
                <Icon name="arrow-right" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

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
          onPress={() =>
            Alert.alert('Call', `Calling ${request.customerName}...`)
          }
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

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Icon name="cash" size={18} color={COLORS.success} />
          <Text style={styles.metaText}>
            ₹{request.budget.toLocaleString()} (Agreed)
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="map-marker" size={18} color={COLORS.error} />
          <Text style={styles.metaText}>{request.location.address}</Text>
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
              'JobDetails' as never,
              { jobId: request._id } as never,
            )
          }
        >
          <Text style={styles.respondButtonText}>View Details</Text>
          <Icon name="arrow-right" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header variant="simple" title="Jobs" />

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {/* ... (Tabs remain same) ... */}
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
