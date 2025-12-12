import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
      console.log('[v0] Expo push token:', token.data);
    } catch (error) {
      console.log('[v0] Error getting push token:', error);
    }
  };

  const sendLocalNotification = async (
    title: string,
    body: string,
    data?: any
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.log('[v0] Error sending notification:', error);
    }
  };

  return {
    expoPushToken,
    sendLocalNotification,
  };
}
