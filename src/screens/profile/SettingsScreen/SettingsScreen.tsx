import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './SettingsScreen.styles';
import { COLORS } from '../../../utils';
import Header from '../../../components/Header/Header';

const SettingsScreen = () => {
  const navigation = useNavigation();

  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);

  // App Settings
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [dataSync, setDataSync] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be available soon');
  };

  const handleLanguage = () => {
    Alert.alert('Language', 'Select your preferred language', [
      { text: 'English', onPress: () => {} },
      { text: 'हिंदी (Hindi)', onPress: () => {} },
      { text: 'ਪੰਜਾਬੀ (Punjabi)', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear temporary files and free up space. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => Alert.alert('Success', 'Cache cleared successfully'),
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Account Deletion',
              'Please contact support to delete your account',
            ),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          variant="simple"
          showBack
          onBackPress={handleBack}
          title="Settings"
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="bell" size={22} color={COLORS.primary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive app notifications
                    </Text>
                  </View>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon
                    name="briefcase-outline"
                    size={22}
                    color={COLORS.success}
                  />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Job Alerts</Text>
                    <Text style={styles.settingDescription}>
                      New job inquiry notifications
                    </Text>
                  </View>
                </View>
                <Switch
                  value={jobAlerts}
                  onValueChange={setJobAlerts}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="message" size={22} color={COLORS.info} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Messages</Text>
                    <Text style={styles.settingDescription}>
                      Customer message notifications
                    </Text>
                  </View>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="cash" size={22} color={COLORS.success} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Payment Alerts</Text>
                    <Text style={styles.settingDescription}>
                      Payment received notifications
                    </Text>
                  </View>
                </View>
                <Switch
                  value={paymentAlerts}
                  onValueChange={setPaymentAlerts}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="eye" size={22} color={COLORS.primary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Profile Visibility</Text>
                    <Text style={styles.settingDescription}>
                      Show profile to customers
                    </Text>
                  </View>
                </View>
                <Switch
                  value={profileVisibility}
                  onValueChange={setProfileVisibility}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="phone" size={22} color={COLORS.success} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Phone Number</Text>
                    <Text style={styles.settingDescription}>
                      Display phone on profile
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showPhone}
                  onValueChange={setShowPhone}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="map-marker" size={22} color={COLORS.error} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Location</Text>
                    <Text style={styles.settingDescription}>
                      Display city on profile
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showLocation}
                  onValueChange={setShowLocation}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.settingsCard}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleChangePassword}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Icon name="lock" size={22} color={COLORS.warning} />
                  <Text style={styles.settingTitle}>Change Password</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleLanguage}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Icon name="translate" size={22} color={COLORS.info} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Language</Text>
                    <Text style={styles.settingDescription}>English</Text>
                  </View>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>

            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="play-circle" size={22} color={COLORS.primary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Auto-play Videos</Text>
                    <Text style={styles.settingDescription}>
                      Play videos automatically
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoPlayVideos}
                  onValueChange={setAutoPlayVideos}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="sync" size={22} color={COLORS.success} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Auto Sync</Text>
                    <Text style={styles.settingDescription}>
                      Sync data automatically
                    </Text>
                  </View>
                </View>
                <Switch
                  value={dataSync}
                  onValueChange={setDataSync}
                  trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleClearCache}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Icon name="delete-sweep" size={22} color={COLORS.warning} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Clear Cache</Text>
                    <Text style={styles.settingDescription}>
                      Free up storage space
                    </Text>
                  </View>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>

            <View style={styles.settingsCard}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                  Alert.alert(
                    'Terms & Conditions',
                    'View our terms and conditions',
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Icon
                    name="file-document"
                    size={22}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.settingTitle}>Terms & Conditions</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                  Alert.alert('Privacy Policy', 'View our privacy policy')
                }
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Icon name="shield-check" size={22} color={COLORS.success} />
                  <Text style={styles.settingTitle}>Privacy Policy</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                  Alert.alert('Version', 'SkillProof Worker v1.0.0')
                }
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <Icon name="information" size={22} color={COLORS.info} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>App Version</Text>
                    <Text style={styles.settingDescription}>v1.0.0</Text>
                  </View>
                </View>
                <Icon
                  name="chevron-right"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <Icon name="delete-forever" size={22} color={COLORS.error} />
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
