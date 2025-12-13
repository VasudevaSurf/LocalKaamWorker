import messaging from '@react-native-firebase/messaging';
import { updateFcmToken } from './api';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

class NotificationService {
  async requestUserPermission() {
    // Android 13+ requires runtime permission for notifications
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log(
          '[NotificationService] POST_NOTIFICATIONS permission denied',
        );
        return false;
      }
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('[NotificationService] Authorization status:', authStatus);
      return true;
    }
    return false;
  }

  async getFCMToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('[NotificationService] FCM Token:', fcmToken);
        return fcmToken;
      }
    } catch (error) {
      console.error('[NotificationService] Failed to get FCM token:', error);
    }
    return null;
  }

  async registerAppWithFCM(userId: string) {
    try {
      console.log('[NotificationService] Registering app with FCM...');
      const hasPermission = await this.requestUserPermission();

      if (hasPermission) {
        const fcmToken = await this.getFCMToken();
        if (fcmToken) {
          // Send to backend
          await updateFcmToken(userId, fcmToken);
        }
      }
    } catch (error) {
      console.error('[NotificationService] Registration failed:', error);
    }
  }

  // Setup listeners
  setupForegroundHandler(onNotification?: (notification: any) => void) {
    return messaging().onMessage(async remoteMessage => {
      console.log('[NotificationService] Foreground Message:', remoteMessage);

      // Show simple alert for now, or use callback to handle navigation
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'New Notification',
          remoteMessage.notification.body || '',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'View',
              onPress: () => {
                if (onNotification) {
                  onNotification(remoteMessage);
                }
              },
            },
          ],
        );
      }
    });
  }

  // Handle background state opening (App in background -> Tap -> Open)
  onNotificationOpenedApp(onOpen: (remoteMessage: any) => void) {
    return messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        '[NotificationService] Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage) {
        onOpen(remoteMessage);
      }
    });
  }

  // Handle quit state opening (App killed -> Tap -> Open)
  async checkInitialNotification(onOpen: (remoteMessage: any) => void) {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      console.log(
        '[NotificationService] Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
      onOpen(remoteMessage);
      return remoteMessage;
    }
    return null;
  }
}

export default new NotificationService();
