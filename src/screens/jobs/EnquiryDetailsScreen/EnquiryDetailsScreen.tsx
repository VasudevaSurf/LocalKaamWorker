import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import { COLORS, FONTS } from '../../../utils';
import * as api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = 'AIzaSyARG70FxQ0jRcAQMymHstMiFccbW0BN8Lo';

const EnquiryDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params as { jobId: string };
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workerLocation, setWorkerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Quote State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotedPrice, setQuotedPrice] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Route Info State
  const [realDistance, setRealDistance] = useState<string | null>(null);
  const [realDuration, setRealDuration] = useState<string | null>(null);
  const [useDirectRoute, setUseDirectRoute] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    fetchJobDetails();
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      getCurrentLocation();
    }
  }, [jobId]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
        setLocationError(true);
      }
    } catch (err) {
      console.warn(err);
      setLocationError(true);
    }
  };

  const getCurrentLocation = () => {
    setLocationError(false);
    // Try High Accuracy First
    Geolocation.getCurrentPosition(
      position => {
        console.log('Got Worker Location (High Accuracy):', position);
        setWorkerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('High accuracy failed:', error.message);
        // Immediately try Low Accuracy
        Geolocation.getCurrentPosition(
          position => {
            console.log('Got Worker Location (Low Accuracy):', position);
            setWorkerLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          err => {
            console.log('Low accuracy also failed:', err.message);
            setLocationError(true);
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 },
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getServiceRequestById(jobId);
      setJob(data);
      if (data.myQuote) {
        setQuotedPrice(data.myQuote.quotedPrice.toString());
        setQuoteMessage(data.myQuote.message || '');
      } else {
        setQuotedPrice(data.budget.toString());
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      Alert.alert('Error', 'Failed to load job details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!user) return;
    Alert.alert('Accept Job', `Accept this job for ₹${job.budget}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: async () => {
          try {
            setSubmitting(true);
            await api.submitQuote({
              serviceRequestId: job._id,
              workerId: user.id,
              workerName: user.name,
              workerPhone: user.phoneNumber,
              quotedPrice: job.budget,
              message: 'I accept your budget.',
            });
            Alert.alert('Success', 'Job Accepted!');
            fetchJobDetails();
          } catch (err) {
            Alert.alert('Error', 'Failed to accept job');
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  };

  // Keep for fallback calculation if directions fail
  const calculateDistanceFallback = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleSubmitQuote = async () => {
    if (!user) return;
    if (!quotedPrice) {
      Alert.alert('Error', 'Please enter a price');
      return;
    }
    try {
      setSubmitting(true);
      await api.submitQuote({
        serviceRequestId: job._id,
        workerId: user.id,
        workerName: user.name,
        workerPhone: user.phoneNumber,
        quotedPrice: parseFloat(quotedPrice),
        message: quoteMessage,
      });
      Alert.alert('Success', 'Offer Submitted!');
      setShowQuoteModal(false);
      fetchJobDetails();
    } catch (err) {
      Alert.alert('Error', 'Failed to submit offer');
    } finally {
      setSubmitting(false);
    }
  };

  const openNavigation = () => {
    if (!job?.location?.coordinates) return;
    const { lat, lng } = job.location.coordinates;
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${lat},${lng}`;
    const label = job.customerName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    if (url) Linking.openURL(url);
  };

  const handleCall = () => {
    if (job?.customerPhone) {
      Linking.openURL(`tel:${job.customerPhone}`);
    } else {
      Alert.alert('Info', 'Customer phone not available yet.');
    }
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
              setSubmitting(true);
              await api.cancelJob(jobId, user.id);
              Alert.alert('Job Cancelled', 'You have cancelled this job.');
              navigation.navigate('JobsList' as never);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel job.');
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  const navigateToCompletion = () => {
    navigation.navigate(
      'JobCompletion' as never,
      { requestId: job._id } as never,
    );
  };

  if (loading || !job) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isJobActive =
    job.status === 'accepted' ||
    (job.myQuote && job.myQuote.status === 'accepted');

  return (
    <View style={styles.container}>
      {/* Top Map Section */}
      <View style={styles.mapContainer}>
        {job.location.coordinates && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: job.location.coordinates.lat,
              longitude: job.location.coordinates.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Job Location */}
            <Marker
              coordinate={{
                latitude: job.location.coordinates.lat,
                longitude: job.location.coordinates.lng,
              }}
              title={job.customerName}
              description="Job Location"
              pinColor={COLORS.primary}
            />

            {/* Worker Location */}
            {workerLocation && (
              <Marker
                coordinate={workerLocation}
                title="You"
                pinColor={COLORS.success}
              />
            )}

            {/* Real Driving Route */}
            {workerLocation && !useDirectRoute && (
              <MapViewDirections
                origin={workerLocation}
                destination={{
                  latitude: job.location.coordinates.lat,
                  longitude: job.location.coordinates.lng,
                }}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor={COLORS.primary}
                onReady={result => {
                  setRealDistance(result.distance.toFixed(1) + ' km');
                  setRealDuration(result.duration.toFixed(0) + ' min');
                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 50,
                      bottom: 50,
                      left: 50,
                      top: 50,
                    },
                  });
                }}
                onError={errorMessage => {
                  console.log('GOT DIRECTIONS ERROR', errorMessage);
                  setUseDirectRoute(true);
                }}
              />
            )}

            {/* Fallback Direct Line */}
            {workerLocation && useDirectRoute && (
              <Polyline
                coordinates={[
                  workerLocation,
                  {
                    latitude: job.location.coordinates.lat,
                    longitude: job.location.coordinates.lng,
                  },
                ]}
                strokeColor={COLORS.primary}
                strokeWidth={4}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        )}

        {/* Distance Badge / Info Overlay */}
        {job.location.coordinates &&
          (workerLocation ? (
            <View style={styles.distanceBadge}>
              <Icon name="map-marker-distance" size={16} color={COLORS.white} />
              <Text style={styles.distanceText}>
                {realDistance ||
                  calculateDistanceFallback(
                    workerLocation.latitude,
                    workerLocation.longitude,
                    job.location.coordinates.lat,
                    job.location.coordinates.lng,
                  ) + ' km (Direct)'}
              </Text>
              {realDuration && (
                <Text
                  style={[
                    styles.distanceText,
                    { marginLeft: 4, opacity: 0.9, fontSize: 12 },
                  ]}
                >
                  ({realDuration})
                </Text>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.distanceBadge,
                { backgroundColor: COLORS.gray400 },
              ]}
            >
              <ActivityIndicator size="small" color={COLORS.white} />
              <Text style={styles.distanceText}>Locating...</Text>
            </View>
          ))}

        {/* Location Error Retry */}
        {locationError && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.retryButtonText}>Retry GPS ⟳</Text>
          </TouchableOpacity>
        )}

        {/* Back Button Overlay */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View>
              <Text style={styles.serviceType}>{job.customerName}</Text>
              <Text style={styles.customerName}>
                Looking for {job.serviceType}
                {isJobActive && job.customerPhone
                  ? ` • ${job.customerPhone}`
                  : ''}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{job.budget}</Text>
              <Text style={styles.priceLabel}>Budget</Text>
            </View>
          </View>

          {/* Active Job Actions (Top of details if active) */}
          {isJobActive && (
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                <Icon name="phone" size={20} color={COLORS.white} />
                <Text style={styles.callButtonText}>Call Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.callButton, { backgroundColor: 'green' }]}
                onPress={() =>
                  Linking.openURL(
                    `whatsapp://send?phone=${job.customerPhone?.replace(
                      '+',
                      '',
                    )}&text=Hi`,
                  )
                }
              >
                <Icon name="whatsapp" size={20} color={COLORS.white} />
                <Text style={styles.callButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Location & Navigation */}
          <View style={styles.section}>
            <View style={[styles.row, { alignItems: 'flex-start' }]}>
              <Icon
                name="map-marker"
                size={20}
                color={COLORS.error}
                style={{ marginTop: 2 }}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.addressText}>{job.location.address}</Text>
                <TouchableOpacity onPress={openNavigation}>
                  <Text style={styles.navLink}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaTag}>
              <Icon name="clock-fast" size={16} color={COLORS.warning} />
              <Text style={styles.metaTagText}>
                {job.urgency.toUpperCase()}
              </Text>
            </View>
            <View style={styles.metaTag}>
              <Icon
                name="calendar-clock"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.metaTagText}>
                {job.scheduledDate
                  ? new Date(job.scheduledDate).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })
                  : new Date(job.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {isJobActive && (
              <View
                style={[
                  styles.metaTag,
                  { backgroundColor: COLORS.success + '20' },
                ]}
              >
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text
                  style={[
                    styles.metaTagText,
                    { color: COLORS.success, fontWeight: 'bold' },
                  ]}
                >
                  Accepted
                </Text>
              </View>
            )}
          </View>

          {/* Bottom padding for buttons */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Actions: Active vs Pending */}
        {isJobActive ? (
          <View style={styles.footerActions}>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                { backgroundColor: COLORS.error, flex: 1 },
              ]}
              onPress={handleCancelJob}
            >
              <Text style={styles.acceptButtonText}>Cancel Job</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                { backgroundColor: COLORS.primary, flex: 2 },
              ]}
              onPress={navigateToCompletion}
            >
              <Text style={styles.acceptButtonText}>Complete Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          job.status === 'pending' && (
            <View style={styles.footerActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAccept}
              >
                <Text style={styles.acceptButtonText}>
                  Accept ₹{job.budget}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.offerButton}
                onPress={() => setShowQuoteModal(true)}
              >
                <Text style={styles.offerButtonText}>Make Offer</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>

      {/* Quote Modal */}
      <Modal
        visible={showQuoteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.sectionTitle}>Make an Offer</Text>
              <TouchableOpacity onPress={() => setShowQuoteModal(false)}>
                <Icon name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Your Price (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={quotedPrice}
              onChangeText={setQuotedPrice}
              placeholder="Enter amount"
            />

            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              multiline
              value={quoteMessage}
              onChangeText={setQuoteMessage}
              placeholder="Why should they pick you?"
            />

            <TouchableOpacity
              style={[styles.fullWidthButton, submitting && { opacity: 0.7 }]}
              onPress={handleSubmitQuote}
              disabled={submitting}
            >
              <Text style={styles.fullWidthButtonText}>
                {submitting ? 'Sending...' : 'Send Offer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mapContainer: {
    height: height * 0.45, // Top 45%
    width: '100%',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },
  distanceBadge: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 5,
    gap: 6,
  },
  distanceText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -20, // Overlap map slightly
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceType: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  customerName: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.success,
  },
  priceLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  navLink: {
    marginTop: 4,
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  metaTagText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerActions: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 16,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  offerButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  offerButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    marginBottom: 16,
    color: COLORS.textPrimary,
  },
  fullWidthButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  fullWidthButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
  },
  callButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});

export default EnquiryDetailsScreen;
