import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { updateFcmToken } from './api';
import { Platform, PermissionsAndroid } from 'react-native';

class NotificationService {
  constructor() {
    console.log('[NotificationService] Constructor called');
    this.createDefaultChannel();
    // Debug Alert to confirm code update
    // Alert.alert("Debug", "Notification Service v6 Init");
    // Commented out to avoid annoying user if it works, but logging is key.
  }

  async createDefaultChannel() {
    await notifee.createChannel({
      id: 'job_alerts_v6',
      name: 'Job Alerts',
      sound: 'job_alert_sound',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      vibration: true,
      vibrationPattern: [300, 500],
    });
    console.log('[NotificationService] Channel "job_alerts_v6" created');
  }

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
        await this.createDefaultChannel();
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

      // Display notification using Notifee to ensure sound plays
      if (remoteMessage.notification) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
          android: {
            channelId: 'job_alerts_v6',
            smallIcon: 'ic_launcher', // Ensure this exists or use default
            pressAction: {
              id: 'default',
            },
            // Explicitly set sound again just in case (channel dictates it mainly)
            sound: 'job_alert_sound',
          },
        });
      }

      // Also trigger callback for in-app UI updates if needed
      if (onNotification) {
        onNotification(remoteMessage);
      }
    });
  }

  // Handle background state opening (App in background -> Tap -> Open)
  onNotificationOpenedApp(onOpen: (remoteMessage: any) => void) {
    // 1. Firebase Background Tap
    const unsubscribeFirebase = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          '[NotificationService] Firebase Background Open:',
          remoteMessage,
        );
        if (remoteMessage) onOpen(remoteMessage);
      },
    );

    // 2. Notifee Foreground/Background Tap (since we display it manually now)
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1 && detail.notification) {
        // PRESS event
        console.log(
          '[NotificationService] Notifee Foreground Tap:',
          detail.notification,
        );
        // Convert Notifee notification structure to resemble Firebase remoteMessage if needed,
        // but usually we just need the data.
        const remoteMessage = {
          data: detail.notification.data,
          notification: {
            title: detail.notification.title,
            body: detail.notification.body,
          },
        };
        onOpen(remoteMessage);
      }
    });

    return () => {
      unsubscribeFirebase();
      unsubscribeNotifee();
    };
  }

  // Handle quit state opening (App killed -> Tap -> Open)
  async checkInitialNotification(onOpen: (remoteMessage: any) => void) {
    // Check Firebase
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      console.log(
        '[NotificationService] Notification caused app to open from quit state (Firebase):',
        remoteMessage.notification,
      );
      onOpen(remoteMessage);
      return remoteMessage;
    }

    // Check Notifee (if launched via local notification press)
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log(
        '[NotificationService] Notification caused app to open from quit state (Notifee):',
        initialNotification.notification,
      );
      const rMessage = {
        data: initialNotification.notification.data,
        notification: {
          title: initialNotification.notification.title,
          body: initialNotification.notification.body,
        },
      };
      onOpen(rMessage);
      return rMessage;
    }

    return null;
  }
}

export default new NotificationService();
