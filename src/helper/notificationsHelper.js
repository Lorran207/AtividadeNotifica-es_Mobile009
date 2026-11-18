import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannelAsync() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'Chamadas',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#00796B',
    sound: 'default',
  });
}

export async function registerForLocalNotificationsAsync() {
  await ensureAndroidChannelAsync();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permissão negada',
      'Sem permissão para notificações. Ative as notificações do Expo Go nas configurações do celular.'
    );
    return false;
  }
  return true;
}

export async function triggerLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: 'default',
    },
    trigger: null,
  });
}
